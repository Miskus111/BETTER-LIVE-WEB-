import type { NutrientId } from './types'

/**
 * Doporučené produkty v českých obchodech (affiliate odkazy, viz src/data/affiliate.ts).
 * Výběr: nejlépe vstřebatelná forma (src/data/absorption.ts), rozumná dávka pod horním limitem (UL),
 * transparentní složení. Ceny a složení se mění — vždy platí údaje prodejce.
 * Odkazy ověřeny 16. 11. 2026; kontrola: `npm run check:links`.
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
  /** proč tento produkt: forma a dávka */
  why?: string
}

const bm = (
  path: string,
  label: string,
  kind: ShopLink['kind'] = 'doplněk',
  note?: string,
  why?: string,
): ShopLink => ({
  retailer: 'brainmarket',
  label,
  url: `${RETAILERS.brainmarket.url}${path}`,
  kind,
  note,
  why,
})
const vg = (
  path: string,
  label: string,
  kind: ShopLink['kind'] = 'doplněk',
  note?: string,
  why?: string,
): ShopLink => ({
  retailer: 'vilgain',
  label,
  url: `${RETAILERS.vilgain.url}${path}`,
  kind,
  note,
  why,
})

const HIGH_D =
  'Vysoká dávka: 4000 IU = 100 µg, tedy horní limit EFSA. Jen po změření hladiny nebo na doporučení lékaře.'
const IRON = 'Železo doplňujte jen při prokázaném nedostatku (krevní test) — nadbytek škodí.'
const STRAIN = 'Účinek probiotik je kmenově specifický; obecné tvrzení „podporuje střeva“ EU neschválila.'

export const WHERE_TO_BUY: Partial<Record<NutrientId, ShopLink[]>> = {
  omega3: [
    bm(
      '/brainmax-omega-3-fish-oil--60-softgel-kapsli/',
      'BrainMax Omega-3 Fish Oil',
      'doplněk',
      undefined,
      'Forma rTG · ≈ 1 000 mg EPA + DHA ve 2 kapslích · zveřejněné hodnoty oxidace (TOTOX 10)',
    ),
    vg(
      '/vilgain-omega-3',
      'Vilgain Omega 3',
      'doplněk',
      undefined,
      'Přirozené triglyceridy · 500 mg EPA + DHA ve 2 kapslích',
    ),
    vg(
      '/vilgain-vegan-omega-3',
      'Vilgain Vegan Omega 3',
      'doplněk',
      undefined,
      'Olej z řas — varianta pro vegany',
    ),
  ],
  vitD: [
    vg(
      '/vilgain-vitamin-d3',
      'Vilgain Vitamin D3',
      'doplněk',
      undefined,
      'D3 z lišejníku (vhodné i pro vegany) · 1 000 IU = 25 µg v kapsli',
    ),
    bm(
      '/brainmax-vitamin-d3-4000-iu--120-kapsli/',
      'BrainMax Vitamin D3 4000 IU',
      'doplněk',
      HIGH_D,
      'D3 · 4 000 IU = 100 µg — jen při zjištěném nedostatku',
    ),
  ],
  magnesium: [
    bm(
      '/brainmax-magnesium-bisglycinate-90-rostlinnych-kapsli/',
      'BrainMax Magnesium Bisglycinate',
      'doplněk',
      undefined,
      'Bisglycinát — dobře vstřebatelný, šetrný k zažívání',
    ),
    vg(
      '/vilgain-horcik-bisglycinat',
      'Vilgain Hořčík bisglycinát',
      'doplněk',
      undefined,
      'Bisglycinát — dobře vstřebatelný, šetrný k zažívání',
    ),
  ],
  zinc: [
    vg('/vilgain-zinek', 'Vilgain Zinek', 'doplněk', undefined, 'Bisglycinát · 10 mg v kapsli'),
    bm(
      '/brainmax-zinc-complex/',
      'BrainMax Zinc Complex',
      'doplněk',
      undefined,
      'Bisglycinát · 15 mg zinku + 1 mg mědi (chrání před nedostatkem mědi) + selen',
    ),
  ],
  iron: [
    bm(
      '/brainmax-iron-complex--zelezo--25-mg--100-rostlinnych-kapsli/',
      'BrainMax Iron Complex',
      'doplněk',
      IRON,
      'Bisglycinát železnatý · 20 mg + vitamín C pro lepší vstřebání',
    ),
    vg('/zelezo', 'Vilgain — železo', 'kategorie', IRON),
  ],
  vitC: [
    vg(
      '/vitamin-c',
      'Vilgain — vitamín C',
      'kategorie',
      undefined,
      'Běžná kyselina askorbová stačí; dražší lipozomální forma není nutná',
    ),
    bm('/vitamin-c-2/', 'BrainMarket — vitamín C', 'kategorie'),
  ],
  b12: [
    bm('/vitamin-b/', 'BrainMarket — vitamíny B', 'kategorie'),
    vg('/vitamin-b', 'Vilgain — vitamíny B', 'kategorie'),
  ],
  vitK: [bm('/vitamin-k/', 'BrainMarket — vitamín K', 'kategorie')],
  calcium: [bm('/vapnik/', 'BrainMarket — vápník', 'kategorie')],
  protein: [
    vg(
      '/vilgain-grass-fed-whey-protein',
      'Vilgain Grass-Fed Whey Protein',
      'doplněk',
      undefined,
      'Syrovátkový protein z mléka krav na pastvě',
    ),
    bm(
      '/brainmax-grass-fed-whey-protein--cokolada--1000-g/',
      'BrainMax Grass-fed Whey Protein',
      'doplněk',
      undefined,
      'Mikrofiltrovaná syrovátka',
    ),
    vg('/veganske-proteiny', 'Vilgain — veganské proteiny', 'kategorie'),
  ],
  fiber: [
    bm(
      '/brainmax-pure-psyllium--rozpustna-vlaknina--500-g--bio/',
      'BrainMax Pure Psyllium BIO',
      'doplněk',
      undefined,
      'Rozpustná vláknina, certifikované bio',
    ),
    vg('/vlocky', 'Vilgain — vločky', 'potravina', undefined, 'Ovesné vločky = beta-glukan přímo z jídla'),
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
    bm(
      '/brainmax-creatine--kreatin-monohydrat--500-g/',
      'BrainMax Creatine Monohydrate 500 g',
      'doplněk',
      undefined,
      'Monohydrát — nejlépe prozkoumaná forma; jiné formy nejsou prokazatelně lepší',
    ),
    vg(
      '/vilgain-kreatin',
      'Vilgain Kreatin monohydrát',
      'doplněk',
      undefined,
      'Monohydrát — nejlépe prozkoumaná forma',
    ),
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
