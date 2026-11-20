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
  /** other names people type (English, everyday words) — scored like the title */
  aliases?: string
}

/** Words people type for a topic that the guide itself may not use (searched without diacritics). */
const GUIDE_ALIASES: Partial<Record<string, string>> = {
  spanek: 'nespavost insomnie spat usinani chrapani',
  'cukr-a-inzulin': 'cukrovka diabetes glykemie inzulinova rezistence prediabetes',
  'hubnuti-a-energie': 'dieta kalorie zhubnout nadvaha obezita',
  'posilovani-pro-zacatecniky': 'posilovna fitko cviceni trenink zacatecnik',
  'pohyb-a-sezeni': 'chuze kroky sezeni pohyb cviceni beh',
  dlouhovekost: 'kondice vo2max beh vytrvalost stari',
  'srdce-a-tlak': 'hypertenze vysoky tlak infarkt',
  'nalada-a-uzkost': 'deprese uzkost panika psychika',
  'bolest-hlavy': 'migrena hlava',
  'akne-a-plet': 'pupinky plet',
  'streva-a-mikrobiom': 'probiotika mikrobiom nadymani',
  'traveni-a-zacpa': 'prujem nadymani zacpa',
  'zuby-a-usta': 'zuby kaz dasne',
  'alergie-a-pyl': 'senna ryma alergie',
  'prerusovany-pust': 'pust 16 8 intermittent fasting',
  'energie-a-kofein': 'kava kofein energy drink',
  kosti: 'osteoporoza zlomeniny',
  'stitna-zlaza': 'stitna zlaza hypotyreoza hashimoto',
  testosteron: 'testosteron libido',
  'menstruacni-cyklus': 'menstruace perioda pms',
}

/** Everyday and English names for nutrients ("protein" → Bílkoviny). */
const NUTRIENT_ALIASES: Partial<Record<string, string>> = {
  protein: 'protein proteiny',
  fiber: 'fiber fibre',
  vitA: 'retinol vitamin a',
  vitC: 'vitamin c kyselina askorbova',
  vitD: 'vitamin d vitamin d3 cholekalciferol',
  vitE: 'vitamin e tokoferol',
  vitK: 'vitamin k',
  b1: 'thiamin b1',
  b6: 'pyridoxin b6',
  b12: 'kobalamin b12 vitamin b12',
  folate: 'kyselina listova folic acid b9',
  calcium: 'calcium kalcium',
  magnesium: 'magnesium magnezium',
  iron: 'iron',
  zinc: 'zinc',
  iodine: 'iodine',
  potassium: 'potassium kalium',
  omega3: 'omega 3 rybi tuk fish oil epa dha',
  ala: 'omega 3 ala lnene seminko alpha linolenic',
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
    aliases: GUIDE_ALIASES[g.slug],
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
    aliases: NUTRIENT_ALIASES[n.id],
  })),
  ...FOODS.map((f) => ({
    kind: 'Potravina' as const,
    id: f.id,
    title: f.name,
    subtitle: `${f.category} · ${f.kcal} kcal / 100 g`,
    href: `/food/${f.id}`,
    text: `${f.name} ${f.category} ${f.basis}`,
    aliases: f.nameEn,
  })),
]

/** Simple ranked search: title prefix > title contains > body contains; every token must match. */
export function search(query: string, limit = 24): SearchItem[] {
  const tokens = norm(query).split(/\s+/).filter(Boolean)
  if (!tokens.length) return []
  return SEARCH_INDEX.map((item) => {
    const title = norm(item.title)
    const aliases = norm(item.aliases ?? '')
    const all = `${title} ${aliases} ${norm(item.text)}`
    if (!tokens.every((t) => all.includes(t))) return null
    // a whole-word alias hit ("protein" → Bílkoviny) counts like a title prefix
    const aliasWords = aliases.split(/\s+/)
    const score = tokens.reduce(
      (s, t) =>
        s +
        (title.startsWith(t) || aliasWords.includes(t)
          ? 6
          : title.includes(t) || aliases.includes(t)
            ? 3
            : 1) +
        (item.kind === 'Orgán' ? 0.5 : 0),
      0,
    )
    return { item, score }
  })
    .filter((x): x is { item: SearchItem; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item)
}
