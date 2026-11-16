import { describe, expect, it } from 'vitest'
import { hrZones, pace, sportSessionSchema } from './sport'

describe('sport sessions', () => {
  it('computes pace', () => {
    expect(pace(50, 10)).toBe('5:00')
    expect(pace(27, 5)).toBe('5:24')
    expect(pace(30, null)).toBeNull()
  })
  it('estimates HR zones with Tanaka', () => {
    const r = hrZones(30)
    expect(r.max).toBe(187)
    expect(r.zones[1]).toEqual([112, 131])
  })
  it('validates sessions', () => {
    expect(
      sportSessionSchema.safeParse({
        sport: 'running',
        durationMin: '45',
        distanceKm: '8.5',
        avgHr: '',
        rpe: '6',
        notes: '',
      }).success,
    ).toBe(true)
    expect(
      sportSessionSchema.safeParse({
        sport: 'running',
        durationMin: '0',
        distanceKm: '',
        avgHr: '',
        rpe: '6',
        notes: '',
      }).success,
    ).toBe(false)
  })
})
