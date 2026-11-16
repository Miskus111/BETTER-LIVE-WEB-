/**
 * Plans and feature access. With FREE_MODE=true (the default until payments launch)
 * every feature is unlocked and the paywall is hidden.
 */
export type Plan = 'free' | 'pro'
export type Feature = 'coach' | 'labs_ai' | 'advanced_analytics' | 'unlimited_history'

export const isFreeMode = () => (process.env.FREE_MODE ?? 'true') !== 'false'

const PRO_ONLY: Feature[] = ['labs_ai', 'advanced_analytics', 'unlimited_history']

export function hasAccess(feature: Feature, plan: Plan | null | undefined, freeMode = isFreeMode()): boolean {
  if (freeMode) return true
  if (plan === 'pro') return true
  return !PRO_ONLY.includes(feature)
}

/** Coach messages per day. Free users get a taste; FREE_MODE keeps a generous cap to bound cost. */
export function coachDailyLimit(plan: Plan | null | undefined, freeMode = isFreeMode()): number {
  if (plan === 'pro') return 100
  return freeMode ? 40 : 10
}

export const PRICES = { pro_month_czk: 199, pro_year_czk: 1690 } as const
