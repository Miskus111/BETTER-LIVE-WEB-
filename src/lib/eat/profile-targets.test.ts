import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
const { profileTargets } = await import('./profile-targets')

const adult = { sex: 'female' as const, weight_kg: 65, height_cm: 168, birth_date: '1995-05-01' }
const prefs = { training_days: 3, work_pattern: 'desk' as const }

describe('profileTargets', () => {
  it('asks for the missing profile data instead of guessing', () => {
    expect(profileTargets(null, prefs, []).status).toBe('incomplete')
    expect(profileTargets({ ...adult, height_cm: null }, prefs, []).status).toBe('incomplete')
  })
  it('shows support, not numbers, when weight loss is asked for at a low BMI', () => {
    const r = profileTargets({ ...adult, weight_kg: 48 }, prefs, ['fat_loss'])
    expect(r.status).toBe('support')
    expect('targets' in r).toBe(false)
  })
  it('picks fat loss over muscle over health as the primary goal', () => {
    expect(profileTargets(adult, prefs, ['health', 'muscle', 'fat_loss'])).toMatchObject({ goal: 'fat_loss' })
    expect(profileTargets(adult, prefs, ['muscle', 'longevity'])).toMatchObject({ goal: 'muscle' })
    expect(profileTargets(adult, prefs, ['longevity'])).toMatchObject({ goal: 'health' })
  })
  it('gives sane daily targets', () => {
    const r = profileTargets(adult, prefs, ['health'])
    if (r.status !== 'ok') throw new Error(r.status)
    expect(r.targets.kcal).toBeGreaterThan(1400)
    expect(r.targets.kcal).toBeLessThan(3000)
  })
})
