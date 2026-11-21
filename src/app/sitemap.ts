import type { MetadataRoute } from 'next'
import { FOODS } from '@/data/foods'
import { ORGANS } from '@/data/organs'
import { SITE } from '@/lib/site'
import { SUPPLEMENT_NUTRIENTS, supplementHref } from '@/data/supplements'
import { COMPOUNDS } from '@/data/compounds'
import { BODY_GUIDES } from '@/data/body-guides'

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`
  // when each group of pages last changed in substance — bump it with real content changes, so search
  // engines re-crawl what changed (one date for everything teaches them to ignore lastmod)
  const lastModified = new Date('2026-11-18')
  const foodsUpdated = new Date('2026-11-21') // unenriched grains, raw vs cooked, downsides in V kostce, renames
  const guidesUpdated = new Date('2026-11-21') // food picks, related guides, article dates
  const organsUpdated = new Date('2026-11-21') // rankings: one entry per food, no junk, per-portion amounts
  return [
    { url: u('/'), priority: 1, lastModified: foodsUpdated },
    { url: u('/doplnky'), priority: 0.8 },
    { url: u('/jak-funguje-telo'), priority: 0.9 },
    { url: u('/jak-funguje-telo/kviz'), priority: 0.7 },
    { url: u('/jak-funguje-telo/slovnik'), priority: 0.7 },
    { url: u('/nastroje'), priority: 0.8 },
    ...BODY_GUIDES.map((g) => ({
      url: u(`/jak-funguje-telo/${g.slug}`),
      priority: 0.8,
      lastModified: guidesUpdated,
    })),
    { url: u('/jak-doporucujeme'), priority: 0.4 },
    { url: u('/looksmaxing'), priority: 0.7 },
    { url: u('/science'), priority: 0.6 },
    { url: u('/pricing'), priority: 0.6 },
    { url: u('/privacy'), priority: 0.2 },
    { url: u('/terms'), priority: 0.2 },
    ...SUPPLEMENT_NUTRIENTS.map((id) => ({ url: u(supplementHref(id)), priority: 0.8 })),
    ...COMPOUNDS.map((c) => ({ url: u(`/doplnky/${c.slug}`), priority: 0.8 })),
    ...ORGANS.map((o) => ({ url: u(`/organ/${o.id}`), priority: 0.8, lastModified: organsUpdated })),
    ...FOODS.map((f) => ({ url: u(`/food/${f.id}`), priority: 0.6, lastModified: foodsUpdated })),
  ].map((e) => ({ lastModified, ...e }))
}
