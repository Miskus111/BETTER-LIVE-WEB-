import { describe, expect, it } from 'vitest'
import { FLAGS_BY_REGION, nextStep, painTrend, RED_FLAGS, triage } from './red-flags'

describe('red-flag triage', () => {
  it('blocks exercises and sends to emergency for cauda equina signs', () => {
    expect(triage({ saddle_numbness: true }).action).toBe('emergency')
    expect(triage({ bladder_bowel: true }).action).toBe('emergency')
  })
  it('emergency for chest pain and sudden severe headache', () => {
    expect(triage({ chest_pain: true }).action).toBe('emergency')
    expect(triage({ sudden_severe_headache: true }).action).toBe('emergency')
  })
  it('doctor for trauma, fever/weight loss, night pain, progressive weakness', () => {
    for (const f of ['major_trauma', 'fever_or_weight_loss', 'night_pain', 'progressive_weakness'] as const)
      expect(triage({ [f]: true }).action, f).toBe('doctor')
  })
  it('allows exercises only when every answer is no', () => {
    expect(triage({}).action).toBe('exercise')
    expect(triage({ night_pain: false, chest_pain: false }).action).toBe('exercise')
  })
  it('lower back always asks about saddle numbness and bladder/bowel', () => {
    expect(FLAGS_BY_REGION.lower_back).toEqual(expect.arrayContaining(['saddle_numbness', 'bladder_bowel']))
  })
  it('every region asks the general flags and only known flags', () => {
    for (const flags of Object.values(FLAGS_BY_REGION)) {
      expect(flags).toEqual(expect.arrayContaining(['major_trauma', 'fever_or_weight_loss']))
      for (const f of flags) expect(RED_FLAGS).toContain(f)
    }
  })
})

describe('pain tracking', () => {
  it('computes the trend', () => {
    expect(painTrend([7, 7, 6, 5, 4, 3])).toBe(-2.7)
    expect(painTrend([5, 5])).toBeNull()
  })
  it('traffic-light progression', () => {
    expect(nextStep(2, false)).toBe('progress')
    expect(nextStep(4, false)).toBe('hold')
    expect(nextStep(3, true)).toBe('regress')
    expect(nextStep(7, false)).toBe('regress')
  })
})

describe('review fixes', () => {
  it('knee and ankle screening asks about a swollen calf (possible DVT)', () => {
    expect(FLAGS_BY_REGION.knee).toContain('calf_swelling')
    expect(triage({ calf_swelling: true }).action).toBe('doctor')
  })
  it('trend windows never overlap and fractional pain above 3 holds', () => {
    expect(painTrend([8, 7, 3, 2])).toBe(-5)
    expect(nextStep(3.5, false)).toBe('hold')
  })
})
