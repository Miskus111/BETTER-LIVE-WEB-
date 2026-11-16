import { readFileSync } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { AI_MODEL, fallbackParams, getAnthropic } from '@/lib/ai/client'
import { coachDailyLimit, hasAccess, type Plan } from '@/lib/billing'
import { EATING_INSTRUCTION, FIXED_REPLY, screenMessage } from '@/lib/coach/safety'
import { COACH_TOOLS, runCoachTool } from '@/lib/coach/tools'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 120

const SYSTEM_PROMPT = readFileSync(path.join(process.cwd(), 'system-prompt.md'), 'utf8')
const MAX_TURNS = 6

const Body = z.object({
  conversationId: z.string().uuid().nullable().optional(),
  message: z.string().trim().min(1).max(4000),
  locale: z.enum(['cs', 'en']).default('cs'),
})

type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

export async function POST(req: Request) {
  const s = await getSession()
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (!s.healthConsent) return NextResponse.json({ error: 'consent_required' }, { status: 403 })
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const { message, locale } = parsed.data
  const db = s.supabase as unknown as Db

  const { data: sub } = await db.from('subscriptions').select('plan').eq('user_id', s.user.id).maybeSingle()
  const plan = (sub?.plan ?? 'free') as Plan
  if (!hasAccess('coach', plan)) return NextResponse.json({ error: 'upgrade' }, { status: 402 })

  // daily cap, counted from the user's own messages (RLS-visible, no service key needed)
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const { count } = await db
    .from('coach_messages')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'user')
    .gte('created_at', start.toISOString())
  const limit = coachDailyLimit(plan)
  if ((count ?? 0) >= limit) return NextResponse.json({ error: 'limit', limit }, { status: 429 })

  // conversation
  let conversationId = parsed.data.conversationId ?? null
  if (conversationId) {
    const { data } = await db.from('coach_conversations').select('id').eq('id', conversationId).maybeSingle()
    if (!data) conversationId = null
  }
  if (!conversationId) {
    const { data, error } = await db
      .from('coach_conversations')
      .insert({ title: message.slice(0, 60) })
      .select('id')
      .single()
    if (error || !data) return NextResponse.json({ error: 'db' }, { status: 500 })
    conversationId = data.id as string
  }
  const { data: history } = await db
    .from('coach_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .in('role', ['user', 'assistant'])
    .order('created_at', { ascending: false })
    .limit(20)

  const save = async (reply: string, tools: string[] = []) => {
    await db.from('coach_messages').insert([
      { conversation_id: conversationId, role: 'user', content: message },
      {
        conversation_id: conversationId,
        role: 'assistant',
        content: reply,
        tool_calls: tools.length ? tools : null,
      },
    ])
    await db
      .from('coach_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
  }

  // safety pre-screen: emergencies and self-harm never reach the model
  const screen = screenMessage(message)
  if (screen === 'emergency' || screen === 'crisis') {
    const reply = FIXED_REPLY[screen][locale]
    await save(reply)
    return NextResponse.json({ conversationId, reply, safety: screen })
  }

  const ai = getAnthropic()
  if (!ai) return NextResponse.json({ error: 'ai_not_configured' }, { status: 503 })

  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...((history ?? []) as { role: 'user' | 'assistant'; content: string }[])
      .reverse()
      .filter((m) => m.content)
      .map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ]
  // the API requires the first message to be from the user
  while (messages.length && messages[0].role !== 'user') messages.shift()

  const system: Anthropic.Beta.BetaTextBlockParam[] = [
    { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    {
      type: 'text',
      text: `Today is ${new Date().toISOString().slice(0, 10)}. App language: ${locale}.${screen === 'eating' ? `\n\n${EATING_INSTRUCTION}` : ''}`,
    },
  ]

  const usedTools: string[] = []
  let inputTokens = 0
  let outputTokens = 0
  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const res = await ai.beta.messages.create({
        ...fallbackParams(),
        model: AI_MODEL,
        max_tokens: 16000,
        output_config: { effort: 'medium' },
        system,
        tools: COACH_TOOLS,
        messages,
      })
      inputTokens += res.usage.input_tokens
      outputTokens += res.usage.output_tokens
      if (res.stop_reason === 'refusal') {
        const reply =
          locale === 'cs'
            ? 'S tímhle vám bohužel pomoct nemůžu. Zkuste se zeptat jinak, nebo se obraťte na odborníka.'
            : "I can't help with that one. Try asking differently, or talk to a professional."
        await save(reply, usedTools)
        return NextResponse.json({ conversationId, reply })
      }
      const toolUses = res.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use')
      if (res.stop_reason !== 'tool_use' || !toolUses.length) {
        const reply = res.content
          .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('\n')
          .trim()
        await save(reply, usedTools)
        await recordUsage(s.user.id, inputTokens, outputTokens)
        return NextResponse.json({ conversationId, reply, tools: usedTools })
      }
      messages.push({ role: 'assistant', content: res.content })
      const results = await Promise.all(
        toolUses.map(async (tu): Promise<Anthropic.Beta.BetaToolResultBlockParam> => {
          usedTools.push(tu.name)
          try {
            return {
              type: 'tool_result',
              tool_use_id: tu.id,
              content: await runCoachTool(db, s.user.id, tu.name, tu.input),
            }
          } catch (e) {
            return {
              type: 'tool_result',
              tool_use_id: tu.id,
              is_error: true,
              content: e instanceof Error ? e.message : 'tool failed',
            }
          }
        }),
      )
      messages.push({ role: 'user', content: results })
    }
    return NextResponse.json({ error: 'too_many_steps' }, { status: 500 })
  } catch (e) {
    if (e instanceof Anthropic.APIError) console.error('[coach] Anthropic API error', e.status, e.message)
    if (e instanceof Anthropic.RateLimitError)
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
    if (e instanceof Anthropic.APIError) return NextResponse.json({ error: 'ai_error' }, { status: 502 })
    throw e
  }
}

/** Token accounting for cost monitoring; needs the service key (ai_usage is server-write-only). */
async function recordUsage(userId: string, input: number, output: number) {
  try {
    const admin = createServiceClient() as unknown as Db
    const day = new Date().toISOString().slice(0, 10)
    const { data } = await admin
      .from('ai_usage')
      .select('messages, input_tokens, output_tokens')
      .eq('user_id', userId)
      .eq('day', day)
      .maybeSingle()
    await admin.from('ai_usage').upsert({
      user_id: userId,
      day,
      messages: (data?.messages ?? 0) + 1,
      input_tokens: (data?.input_tokens ?? 0) + input,
      output_tokens: (data?.output_tokens ?? 0) + output,
    })
  } catch {
    // usage accounting must never break the chat
  }
}
