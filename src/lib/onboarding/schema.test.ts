import { describe, expect, it } from 'vitest'
import { ageOn, csvList, isAdult, normalisePain, onboardingSchema } from './schema'

const today = new Date('2026-11-16T12:00:00')

describe('ageOn / isAdult', () => {
  it('counts full years and respects birthdays later in the year', () => {
    expect(ageOn('2008-11-16', today)).toBe(18)
    expect(ageOn('2008-11-17', today)).toBe(17)
    expect(ageOn('1990-01-01', today)).toBe(36)
  })
  it('rejects minors', () => {
    expect(isAdult('2008-11-16', today)).toBe(true)
    expect(isAdult('2008-11-17', today)).toBe(false)
  })
})

describe('csvList', () => {
  it('trims, removes blanks and duplicates', () => {
    expect(csvList.parse(' olivy, , koriandr,olivy ')).toEqual(['olivy', 'koriandr'])
  })
})

describe('normalisePain', () => {
  it('treats "none" as no pain areas', () => {
    expect(normalisePain(['none', 'knee'])).toEqual([])
    expect(normalisePain(['knee'])).toEqual(['knee'])
  })
})

const valid = {
  displayName: 'Jana',
  birthDate: '1995-05-20',
  sex: 'female',
  heightCm: '168',
  weightKg: '62',
  adultConfirmed: true,
  goals: ['health', 'muscle'],
  sports: ['gym', 'running'],
  experience: 'intermediate',
  trainingDays: '4',
  sessionMinutes: '60',
  equipment: ['full_gym'],
  dietType: 'omnivore',
  allergies: ['lactose'],
  allergiesOther: 'kiwi',
  dislikes: 'olivy',
  budget: 'medium',
  painAreas: ['lower_back'],
  medications: '',
  sleepHours: '7',
  workPattern: 'desk',
  healthData: true,
  terms: true,
} as const

describe('onboardingSchema', () => {
  it('accepts a complete adult profile and coerces numbers', () => {
    const r = onboardingSchema.parse(valid)
    expect(r.heightCm).toBe(168)
    expect(r.allergiesOther).toEqual(['kiwi'])
  })
  it('rejects a minor even if the checkbox is ticked', () => {
    const r = onboardingSchema.safeParse({ ...valid, birthDate: `${new Date().getFullYear() - 17}-01-01` })
    expect(r.success).toBe(false)
  })
  it('requires explicit, separate health-data consent', () => {
    expect(onboardingSchema.safeParse({ ...valid, healthData: false }).success).toBe(false)
    expect(onboardingSchema.safeParse({ ...valid, terms: false }).success).toBe(false)
  })
  it('requires at least one goal', () => {
    expect(onboardingSchema.safeParse({ ...valid, goals: [] }).success).toBe(false)
  })
})
