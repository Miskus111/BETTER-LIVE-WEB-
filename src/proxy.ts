import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  // Only where a session matters (app, login, API). Public pages never run this: no Supabase round trip,
  // and they stay static on the CDN. Keep in sync with APP_PATHS in src/lib/supabase/middleware.ts.
  matcher: [
    '/today/:path*',
    '/train/:path*',
    '/eat/:path*',
    '/body/:path*',
    '/coach/:path*',
    '/labs/:path*',
    '/mobility/:path*',
    '/looks/:path*',
    '/supplements/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/login',
    '/reset-password',
    '/auth/:path*',
    '/api/:path*',
  ],
}
