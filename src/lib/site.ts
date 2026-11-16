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
  name: 'Better Live with Biohacking',
  short: 'BLWB',
  tagline: 'Žij zdravěji, podávej lepší výkon',
  description:
    'Výživa, vitamíny, trénink pro jakýkoli sport, mobilita a bolest, regenerace, spánek a vzhled — s AI koučem, který z vašich dat vytvoří osobní plány. Vše s hodnocením důkazů.',
  url: siteUrl(),
}
