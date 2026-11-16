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
  tagline: 'Lidské tělo × výživa',
  description:
    'Interaktivní mapa lidského těla: co jednotlivé orgány potřebují, které živiny a potraviny jim to dodají — s hodnocením důkazů a bio potravinami vybranými podle stejného měřítka.',
  url: siteUrl(),
}
