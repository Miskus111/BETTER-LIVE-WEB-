/**
 * Site URL resolution: explicit NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain
 * (VERCEL_PROJECT_PRODUCTION_URL) or the deployment URL (VERCEL_URL) is used automatically.
 */
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  const vercel =
    process.env.VERCEL_ENV === 'production'
      ? (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)
      : process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}

export const SITE = {
  name: 'FLX',
  tagline: 'Human body × nutrition',
  description:
    'Explore an interactive map of the human body, the nutrients each organ depends on — graded by evidence — and certified organic food chosen to the same standard.',
  url: siteUrl(),
}
