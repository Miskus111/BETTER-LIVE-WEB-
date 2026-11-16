import type { MetadataRoute } from 'next'
import { FOODS } from '@/data/foods'
import { ORGANS } from '@/data/organs'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`
  return [
    { url: u('/'), priority: 1 },
    { url: u('/doplnky'), priority: 0.8 },
    { url: u('/jak-doporucujeme'), priority: 0.4 },
    { url: u('/looksmaxing'), priority: 0.7 },
    { url: u('/science'), priority: 0.6 },
    ...ORGANS.map((o) => ({ url: u(`/organ/${o.id}`), priority: 0.8 })),
    ...FOODS.map((f) => ({ url: u(`/food/${f.id}`), priority: 0.6 })),
  ]
}
