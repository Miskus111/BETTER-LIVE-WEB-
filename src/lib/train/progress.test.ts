import { describe, expect, it } from 'vitest'
import { change, exerciseProgress, niceAxis, weekStart, weeklyVolume, type ProgressSet } from './progress'

const set = (p: Partial<ProgressSet>): ProgressSet => ({
  workoutId: 'w1',
  exercise: 'back-squat',
  date: '2026-11-16T10:00:00Z',
  reps: 5,
  weightKg: 100,
  type: 'normal',
  ...p,
})

describe('weekStart', () => {
  it('returns the Monday of the week', () => {
    expect(weekStart(new Date('2026-11-16T10:00:00Z'))).toBe('2026-11-16') // Monday
    expect(weekStart(new Date('2026-11-22T22:30:00Z'))).toBe('2026-11-16') // Sunday 23:30 in Prague
    expect(weekStart(new Date('2026-11-22T23:00:00Z'))).toBe('2026-11-23') // Monday 00:00 in Prague
  })
})

describe('weeklyVolume', () => {
  const now = new Date('2026-11-18T12:00:00Z')
  it('keeps empty weeks and ignores warm-ups in volume', () => {
    const w = weeklyVolume(
      [
        set({}),
        set({ type: 'warmup', weightKg: 60 }),
        set({ workoutId: 'w2', date: '2026-11-10T10:00:00Z', reps: 10, weightKg: 50 }),
      ],
      3,
      now,
    )
    expect(w.map((p) => p.week)).toEqual(['2026-11-02', '2026-11-09', '2026-11-16'])
    expect(w[2]).toMatchObject({ volume: 500, workouts: 1, sets: 1 })
    expect(w[1]).toMatchObject({ volume: 500, workouts: 1 })
    expect(w[0]).toMatchObject({ volume: 0, workouts: 0 })
  })
  it('drops sets outside the window', () => {
    expect(weeklyVolume([set({ date: '2025-01-01T00:00:00Z' })], 4, now).every((p) => p.volume === 0)).toBe(
      true,
    )
  })
})

describe('exerciseProgress', () => {
  it('keeps the best set per day and sorts by date', () => {
    const p = exerciseProgress([
      set({ date: '2026-11-16T10:00:00Z', weightKg: 100, reps: 5 }),
      set({ date: '2026-11-16T10:05:00Z', weightKg: 105, reps: 3 }),
      set({ date: '2026-11-09T10:00:00Z', weightKg: 95, reps: 5 }),
      set({ exercise: 'pull-up', weightKg: 0, reps: 10 }),
    ])
    const squat = p.get('back-squat')!
    expect(squat.map((x) => x.date)).toEqual(['2026-11-09', '2026-11-16'])
    expect(squat[1]).toMatchObject({ weightKg: 100, reps: 5, e1rm: 114.6 }) // beats 105×3 ≈ 113.3
    expect(p.has('pull-up')).toBe(false)
  })
})

describe('change', () => {
  it('percent from first to last', () => {
    expect(change([{ value: 100 }, { value: 110 }])).toBe(10)
    expect(change([{ value: 100 }])).toBeNull()
  })
})

describe('niceAxis', () => {
  it('uses round, evenly spaced ticks', () => {
    const a = niceAxis([69.4, 75.2, 83.1])
    expect(a.ticks).toEqual([65, 70, 75, 80, 85, 90])
    expect(niceAxis([]).ticks).toEqual([0, 5, 10])
  })
})

describe('niceAxis for body weight', () => {
  it('stays tight around small ranges', () => {
    expect(niceAxis([81.6, 85.2], 0.005)).toMatchObject({ lo: 81, hi: 86 })
  })
})
