import { describe, expect, it } from 'vitest'
import { safeNext } from './safe-next'

describe('safeNext', () => {
  it('keeps in-app paths', () => {
    expect(safeNext('/coach?c=1')).toBe('/coach?c=1')
  })
  it('rejects other hosts and tricks', () => {
    for (const bad of ['https://evil.com', '//evil.com', '/\\evil.com', 'coach', '', null, undefined])
      expect(safeNext(bad)).toBe('/today')
  })
})
