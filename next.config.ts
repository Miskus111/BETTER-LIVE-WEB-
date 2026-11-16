import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // the coach reads its system prompt from the repo root at runtime
  outputFileTracingIncludes: { '/api/coach': ['./system-prompt.md'] },
  // separate build folder for Playwright so tests don't clobber a running `npm run dev`
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // the store was removed (v0.3) — keep old links working
  async redirects() {
    return [
      { source: '/shop', destination: '/doplnky', permanent: true },
      { source: '/product/:id', destination: '/doplnky', permanent: true },
      { source: '/cart', destination: '/', permanent: true },
      { source: '/checkout', destination: '/', permanent: true },
      { source: '/our-standard', destination: '/jak-doporucujeme', permanent: true },
      { source: '/signup', destination: '/login?mode=signup', permanent: false },
      { source: '/register', destination: '/login?mode=signup', permanent: false },
    ]
  },
  /* config options here */
}

export default withNextIntl(nextConfig)
