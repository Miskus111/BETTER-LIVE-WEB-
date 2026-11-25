import { describe, expect, it } from 'vitest'
import { appUrl, isAppPath } from './app-url'

describe('app links', () => {
  it('recognises app pages', () => {
    for (const p of ['/login?mode=signup', '/today', '/eat/explore', '/settings', '/reset-password'])
      expect(isAppPath(p), p).toBe(true)
  })
  it('leaves website pages alone', () => {
    for (const p of ['/', '/food/almonds', '/jak-funguje-telo/bilkoviny', '/looksmaxing', '/trainers'])
      expect(isAppPath(p), p).toBe(false)
  })
  it('builds absolute app URLs', () => {
    expect(appUrl('/login?mode=signup')).toMatch(/^https?:\/\/[^/]+\/login\?mode=signup$/)
  })
})
