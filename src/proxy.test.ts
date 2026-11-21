import { describe, expect, it } from 'vitest'
import { APP_PATHS } from '@/lib/supabase/middleware'
import { config } from './proxy'

describe('proxy matcher', () => {
  it('covers every signed-in route, so anonymous users are always redirected to login', () => {
    for (const p of APP_PATHS) expect(config.matcher, p).toContain(`${p}/:path*`)
  })
  it('never runs on public pages (they must stay static)', () => {
    for (const p of ['/', '/food/:path*', '/jak-funguje-telo/:path*', '/doplnky/:path*', '/organ/:path*'])
      expect(config.matcher).not.toContain(p)
  })
})
