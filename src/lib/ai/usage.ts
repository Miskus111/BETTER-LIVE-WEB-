import 'server-only'
import { createServiceClient } from '@/lib/supabase/server'

type Db = {
  from: (t: string) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }>
}

/** Today's date in Czech time — the daily AI allowance resets at local midnight, not UTC. */
export const usageDay = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague' }).format(now)

/** Start of today's usage day as an ISO timestamp with Prague's current offset (+01:00 winter, +02:00 summer). */
export function usageDayStart(now = new Date()): string {
  const offset =
    new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Prague', timeZoneName: 'longOffset' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')
      ?.value.replace('GMT', '') || '+00:00'
  return `${usageDay(now)}T00:00:00${offset}`
}

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
  // atomic path (migration 20261119000000): one UPDATE … WHERE messages < limit, race-free
  const rpc = await db.rpc('reserve_ai_call', { p_user: userId, p_day: day, p_limit: limit })
  if (!rpc.error) return rpc.data === true
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
    const rpc = await db.rpc('add_ai_tokens', {
      p_user: userId,
      p_day: day,
      p_input: input,
      p_output: output,
    })
    if (!rpc.error) return
    // fallback until the migration is applied
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
