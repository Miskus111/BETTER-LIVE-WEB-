import type { MetadataRoute } from 'next'
import { FOODS } from '@/data/foods'
import { ORGANS } from '@/data/organs'
import { SITE } from '@/lib/site'
import { SUPPLEMENT_NUTRIENTS, supplementHref } from '@/data/supplements'
import { COMPOUNDS } from '@/data/compounds'
import { BODY_GUIDES } from '@/data/body-guides'

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`
  const lastModified = new Date('2026-11-18')
  return [
    { url: u('/'), priority: 1 },
    { url: u('/doplnky'), priority: 0.8 },
    { url: u('/jak-funguje-telo'), priority: 0.9 },
    { url: u('/jak-funguje-telo/kviz'), priority: 0.7 },
    { url: u('/jak-funguje-telo/slovnik'), priority: 0.7 },
    ...BODY_GUIDES.map((g) => ({ url: u(`/jak-funguje-telo/${g.slug}`), priority: 0.8 })),
    { url: u('/jak-doporucujeme'), priority: 0.4 },
    { url: u('/looksmaxing'), priority: 0.7 },
    { url: u('/science'), priority: 0.6 },
    { url: u('/pricing'), priority: 0.6 },
    { url: u('/privacy'), priority: 0.2 },
    { url: u('/terms'), priority: 0.2 },
    ...SUPPLEMENT_NUTRIENTS.map((id) => ({ url: u(supplementHref(id)), priority: 0.8 })),
    ...COMPOUNDS.map((c) => ({ url: u(`/doplnky/${c.slug}`), priority: 0.8 })),
    ...ORGANS.map((o) => ({ url: u(`/organ/${o.id}`), priority: 0.8 })),
    ...FOODS.map((f) => ({ url: u(`/food/${f.id}`), priority: 0.6 })),
  ].map((e) => ({ lastModified, ...e }))
}
