import type { NutrientId, Source } from './types'

/**
 * Referenční hodnoty pro dospělé (18+). Tři různá čísla, která se často pletou:
 *  - RHP (EU NRV, nař. 1169/2011): jedno číslo pro etikety potravin a doplňků („% RHP“).
 *  - EFSA DRV: skutečné doporučení pro populaci — PRI (doporučený příjem, pokryje potřebu ~97,5 % lidí)
 *    nebo AI (adekvátní příjem, když data na PRI nestačí). Často se liší pro muže a ženy.
 *  - UL (EFSA): nejvyšší dlouhodobý denní příjem ze všech zdrojů, u kterého se nečekají nežádoucí účinky.
 * Ověřeno k 16. 11. 2026 (EFSA DRV 2017, aktualizace UL 2022–2024).
 */
export interface ReferenceValues {
  /** EFSA doporučení pro dospělé */
  efsa?: { kind: 'PRI' | 'AI'; text: string; note?: string }
  /** horní bezpečný limit (UL) nebo bezpečná úroveň */
  ul?: { text: string; note?: string }
}

export const REF_SRC = {
  efsaDrv: {
    title: 'EFSA (2017, aktualizace 2019) — Dietary Reference Values for nutrients, souhrnná zpráva',
    url: 'https://efsa.europa.eu/en/supporting/pub/e15121',
  },
  efsaUl: {
    title: 'EFSA (2024) — Tolerable upper intake levels for vitamins and minerals, přehled',
    url: 'https://www.efsa.europa.eu/sites/default/files/2024-05/ul-summary-report.pdf',
  },
  drvFinder: {
    title: 'EFSA DRV Finder — interaktivní vyhledávač referenčních hodnot',
    url: 'https://multimedia.efsa.europa.eu/drvs/index.htm',
  },
} satisfies Record<string, Source>

export const REFERENCE: Partial<Record<NutrientId, ReferenceValues>> = {
  protein: {
    efsa: {
      kind: 'PRI',
      text: '0,83 g na kg tělesné hmotnosti',
      note: 'Při silovém tréninku se obvykle doporučuje 1,4–2 g/kg.',
    },
  },
  fiber: { efsa: { kind: 'AI', text: '25 g' } },
  vitA: {
    efsa: { kind: 'PRI', text: 'muži 750 µg · ženy 650 µg' },
    ul: {
      text: '3 000 µg (jen hotový vitamín A, ne beta-karoten)',
      note: 'V těhotenství pozor na játra a doplňky s retinolem.',
    },
  },
  vitC: {
    efsa: { kind: 'PRI', text: 'muži 110 mg · ženy 95 mg' },
    ul: { text: 'nestanoven', note: 'Nad ~1 g denně klesá vstřebání a mohou nastat zažívací potíže.' },
  },
  vitD: {
    efsa: {
      kind: 'AI',
      text: '15 µg (600 IU)',
      note: 'Předpokládá minimální tvorbu v kůži — v ČR typicky říjen až březen.',
    },
    ul: { text: '100 µg (4 000 IU)' },
  },
  vitE: { efsa: { kind: 'AI', text: 'muži 13 mg · ženy 11 mg' }, ul: { text: '300 mg' } },
  vitK: {
    efsa: { kind: 'AI', text: '70 µg' },
    ul: { text: 'nestanoven', note: 'Při léčbě warfarinem nutná konzultace s lékařem.' },
  },
  b1: { efsa: { kind: 'PRI', text: '0,1 mg na MJ energie (≈ 1 mg)' } },
  b6: {
    efsa: { kind: 'PRI', text: 'muži 1,7 mg · ženy 1,6 mg' },
    ul: { text: '12 mg', note: 'EFSA ho v roce 2023 snížila — pozor na vysoce dávkované B-komplexy.' },
  },
  b12: { efsa: { kind: 'AI', text: '4 µg' }, ul: { text: 'nestanoven' } },
  folate: {
    efsa: { kind: 'PRI', text: '330 µg DFE' },
    ul: { text: '1 000 µg (jen kyselina listová z doplňků)' },
  },
  choline: { efsa: { kind: 'AI', text: '400 mg' } },
  calcium: { efsa: { kind: 'PRI', text: '950 mg (18–24 let 1 000 mg)' }, ul: { text: '2 500 mg' } },
  phosphorus: { efsa: { kind: 'AI', text: '550 mg' } },
  magnesium: {
    efsa: { kind: 'AI', text: 'muži 350 mg · ženy 300 mg' },
    ul: { text: '250 mg z doplňků', note: 'Limit platí jen pro doplňky; hořčík z jídla se nezapočítává.' },
  },
  potassium: { efsa: { kind: 'AI', text: '3 500 mg' } },
  iron: {
    efsa: { kind: 'PRI', text: 'muži 11 mg · ženy před menopauzou 16 mg' },
    ul: { text: 'bezpečná úroveň 40 mg', note: 'EFSA (2024) UL nestanovila, jen bezpečnou úroveň příjmu.' },
  },
  zinc: {
    efsa: {
      kind: 'PRI',
      text: 'muži 9,4–16,3 mg · ženy 7,5–12,7 mg',
      note: 'Podle množství fytátů ve stravě (luštěniny, celozrnné obiloviny).',
    },
    ul: { text: '25 mg' },
  },
  iodine: { efsa: { kind: 'AI', text: '150 µg' }, ul: { text: '600 µg' } },
  omega3: {
    efsa: { kind: 'AI', text: '250 mg EPA + DHA' },
    ul: { text: 'nestanoven', note: 'EFSA: do 5 g EPA + DHA denně z doplňků bez obav.' },
  },
  ala: { efsa: { kind: 'AI', text: '0,5 % energie (≈ 1–1,5 g)' } },
  water: { efsa: { kind: 'AI', text: 'muži 2,5 l · ženy 2,0 l (ze všech zdrojů)' } },
}
