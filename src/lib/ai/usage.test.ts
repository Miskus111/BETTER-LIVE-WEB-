import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/supabase/server', () => ({
  createServiceClient: () => {
    throw new Error('no key')
  },
}))

import { reserveAiCall, usageDay } from './usage'

describe('ai usage', () => {
  it('counts the day in Czech time, not UTC', () => {
    // 23:30 UTC on 18 Nov = 00:30 on 19 Nov in Prague (CET, UTC+1)
    expect(usageDay(new Date('2026-11-18T23:30:00Z'))).toBe('2026-11-19')
    // summer time (CEST, UTC+2)
    expect(usageDay(new Date('2026-07-01T22:30:00Z'))).toBe('2026-07-02')
    expect(usageDay(new Date('2026-07-01T21:30:00Z'))).toBe('2026-07-01')
  })
  it('falls back (null) instead of blocking when the service key is missing', async () => {
    await expect(reserveAiCall('u1', 5)).resolves.toBeNull()
  })
})
