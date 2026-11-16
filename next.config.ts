import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
    ]
  },
  /* config options here */
}

export default nextConfig
