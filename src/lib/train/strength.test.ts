import { describe, expect, it } from 'vitest'
import {
  brzycki,
  epley,
  estimate1RM,
  newRecords,
  personalRecords,
  platesPerSide,
  setsPerMuscle,
  toKg,
  toLb,
  volume,
  type LoggedSet,
} from './strength'

describe('1RM estimates', () => {
  it('Epley matches the published formula', () => {
    expect(epley(100, 5)).toBeCloseTo(116.667, 2)
    expect(epley(100, 10)).toBeCloseTo(133.333, 2)
  })
  it('Brzycki matches the published formula', () => {
    expect(brzycki(100, 5)).toBeCloseTo(112.5, 2)
    expect(brzycki(100, 10)).toBeCloseTo(133.333, 2)
  })
  it('a single rep is the 1RM', () => {
    expect(epley(140, 1)).toBe(140)
    expect(brzycki(140, 1)).toBe(140)
    expect(estimate1RM(140, 1)).toEqual({ value: 140, precise: true })
  })
  it('averages both formulas up to 10 reps, Epley only above', () => {
    expect(estimate1RM(100, 5)).toEqual({ value: 114.6, precise: true })
    expect(estimate1RM(60, 15)).toEqual({ value: 90, precise: false })
  })
  it('handles invalid input', () => {
    expect(estimate1RM(0, 5).value).toBe(0)
    expect(estimate1RM(100, 0).value).toBe(0)
    expect(brzycki(50, 40)).toBeCloseTo(epley(50, 40))
  })
})

describe('units', () => {
  it('converts kg and lb', () => {
    expect(toLb(100)).toBe(220.5)
    expect(toKg(225)).toBe(102.06)
  })
})

describe('plate calculator', () => {
  it('loads standard plates per side', () => {
    expect(platesPerSide(100).plates).toEqual([25, 15])
    expect(platesPerSide(142.5).plates).toEqual([25, 25, 10, 1.25])
  })
  it('reports when the target cannot be hit exactly', () => {
    const r = platesPerSide(101)
    expect(r.achieved).toBe(100)
    expect(r.remainder).toBe(1)
  })
  it('empty bar', () => {
    expect(platesPerSide(20)).toEqual({ plates: [], achieved: 20, remainder: 0 })
  })
})

const sets: LoggedSet[] = [
  { exercise: 'bench', weightKg: 40, reps: 10, type: 'warmup', completed: true },
  { exercise: 'bench', weightKg: 80, reps: 8, type: 'normal', completed: true },
  { exercise: 'bench', weightKg: 85, reps: 5, type: 'normal', completed: true },
  { exercise: 'bench', weightKg: 85, reps: 0, type: 'normal', completed: false },
  { exercise: 'row', weightKg: 70, reps: 10, type: 'normal', completed: true },
]

describe('volume and muscles', () => {
  it('counts only completed working sets', () => {
    expect(volume(sets)).toBe(80 * 8 + 85 * 5 + 70 * 10)
  })
  it('weights secondary muscles at half a set', () => {
    const m = setsPerMuscle(sets, (e) =>
      e === 'bench'
        ? { primary: ['chest'], secondary: ['triceps'] }
        : { primary: ['lats'], secondary: ['biceps'] },
    )
    expect(m).toEqual({ chest: 2, triceps: 1, lats: 1, biceps: 0.5 })
  })
})

describe('personal records', () => {
  it('finds bests and detects new records', () => {
    const prs = personalRecords(sets.filter((s) => s.exercise === 'bench'))
    expect(prs.maxWeight).toBe(85)
    expect(prs.maxReps).toBe(8)
    expect(
      newRecords(prs, { exercise: 'bench', weightKg: 90, reps: 3, type: 'normal', completed: true }),
    ).toContain('maxWeight')
    expect(
      newRecords(prs, { exercise: 'bench', weightKg: 100, reps: 5, type: 'warmup', completed: true }),
    ).toEqual([])
  })
})
