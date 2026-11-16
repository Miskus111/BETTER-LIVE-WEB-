import type { RetailerId } from './retailers'

/**
 * Affiliate (partnerské) parametry. Po registraci v partnerském programu obchodu vložte svůj
 * identifikátor do proměnných prostředí (Vercel → Settings → Environment Variables):
 *
 *   NEXT_PUBLIC_AFF_BRAINMARKET = "a_aid=XXXX"      (celý query string, který vám program přidělí)
 *   NEXT_PUBLIC_AFF_VILGAIN     = "utm_source=flx&ref=XXXX"
 *
 * Bez nastavení se odkazy zobrazí bez parametru (fungují, jen bez provize).
 */
const PARAMS: Record<RetailerId, string | undefined> = {
  brainmarket: process.env.NEXT_PUBLIC_AFF_BRAINMARKET,
  vilgain: process.env.NEXT_PUBLIC_AFF_VILGAIN,
}

/** Přidá affiliate parametry k URL obchodu (zachová existující query string). */
export function affiliateUrl(url: string, retailer: RetailerId): string {
  const params = PARAMS[retailer]?.trim().replace(/^\?/, '')
  if (!params) return url
  const u = new URL(url)
  for (const [k, v] of new URLSearchParams(params)) u.searchParams.set(k, v)
  return u.toString()
}

export const isAffiliateActive = (retailer: RetailerId) => !!PARAMS[retailer]?.trim()

/** Text povinného upozornění (zákon o ochraně spotřebitele — skrytá reklama). */
export const AFFILIATE_DISCLOSURE =
  'Odkazy na obchody jsou partnerské (affiliate): když přes ně nakoupíte, můžeme získat provizi. Cenu pro vás to nemění. Produkty vybíráme podle formy, dávky a důkazů — ne podle výše provize.'
