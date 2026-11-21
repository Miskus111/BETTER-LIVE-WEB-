import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
const { usageDay, usageDayStart } = await import('./usage')

describe('usage day (Europe/Prague)', () => {
  it('starts at local midnight with the right offset in winter and summer', () => {
    expect(usageDayStart(new Date('2026-01-15T12:00:00Z'))).toBe('2026-01-15T00:00:00+01:00')
    expect(usageDayStart(new Date('2026-07-15T12:00:00Z'))).toBe('2026-07-15T00:00:00+02:00')
  })
  it('switches day at Prague midnight, not UTC', () => {
    expect(usageDay(new Date('2026-07-15T22:30:00Z'))).toBe('2026-07-16')
  })
})
