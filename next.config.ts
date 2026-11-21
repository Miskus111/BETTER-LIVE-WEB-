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
      // renamed food ids (see FOOD_ID_ALIASES in src/data/foods.ts)
      { source: '/food/seaweed-nori', destination: '/food/spirulina', permanent: true },
      { source: '/food/yeast-nutritional', destination: '/food/yeast-dry', permanent: true },
      { source: '/food/olomouc-cheese', destination: '/food/limburger', permanent: true },
    ]
  },
  // metadata (title, description, og:image) always in <head> — every link-preview bot finds it
  htmlLimitedBots: /.*/,
  poweredByHeader: false,
  // Security headers that can't break the app. No script CSP on purpose: Next inline scripts,
  // Supabase, Vercel and Open Food Facts would need a nonce setup first.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // no framing by other sites (clickjacking on login and health forms)
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // the site never uses these; file pickers for photos are not affected
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
