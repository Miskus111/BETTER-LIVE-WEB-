import { describe, expect, it } from 'vitest'
import { coachDailyLimit, hasAccess, isProFeature, planFromSubscription, yearlySaving } from './billing'

describe('billing', () => {
  it('FREE_MODE unlocks everything', () => {
    for (const f of ['labs_ai', 'progress', 'photos', 'coach'] as const)
      expect(hasAccess(f, 'free', true)).toBe(true)
  })
  it('free plan without FREE_MODE gets the coach taste but not Pro features', () => {
    expect(hasAccess('coach', 'free', false)).toBe(true)
    for (const f of ['labs_ai', 'progress', 'photos'] as const) {
      expect(hasAccess(f, 'free', false)).toBe(false)
      expect(hasAccess(f, 'pro', false)).toBe(true)
    }
  })
  it('marks Pro features for badges', () => {
    expect(isProFeature('photos')).toBe(true)
    expect(isProFeature('coach')).toBe(true)
  })
  it('caps coach messages per plan', () => {
    expect(coachDailyLimit('free', false)).toBe(5)
    expect(coachDailyLimit('free', true)).toBe(40)
    expect(coachDailyLimit('pro', false)).toBe(100)
  })
  it('reads the plan from a subscription row', () => {
    const now = new Date('2026-11-16T00:00:00Z')
    expect(planFromSubscription(null, now)).toBe('free')
    expect(
      planFromSubscription({ plan: 'pro', status: 'active', current_period_end: '2026-12-16' }, now),
    ).toBe('pro')
    expect(
      planFromSubscription({ plan: 'pro', status: 'active', current_period_end: '2026-10-01' }, now),
    ).toBe('free')
    expect(planFromSubscription({ plan: 'pro', status: 'canceled' }, now)).toBe('free')
  })
  it('yearly price saves about two months', () => {
    expect(yearlySaving()).toBe(29)
  })
})

describe('pricing copy matches the real limits', () => {
  // the pricing table and paywall must never promise more than the code allows
  it('coach messages per day in cs and en', async () => {
    for (const lang of ['cs', 'en']) {
      const m = (await import(`../../messages/${lang}.json`)).default as Record<string, Record<string, string>>
      const all = JSON.stringify(m)
      expect(all).toContain(`"f_coach_free":"${coachDailyLimit('free', false)} `)
      expect(all).toContain(`"f_coach_pro":"${coachDailyLimit('pro', false)} `)
      expect(all).not.toMatch(/bez denního limitu|no daily limit|without a daily limit/)
    }
  })
})
