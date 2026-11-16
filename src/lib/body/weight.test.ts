import { describe, expect, it } from 'vitest'
import { normalize, trendChange, weeklyRate, withTrend } from './weight'

describe('normalize', () => {
  it('sorts, keeps the last entry per day and drops zeros', () => {
    expect(
      normalize([
        { date: '2026-11-03', weightKg: 80 },
        { date: '2026-11-01', weightKg: 81 },
        { date: '2026-11-03', weightKg: 79.5 },
        { date: '2026-11-02', weightKg: 0 },
      ]),
    ).toEqual([
      { date: '2026-11-01', weightKg: 81 },
      { date: '2026-11-03', weightKg: 79.5 },
    ])
  })
})

describe('withTrend', () => {
  it('averages weigh-ins from the last 7 calendar days', () => {
    const p = withTrend([
      { date: '2026-11-01', weightKg: 80 },
      { date: '2026-11-02', weightKg: 82 },
      { date: '2026-11-08', weightKg: 78 }, // 01 is outside the window, 02 is inside
    ])
    expect(p.map((x) => x.trend)).toEqual([80, 81, 80])
  })
})

describe('trendChange / weeklyRate', () => {
  const daily = Array.from({ length: 36 }, (_, i) => ({
    date: new Date(Date.UTC(2026, 9, 1) + i * 864e5).toISOString().slice(0, 10),
    weightKg: 85 - i * 0.1, // −0.7 kg/week
  }))
  const pts = withTrend(daily)
  it('measures the trend over a window', () => {
    expect(trendChange(pts, 28)).toBeCloseTo(-2.8, 1)
    expect(weeklyRate(pts, 28)).toBeCloseTo(-0.7, 1)
  })
  it('returns null without enough history', () => {
    expect(trendChange(pts.slice(0, 1), 7)).toBeNull()
    expect(trendChange(pts.slice(0, 5), 30)).toBeNull()
  })
})
