import type { NutrientId } from './types'

/**
 * Ukázkové odkazy na české obchody, kde lze živiny koupit jako doplněk stravy nebo potravinu.
 * FLX není partnerem těchto obchodů a nedostává provize. Ceny a složení se mění — vždy platí údaje prodejce.
 * Odkazy byly ověřeny 16. 11. 2026; před spuštěním je znovu zkontrolujte (`npm run check:links`).
 */
export type RetailerId = 'brainmarket' | 'vilgain'

export const RETAILERS: Record<RetailerId, { name: string; url: string }> = {
  brainmarket: { name: 'BrainMarket', url: 'https://www.brainmarket.cz' },
  vilgain: { name: 'Vilgain', url: 'https://vilgain.cz' },
}

export interface ShopLink {
  retailer: RetailerId
  /** název produktu nebo kategorie tak, jak ho uvádí prodejce (zkráceně) */
  label: string
  url: string
  kind: 'doplněk' | 'kategorie' | 'potravina'
  /** upozornění k dávce nebo použití */
  note?: string
}

const bm = (path: string, label: string, kind: ShopLink['kind'] = 'doplněk', note?: string): ShopLink => ({
  retailer: 'brainmarket',
  label,
  url: `${RETAILERS.brainmarket.url}${path}`,
  kind,
  note,
})
const vg = (path: string, label: string, kind: ShopLink['kind'] = 'doplněk', note?: string): ShopLink => ({
  retailer: 'vilgain',
  label,
  url: `${RETAILERS.vilgain.url}${path}`,
  kind,
  note,
})

const HIGH_D = 'Vysoká dávka (4000 IU = 100 µg, horní hranice EFSA pro dospělé). Dávku probírejte s lékařem.'
const IRON = 'Železo doplňujte jen při prokázaném nedostatku — nadbytek škodí.'
const STRAIN = 'Účinky probiotik jsou kmenově specifické; obecné tvrzení „podporuje střeva“ EU neschválila.'

export const WHERE_TO_BUY: Partial<Record<NutrientId, ShopLink[]>> = {
  omega3: [
    bm('/brainmax-omega-3-fish-oil--60-softgel-kapsli/', 'BrainMax Omega-3 Fish Oil, 60 kapslí'),
    vg('/vilgain-omega-3', 'Vilgain Omega 3'),
    vg('/vilgain-vegan-omega-3', 'Vilgain Vegan Omega 3 (z řas)'),
  ],
  vitD: [
    bm('/brainmax-vitamin-d3-4000-iu--120-kapsli/', 'BrainMax Vitamin D3 4000 IU', 'doplněk', HIGH_D),
    vg('/vilgain-vitamin-d3', 'Vilgain Vitamin D3'),
  ],
  magnesium: [
    bm('/brainmax-magnesium-bisglycinate-90-rostlinnych-kapsli/', 'BrainMax Magnesium Bisglycinate'),
    vg('/vilgain-horcik-bisglycinat', 'Vilgain Hořčík bisglycinát'),
  ],
  zinc: [bm('/brainmax-zinc-complex/', 'BrainMax Zinc Complex'), vg('/vilgain-zinek', 'Vilgain Zinek')],
  iron: [
    bm(
      '/brainmax-iron-complex--zelezo--25-mg--100-rostlinnych-kapsli/',
      'BrainMax Iron Complex',
      'doplněk',
      IRON,
    ),
    vg('/zelezo', 'Vilgain — železo', 'kategorie', IRON),
  ],
  vitC: [
    bm(
      '/brainmax-liposomal-vitamin-c--500-mg--60-rostlinnych-kapsli/',
      'BrainMax Liposomal Vitamin C 500 mg',
    ),
    vg('/vitamin-c', 'Vilgain — vitamín C', 'kategorie'),
  ],
  b12: [
    bm('/vitamin-b/', 'BrainMarket — vitamíny B', 'kategorie'),
    vg('/vitamin-b', 'Vilgain — vitamíny B', 'kategorie'),
  ],
  vitK: [bm('/vitamin-k/', 'BrainMarket — vitamín K', 'kategorie')],
  calcium: [bm('/vapnik/', 'BrainMarket — vápník', 'kategorie')],
  protein: [
    bm('/brainmax-grass-fed-whey-protein--cokolada--1000-g/', 'BrainMax Grass-fed Whey Protein'),
    vg('/vilgain-grass-fed-whey-protein', 'Vilgain Grass-Fed Whey Protein'),
    vg('/veganske-proteiny', 'Vilgain — veganské proteiny', 'kategorie'),
  ],
  fiber: [
    bm('/brainmax-pure-psyllium--rozpustna-vlaknina--500-g--bio/', 'BrainMax Pure Psyllium BIO'),
    vg('/vlocky', 'Vilgain — ovesné a jiné vločky', 'potravina'),
  ],
  cultures: [
    bm(
      '/brainmax-probiotic-complex--60-enterosolventnich-kapsli/',
      'BrainMax Probiotic Complex',
      'doplněk',
      STRAIN,
    ),
    vg('/probiotika', 'Vilgain — probiotika', 'kategorie', STRAIN),
  ],
  ala: [vg('/semena', 'Vilgain — semínka (lněná, chia)', 'potravina')],
  vitE: [vg('/orisky', 'Vilgain — ořechy', 'potravina')],
}

/** Témata mimo seznam živin (looksmaxing a sport). */
export const TOPIC_LINKS = {
  creatine: [
    bm('/brainmax-creatine--kreatin-monohydrat--500-g/', 'BrainMax Creatine Monohydrate 500 g'),
    vg('/vilgain-kreatin', 'Vilgain Kreatin monohydrát'),
  ],
  collagen: [
    bm('/kolageny/', 'BrainMarket — kolageny', 'kategorie'),
    vg('/kolagen', 'Vilgain — kolagen', 'kategorie'),
  ],
  fish: [vg('/losos', 'Vilgain — losos', 'potravina'), vg('/sardinky', 'Vilgain — sardinky', 'potravina')],
} satisfies Record<string, ShopLink[]>

export const ALL_SHOP_LINKS: ShopLink[] = [
  ...Object.values(WHERE_TO_BUY).flat(),
  ...Object.values(TOPIC_LINKS).flat(),
] as ShopLink[]
