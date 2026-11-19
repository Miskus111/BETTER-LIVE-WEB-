import { TOOLS } from '@/data/tools'
import { GLOSSARY } from '@/data/glossary'
import { norm } from '@/lib/guide-search'
import { FOODS } from '@/data/foods'
import { NUTRIENT_LIST } from '@/data/nutrients'
import { ORGANS } from '@/data/organs'
import { BODY_GUIDES } from '@/data/body-guides'
import { COMPOUNDS, GOALS } from '@/data/compounds'
import { SUPPLEMENT_SLUGS } from '@/data/supplements'

export type SearchKind =
  'Orgán' | 'Živina' | 'Potravina' | 'Stránka' | 'Průvodce' | 'Doplněk' | 'Kalkulačka' | 'Pojem'

export interface SearchItem {
  kind: SearchKind
  id: string
  title: string
  subtitle: string
  href: string
  text: string
}

export const SEARCH_INDEX: SearchItem[] = [
  {
    kind: 'Stránka',
    id: 'looksmaxing',
    title: 'Looksmaxing bez mýtů',
    subtitle: 'Spánek, slunce, trénink, pleť, vlasy · mýty',
    href: '/looksmaxing',
    text: 'looksmaxing vzhled pleť vlasy čelist mewing bone smashing kreatin kolagen spánek SPF',
  },
  {
    kind: 'Stránka',
    id: 'doplnky',
    title: 'Doplňky stravy — formy a dávky',
    subtitle: 'Vstřebatelnost, referenční hodnoty, kde koupit',
    href: '/doplnky',
    text: 'doplňky stravy vstřebatelnost forma dávka bisglycinát D3 omega-3 hořčík zinek železo B12 horní limit',
  },
  {
    kind: 'Stránka',
    id: 'science',
    title: 'Věda a metodika',
    subtitle: 'Úrovně důkazů, prahy, zdroje',
    href: '/science',
    text: 'věda metodika důkazy zdroje tvrzení EU',
  },
  {
    kind: 'Stránka',
    id: 'jak-funguje-telo',
    title: 'Jak funguje tělo',
    subtitle: 'Průvodci: spánek, stres, dopamin, svaly, střeva…',
    href: '/jak-funguje-telo',
    text: 'jak funguje tělo průvodci manuál zdraví věda',
  },
  {
    kind: 'Stránka',
    id: 'kviz',
    title: 'Mýtus, nebo fakt? — kvíz',
    subtitle: '10 otázek o těle s vysvětlením',
    href: '/jak-funguje-telo/kviz',
    text: 'kvíz mýtus fakt test otázky',
  },
  {
    kind: 'Stránka',
    id: 'slovnik',
    title: 'Slovník pojmů',
    subtitle: 'Odborná slova, lidsky',
    href: '/jak-funguje-telo/slovnik',
    text: 'slovník pojmy význam co znamená',
  },
  ...TOOLS.map((t) => ({
    kind: 'Kalkulačka' as const,
    id: `tool-${t.guide}`,
    title: t.title,
    subtitle: `Kalkulačka · podle: ${t.basis}`,
    href: `/jak-funguje-telo/${t.guide}#try`,
    text: `${t.title} ${t.text} kalkulačka spočítat`,
  })),
  ...GLOSSARY.map((t) => ({
    kind: 'Pojem' as const,
    id: `term-${t.id}`,
    title: t.term,
    subtitle: t.def,
    href: `/jak-funguje-telo/slovnik#${t.id}`,
    text: `${t.term} ${t.def}`,
  })),
  ...BODY_GUIDES.map((g) => ({
    kind: 'Průvodce' as const,
    id: `guide-${g.slug}`,
    title: g.short,
    subtitle: g.title,
    href: `/jak-funguje-telo/${g.slug}`,
    text: `${g.title} ${g.hook} ${g.tldr.join(' ')} ${g.myths.map((m) => m.myth).join(' ')}`,
  })),
  ...COMPOUNDS.map((c) => ({
    kind: 'Doplněk' as const,
    id: `compound-${c.id}`,
    title: c.name,
    subtitle: `${GOALS[c.goal].label} · ${c.verdict}`,
    href: `/doplnky/${c.slug}`,
    text: `${c.name} ${c.aka ?? ''} ${c.what} ${GOALS[c.goal].label}`,
  })),
  ...ORGANS.map((o) => ({
    kind: 'Orgán' as const,
    id: o.id,
    title: o.shortName,
    subtitle: o.tagline,
    href: `/organ/${o.id}`,
    text: `${o.name} ${o.system} ${o.what}`,
  })),
  ...NUTRIENT_LIST.map((n) => ({
    kind: 'Živina' as const,
    id: n.id,
    title: n.name,
    subtitle: n.kind,
    // nutrients with a supplement guide open that page; the rest jump to the nutrient index
    href: SUPPLEMENT_SLUGS[n.id] ? `/doplnky/${SUPPLEMENT_SLUGS[n.id]}` : `/#nutrient-${n.id}`,
    text: `${n.name} ${n.kind} ${n.blurb}`,
  })),
  ...FOODS.map((f) => ({
    kind: 'Potravina' as const,
    id: f.id,
    title: f.name,
    subtitle: `${f.category} · ${f.kcal} kcal / 100 g`,
    href: `/food/${f.id}`,
    text: `${f.name} ${f.category} ${f.basis}`,
  })),
]

/** Simple ranked search: title prefix > title contains > body contains; every token must match. */
export function search(query: string, limit = 24): SearchItem[] {
  const tokens = norm(query).split(/\s+/).filter(Boolean)
  if (!tokens.length) return []
  return SEARCH_INDEX.map((item) => {
    const title = norm(item.title)
    const all = `${title} ${norm(item.text)}`
    if (!tokens.every((t) => all.includes(t))) return null
    const score = tokens.reduce(
      (s, t) => s + (title.startsWith(t) ? 6 : title.includes(t) ? 3 : 1) + (item.kind === 'Orgán' ? 0.5 : 0),
      0,
    )
    return { item, score }
  })
    .filter((x): x is { item: SearchItem; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item)
}
