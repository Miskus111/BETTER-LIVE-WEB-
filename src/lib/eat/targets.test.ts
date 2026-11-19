import { describe, expect, it } from 'vitest'
import {
  activityLevel,
  ageFrom,
  bmi,
  bmrMifflin,
  eatingRiskSignals,
  safeKcal,
  targetsFor,
  tdee,
} from './targets'

describe('Mifflin-St Jeor', () => {
  it('matches the published equations', () => {
    expect(bmrMifflin('male', 80, 180, 30)).toBe(1780)
    expect(bmrMifflin('female', 60, 165, 30)).toBe(1320)
  })
  it('scales by activity', () => {
    expect(tdee(1780, 'moderate')).toBe(2759)
  })
  it('derives activity from training days and work', () => {
    expect(activityLevel(0, 'desk')).toBe('sedentary')
    expect(activityLevel(4, 'desk')).toBe('moderate')
    expect(activityLevel(4, 'physical')).toBe('very')
  })
})

describe('calorie floor (eating-disorder safeguard)', () => {
  it('never goes below BMR', () => {
    const r = safeKcal(1000, 1400, 1700, 55)
    expect(r.kcal).toBe(1400)
    expect(r.rule).toBe('bmr_floor')
  })
  it('caps the weekly loss rate at ~0.75 % body weight', () => {
    const r = safeKcal(1500, 1700, 3200, 90)
    expect(r.kcal).toBeGreaterThan(2400) // 90 kg × 0.75 % × 7700 / 7 ≈ 743 kcal/day max deficit
    expect(r.rule).toBe('max_rate')
  })
  it('fat-loss targets for a small person stay at or above BMR', () => {
    const t = targetsFor({
      sex: 'female',
      weightKg: 50,
      heightCm: 158,
      age: 45,
      level: 'sedentary',
      goal: 'fat_loss',
    })
    expect(t.kcal).toBeGreaterThanOrEqual(t.bmr)
  })
})

describe('macro targets', () => {
  const t = targetsFor({
    sex: 'male',
    weightKg: 80,
    heightCm: 180,
    age: 30,
    level: 'moderate',
    goal: 'muscle',
  })
  it('adds a small surplus for muscle gain', () => {
    expect(t.kcal).toBe(Math.round(2759 * 1.1))
  })
  it('sets protein, fat minimum and fibre', () => {
    expect(t.proteinG).toBe(144)
    expect(t.fatG).toBeGreaterThanOrEqual(48)
    expect(t.fiberG).toBeGreaterThanOrEqual(25)
  })
  it('macros add up to the calorie target (±1 %)', () => {
    const kcal = t.proteinG * 4 + t.fatG * 9 + t.carbsG * 4
    expect(Math.abs(kcal - t.kcal) / t.kcal).toBeLessThan(0.01)
  })
})

describe('helpers', () => {
  it('computes age and BMI', () => {
    expect(ageFrom('1996-05-20', new Date('2026-05-19'))).toBe(29)
    expect(bmi(70, 175)).toBe(22.9)
  })
})

describe('eating-risk screen', () => {
  it('flags weight loss when already underweight', () => {
    expect(eatingRiskSignals({ weightKg: 48, heightCm: 170, goals: ['fat_loss'] })).toContain(
      'low_bmi_weight_loss',
    )
  })
  it('flags reported compensatory behaviour', () => {
    expect(
      eatingRiskSignals({ weightKg: 70, heightCm: 170, goals: ['health'], answers: { compensatory: true } }),
    ).toEqual(['compensatory_behaviour'])
  })
  it('is empty for a healthy profile', () => {
    expect(eatingRiskSignals({ weightKg: 75, heightCm: 178, goals: ['muscle'] })).toEqual([])
  })
})

describe('obesity-adjusted targets', () => {
  it('uses an adjusted weight for protein when BMI > 30', () => {
    const t = targetsFor({
      sex: 'male',
      weightKg: 130,
      heightCm: 170,
      age: 35,
      level: 'light',
      goal: 'fat_loss',
    })
    // reference ≈ 72,3 + 0,25 × 57,8 ≈ 86,7 kg → ~173 g, not 260 g
    expect(t.proteinG).toBeLessThan(190)
    expect(t.carbsG).toBeGreaterThan(100)
  })
})
