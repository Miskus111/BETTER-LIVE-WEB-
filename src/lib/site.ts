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
    'Jak funguje tělo, srozumitelně a podle důkazů: interaktivní mapa těla, průvodci o spánku, stresu, výživě a pohybu, doplňky stravy bez marketingu a aplikace na trénink a jídlo.',
  url: siteUrl(),
}

/**
 * Provozovatel webu a správce osobních údajů (GDPR čl. 13). Zobrazuje se v zásadách, podmínkách a patičce.
 * `id` = IČO, pokud existuje; `address` = sídlo nebo doručovací adresa.
 */
export const OPERATOR = {
  name: 'Michal Major',
  id: '',
  address: '',
  email: 'miskusmajor@gmail.com',
}
