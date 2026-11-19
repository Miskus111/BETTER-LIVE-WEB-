import 'server-only'
import { createServiceClient } from '@/lib/supabase/server'

type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

/** Today's date in Czech time — the daily AI allowance resets at local midnight, not UTC. */
export const usageDay = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague' }).format(now)

function admin(): Db | null {
  try {
    return createServiceClient() as unknown as Db
  } catch {
    return null // no service key (local dev): callers fall back to their own counting
  }
}

/**
 * Reserve one AI call for today before calling the model. Counts live in ai_usage, which users can
 * read but never write (RLS), so the allowance can't be reset by deleting chat history.
 * Returns `null` when the service key is missing, `false` when the limit is used up.
 */
export async function reserveAiCall(userId: string, limit: number): Promise<boolean | null> {
  const db = admin()
  if (!db) return null
  const day = usageDay()
  const { data } = await db
    .from('ai_usage')
    .select('messages')
    .eq('user_id', userId)
    .eq('day', day)
    .maybeSingle()
  const used = (data?.messages as number | undefined) ?? 0
  if (used >= limit) return false
  // reserve the slot now, so parallel requests see it before the (slow) model call finishes
  const { error } = await db
    .from('ai_usage')
    .upsert({ user_id: userId, day, messages: used + 1 }, { onConflict: 'user_id,day' })
  return error ? null : true
}

/** Add the tokens a call actually used (also for refusals and aborted tool loops). */
export async function addTokens(userId: string, input: number, output: number) {
  const db = admin()
  if (!db || (!input && !output)) return
  try {
    const day = usageDay()
    const { data } = await db
      .from('ai_usage')
      .select('input_tokens, output_tokens')
      .eq('user_id', userId)
      .eq('day', day)
      .maybeSingle()
    await db.from('ai_usage').upsert(
      {
        user_id: userId,
        day,
        input_tokens: ((data?.input_tokens as number | undefined) ?? 0) + input,
        output_tokens: ((data?.output_tokens as number | undefined) ?? 0) + output,
      },
      { onConflict: 'user_id,day' },
    )
  } catch {
    // accounting must never break the feature
  }
}
