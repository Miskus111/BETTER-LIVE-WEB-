/**
 * Plans and feature access — the single place that decides what is free and what needs Pro.
 *
 * FREE_MODE=true (the default until payments launch) unlocks everything for everyone. The paywall,
 * badges and pricing page already exist, so switching FREE_MODE=false is all it takes to start
 * charging once a payment provider is connected.
 */
export type Plan = 'free' | 'pro'

export type Feature =
  | 'coach' // AI coach — free plan gets a small daily taste
  | 'labs_ai' // reading lab reports from PDF/photo with AI
  | 'progress' // training progress charts
  | 'photos' // progress photos and before/after compare
  | 'advanced_analytics'
  | 'unlimited_history'

export const isFreeMode = () => (process.env.FREE_MODE ?? 'true') !== 'false'

/** Features that need Pro once FREE_MODE is off. */
export const PRO_FEATURES: Feature[] = [
  'labs_ai',
  'progress',
  'photos',
  'advanced_analytics',
  'unlimited_history',
]

export function hasAccess(feature: Feature, plan: Plan | null | undefined, freeMode = isFreeMode()): boolean {
  if (freeMode) return true
  if (plan === 'pro') return true
  return !PRO_FEATURES.includes(feature)
}

/** True when the feature is part of Pro (used for badges even while FREE_MODE keeps it open). */
export const isProFeature = (f: Feature) => PRO_FEATURES.includes(f) || f === 'coach'

/** Coach messages per day: free users get a taste, Pro gets a high cap; FREE_MODE keeps a cost-bounded cap. */
export function coachDailyLimit(plan: Plan | null | undefined, freeMode = isFreeMode()): number {
  if (plan === 'pro') return 100
  return freeMode ? Number(process.env.COACH_DAILY_MESSAGE_LIMIT) || 40 : 5
}

/** Prices in CZK including VAT. Yearly = about 2 months free. */
export const PRICES = { pro_month_czk: 199, pro_year_czk: 1690 } as const
export const yearlySaving = () => Math.round((1 - PRICES.pro_year_czk / (PRICES.pro_month_czk * 12)) * 100)

/** A subscription row counts as Pro only while it is active and not past its period end. */
export function planFromSubscription(
  sub:
    { plan?: string | null; status?: string | null; current_period_end?: string | null } | null | undefined,
  now = new Date(),
): Plan {
  if (!sub || sub.plan !== 'pro') return 'free'
  if (sub.status && !['active', 'trialing', 'past_due'].includes(sub.status)) return 'free'
  if (sub.current_period_end && new Date(sub.current_period_end) < now) return 'free'
  return 'pro'
}
