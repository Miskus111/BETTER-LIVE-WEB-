import { describe, expect, it } from 'vitest'
import { trimQueue, type QueuedWorkout } from './session-store'

const w = (i: number, synced: boolean): QueuedWorkout => ({
  id: `w${i}`,
  name: '',
  startedAt: '',
  finishedAt: '',
  notes: '',
  exercises: [],
  synced,
})

describe('trimQueue', () => {
  it('drops the oldest synced workouts first', () => {
    const q = [w(1, true), w(2, false), w(3, true), w(4, true)]
    expect(trimQueue(q, 3).map((x) => x.id)).toEqual(['w2', 'w3', 'w4'])
  })
  it('never drops a workout that has not been synced yet', () => {
    const q = Array.from({ length: 60 }, (_, i) => w(i, false))
    expect(trimQueue(q, 50)).toHaveLength(60)
  })
  it('leaves a short queue alone', () => {
    const q = [w(1, true), w(2, false)]
    expect(trimQueue(q, 50)).toBe(q)
  })
})
