/**
 * The nutrient panel stored for every food (per 100 g edible portion). Shared by the import pipeline
 * (scripts/foods) and the UI, so the order, units and labels are defined once.
 *
 * `fdc` lists FoodData Central nutrient ids in order of preference; the first one present wins.
 * Values the source does not report stay `null` ("no data") — never 0.
 */
export type PanelGroup = 'energy' | 'macro' | 'fat' | 'vitamin' | 'mineral' | 'other'
export type PanelUnit = 'kcal' | 'kJ' | 'g' | 'mg' | 'µg'

interface PanelEntryBase {
  key: string
  cs: string
  en: string
  unit: PanelUnit
  group: PanelGroup
  /** FDC nutrient ids, best first; empty = derived in the pipeline */
  fdc: readonly number[]
  /** short explanation shown in the table */
  hint?: string
}

export const PANEL = [
  { key: 'kcal', cs: 'Energie', en: 'Energy', unit: 'kcal', group: 'energy', fdc: [1008, 2048, 2047] },
  { key: 'kj', cs: 'Energie', en: 'Energy', unit: 'kJ', group: 'energy', fdc: [1062] },
  { key: 'protein', cs: 'Bílkoviny', en: 'Protein', unit: 'g', group: 'macro', fdc: [1003] },
  { key: 'fat', cs: 'Tuky', en: 'Total fat', unit: 'g', group: 'macro', fdc: [1004, 1085] },
  { key: 'satFat', cs: 'z toho nasycené', en: 'Saturated fat', unit: 'g', group: 'macro', fdc: [1258] },
  { key: 'monoFat', cs: 'mononenasycené', en: 'Monounsaturated fat', unit: 'g', group: 'macro', fdc: [1292] },
  { key: 'polyFat', cs: 'polynenasycené', en: 'Polyunsaturated fat', unit: 'g', group: 'macro', fdc: [1293] },
  { key: 'transFat', cs: 'trans-mastné kyseliny', en: 'Trans fat', unit: 'g', group: 'macro', fdc: [1257] },
  {
    key: 'carbsAvailable',
    cs: 'Sacharidy (využitelné)',
    en: 'Carbohydrate, available',
    unit: 'g',
    group: 'macro',
    fdc: [],
    hint: 'Evropská konvence: sacharidy bez vlákniny (USDA „by difference“ minus vláknina).',
  },
  {
    key: 'carbsTotal',
    cs: 'Sacharidy celkem (vč. vlákniny)',
    en: 'Carbohydrate, total',
    unit: 'g',
    group: 'macro',
    fdc: [1005, 1050],
    hint: 'Americká konvence: dopočet do 100 %, zahrnuje vlákninu.',
  },
  { key: 'sugars', cs: 'z toho cukry', en: 'Sugars', unit: 'g', group: 'macro', fdc: [2000, 1063] },
  { key: 'addedSugars', cs: 'přidané cukry', en: 'Added sugars', unit: 'g', group: 'macro', fdc: [1235] },
  { key: 'fiber', cs: 'Vláknina', en: 'Dietary fibre', unit: 'g', group: 'macro', fdc: [1079, 2033] },
  { key: 'alcohol', cs: 'Alkohol', en: 'Alcohol', unit: 'g', group: 'macro', fdc: [1018] },
  { key: 'water', cs: 'Voda', en: 'Water', unit: 'g', group: 'macro', fdc: [1051] },
  { key: 'vitA', cs: 'Vitamín A (RAE)', en: 'Vitamin A (RAE)', unit: 'µg', group: 'vitamin', fdc: [1106] },
  { key: 'vitD', cs: 'Vitamín D', en: 'Vitamin D', unit: 'µg', group: 'vitamin', fdc: [1114] },
  {
    key: 'vitE',
    cs: 'Vitamín E (α-tokoferol)',
    en: 'Vitamin E (α-tocopherol)',
    unit: 'mg',
    group: 'vitamin',
    fdc: [1109],
  },
  {
    key: 'vitK',
    cs: 'Vitamín K1',
    en: 'Vitamin K (phylloquinone)',
    unit: 'µg',
    group: 'vitamin',
    fdc: [1185],
  },
  { key: 'vitC', cs: 'Vitamín C', en: 'Vitamin C', unit: 'mg', group: 'vitamin', fdc: [1162] },
  { key: 'b1', cs: 'Vitamín B1 (thiamin)', en: 'Thiamin (B1)', unit: 'mg', group: 'vitamin', fdc: [1165] },
  {
    key: 'b2',
    cs: 'Vitamín B2 (riboflavin)',
    en: 'Riboflavin (B2)',
    unit: 'mg',
    group: 'vitamin',
    fdc: [1166],
  },
  { key: 'b3', cs: 'Vitamín B3 (niacin)', en: 'Niacin (B3)', unit: 'mg', group: 'vitamin', fdc: [1167] },
  {
    key: 'b5',
    cs: 'Vitamín B5 (kyselina pantotenová)',
    en: 'Pantothenic acid (B5)',
    unit: 'mg',
    group: 'vitamin',
    fdc: [1170],
  },
  { key: 'b6', cs: 'Vitamín B6', en: 'Vitamin B6', unit: 'mg', group: 'vitamin', fdc: [1175] },
  { key: 'b7', cs: 'Vitamín B7 (biotin)', en: 'Biotin (B7)', unit: 'µg', group: 'vitamin', fdc: [1176] },
  { key: 'folate', cs: 'Folát (DFE)', en: 'Folate (DFE)', unit: 'µg', group: 'vitamin', fdc: [1190] },
  { key: 'b12', cs: 'Vitamín B12', en: 'Vitamin B12', unit: 'µg', group: 'vitamin', fdc: [1178] },
  { key: 'choline', cs: 'Cholin', en: 'Choline', unit: 'mg', group: 'vitamin', fdc: [1180] },
  { key: 'calcium', cs: 'Vápník', en: 'Calcium', unit: 'mg', group: 'mineral', fdc: [1087] },
  { key: 'phosphorus', cs: 'Fosfor', en: 'Phosphorus', unit: 'mg', group: 'mineral', fdc: [1091] },
  { key: 'magnesium', cs: 'Hořčík', en: 'Magnesium', unit: 'mg', group: 'mineral', fdc: [1090] },
  { key: 'potassium', cs: 'Draslík', en: 'Potassium', unit: 'mg', group: 'mineral', fdc: [1092] },
  { key: 'sodium', cs: 'Sodík', en: 'Sodium', unit: 'mg', group: 'mineral', fdc: [1093] },
  {
    key: 'salt',
    cs: 'Sůl',
    en: 'Salt',
    unit: 'g',
    group: 'mineral',
    fdc: [],
    hint: 'Sůl = sodík × 2,5 (nařízení EU 1169/2011).',
  },
  { key: 'iron', cs: 'Železo', en: 'Iron', unit: 'mg', group: 'mineral', fdc: [1089] },
  { key: 'zinc', cs: 'Zinek', en: 'Zinc', unit: 'mg', group: 'mineral', fdc: [1095] },
  { key: 'copper', cs: 'Měď', en: 'Copper', unit: 'mg', group: 'mineral', fdc: [1098] },
  { key: 'manganese', cs: 'Mangan', en: 'Manganese', unit: 'mg', group: 'mineral', fdc: [1101] },
  { key: 'selenium', cs: 'Selen', en: 'Selenium', unit: 'µg', group: 'mineral', fdc: [1103] },
  {
    key: 'iodine',
    cs: 'Jód',
    en: 'Iodine',
    unit: 'µg',
    group: 'mineral',
    fdc: [1100],
    hint: 'Obsah jódu se v potravinách hodně liší (půda, krmivo, jodidovaná sůl); USDA ho uvádí jen u části potravin.',
  },
  { key: 'epa', cs: 'EPA (omega-3)', en: 'EPA (omega-3)', unit: 'g', group: 'fat', fdc: [1278] },
  { key: 'dha', cs: 'DHA (omega-3)', en: 'DHA (omega-3)', unit: 'g', group: 'fat', fdc: [1272] },
  { key: 'ala', cs: 'ALA (omega-3)', en: 'ALA (omega-3)', unit: 'g', group: 'fat', fdc: [1404, 1270] },
  {
    key: 'omega6',
    cs: 'Kyselina linolová (omega-6)',
    en: 'Linoleic acid (omega-6)',
    unit: 'g',
    group: 'fat',
    fdc: [1316, 1269],
  },
  { key: 'cholesterol', cs: 'Cholesterol', en: 'Cholesterol', unit: 'mg', group: 'fat', fdc: [1253] },
  {
    key: 'lutein',
    cs: 'Lutein + zeaxantin',
    en: 'Lutein + zeaxanthin',
    unit: 'µg',
    group: 'other',
    fdc: [1123],
  },
  { key: 'betaCarotene', cs: 'Beta-karoten', en: 'Beta-carotene', unit: 'µg', group: 'other', fdc: [1107] },
  { key: 'caffeine', cs: 'Kofein', en: 'Caffeine', unit: 'mg', group: 'other', fdc: [1057] },
] as const satisfies readonly (PanelEntryBase & { fdc: readonly number[] })[]

