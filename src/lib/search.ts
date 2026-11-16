import { FOODS } from '@/data/foods'
import { NUTRIENT_LIST } from '@/data/nutrients'
import { ORGANS } from '@/data/organs'
import { PRODUCTS } from '@/data/products'

export type SearchKind = 'Organ' | 'Nutrient' | 'Food' | 'Product'

export interface SearchItem {
  kind: SearchKind
  id: string
  title: string
  subtitle: string
  href: string
  text: string
}

export const SEARCH_INDEX: SearchItem[] = [
  ...ORGANS.map((o) => ({
    kind: 'Organ' as const,
    id: o.id,
    title: o.shortName,
    subtitle: o.tagline,
    href: `/organ/${o.id}`,
    text: `${o.name} ${o.system} ${o.what}`,
  })),
  ...NUTRIENT_LIST.map((n) => ({
    kind: 'Nutrient' as const,
    id: n.id,
    title: n.name,
    subtitle: n.kind,
    href: `/#nutrient-${n.id}`,
    text: `${n.name} ${n.kind} ${n.blurb}`,
  })),
  ...FOODS.map((f) => ({
    kind: 'Food' as const,
    id: f.id,
    title: f.name,
    subtitle: `${f.category} · ${f.kcal} kcal / 100 g`,
    href: `/food/${f.id}`,
    text: `${f.name} ${f.category} ${f.basis}`,
  })),
  ...PRODUCTS.map((p) => ({
    kind: 'Product' as const,
    id: p.id,
    title: p.name,
    subtitle: `${p.origin} · ${p.size}`,
    href: `/product/${p.id}`,
    text: `${p.name} ${p.categories.join(' ')} ${p.shortDescription} ${p.origin}`,
  })),
]

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Simple ranked search: title prefix > title contains > body contains; every token must match. */
export function search(query: string, limit = 24): SearchItem[] {
  const tokens = norm(query).split(/\s+/).filter(Boolean)
  if (!tokens.length) return []
  return SEARCH_INDEX.map((item) => {
    const title = norm(item.title)
    const all = `${title} ${norm(item.text)}`
    if (!tokens.every((t) => all.includes(t))) return null
    const score = tokens.reduce(
      (s, t) => s + (title.startsWith(t) ? 6 : title.includes(t) ? 3 : 1) + (item.kind === 'Organ' ? 0.5 : 0),
      0,
    )
    return { item, score }
  })
    .filter((x): x is { item: SearchItem; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item)
}
