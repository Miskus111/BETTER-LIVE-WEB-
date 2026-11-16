import 'server-only'
import { hasAccess, isFreeMode, planFromSubscription, type Feature, type Plan } from './billing'

type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

/** The signed-in user's effective plan (RLS limits the query to their own row). */
export async function getPlan(supabase: unknown, userId: string): Promise<Plan> {
  const { data } = await (supabase as Db)
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', userId)
    .maybeSingle()
  return planFromSubscription(data)
}

/** Server-side gate for a page or route. */
export async function gate(supabase: unknown, userId: string, feature: Feature) {
  const freeMode = isFreeMode()
  const plan = freeMode ? 'free' : await getPlan(supabase, userId)
  return { allowed: hasAccess(feature, plan, freeMode), plan, freeMode }
}
