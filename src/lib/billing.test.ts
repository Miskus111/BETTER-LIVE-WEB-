import { describe, expect, it } from 'vitest'
import { coachDailyLimit, hasAccess } from './billing'

describe('billing', () => {
  it('FREE_MODE unlocks everything', () => {
    expect(hasAccess('labs_ai', 'free', true)).toBe(true)
  })
  it('free plan without FREE_MODE gets the coach but not pro features', () => {
    expect(hasAccess('coach', 'free', false)).toBe(true)
    expect(hasAccess('labs_ai', 'free', false)).toBe(false)
    expect(hasAccess('labs_ai', 'pro', false)).toBe(true)
  })
  it('caps coach messages per plan', () => {
    expect(coachDailyLimit('free', false)).toBe(10)
    expect(coachDailyLimit('free', true)).toBe(40)
    expect(coachDailyLimit('pro', false)).toBe(100)
  })
})