export type PanelKey = (typeof PANEL)[number]['key']
export type PanelEntry = PanelEntryBase & { key: PanelKey }
export type Panel = Record<PanelKey, number | null>

export const PANEL_BY_KEY = Object.fromEntries(PANEL.map((p) => [p.key, p])) as unknown as Record<
  PanelKey,
  PanelEntry
>

export const PANEL_GROUPS: { id: PanelGroup; cs: string }[] = [
  { id: 'energy', cs: 'Energie' },
  { id: 'macro', cs: 'Makroživiny' },
  { id: 'vitamin', cs: 'Vitamíny' },
  { id: 'mineral', cs: 'Minerální látky' },
  { id: 'fat', cs: 'Mastné kyseliny a cholesterol' },
  { id: 'other', cs: 'Další látky' },
]

/**
 * Reference intakes for adults from Reg. (EU) 1169/2011, Annex XIII: Part A (vitamins and minerals, NRV)
 * and Part B (energy and macronutrients, RI). Used for the "% RHP" column.
 */
export const EU_REFERENCE: Partial<Record<PanelKey, number>> = {
  kcal: 2000,
  kj: 8400,
  fat: 70,
  satFat: 20,
  carbsAvailable: 260,
  sugars: 90,
  protein: 50,
  salt: 6,
  vitA: 800,
  vitD: 5,
  vitE: 12,
  vitK: 75,
  vitC: 80,
  b1: 1.1,
  b2: 1.4,
  b3: 16,
  b5: 6,
  b6: 1.4,
  b7: 50,
  folate: 200,
  b12: 2.5,
  potassium: 2000,
  calcium: 800,
  phosphorus: 700,
  magnesium: 375,
  iron: 14,
  zinc: 10,
  copper: 1,
  manganese: 2,
  selenium: 55,
  iodine: 150,
}

/** Annex XIII Part A only (vitamins and minerals): the 15 % "source of" rule applies to these. */
export const NRV_KEYS = new Set<PanelKey>([
  'vitA',
  'vitD',
  'vitE',
  'vitK',
  'vitC',
  'b1',
  'b2',
  'b3',
  'b5',
  'b6',
  'b7',
  'folate',
  'b12',
  'potassium',
  'calcium',
  'phosphorus',
  'magnesium',
  'iron',
  'zinc',
  'copper',
  'manganese',
  'selenium',
  'iodine',
])
