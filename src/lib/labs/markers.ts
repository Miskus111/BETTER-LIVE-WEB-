/**
 * Biomarker catalogue for lab-report import.
 *
 * Canonical units follow what Czech/Slovak labs print (SI, µkat/L for liver enzymes,
 * IFCC mmol/mol for HbA1c). Reference ranges here are generic adult ranges used only when
 * the report itself does not carry one — the lab's own range always wins.
 * Information only, not a diagnosis.
 */

export type MarkerCategory =
  | 'metabolic'
  | 'lipids'
  | 'liver'
  | 'kidney'
  | 'thyroid'
  | 'blood'
  | 'iron'
  | 'vitamins'
  | 'minerals'
  | 'inflammation'
  | 'hormones'

export interface Marker {
  key: string
  cs: string
  en: string
  unit: string
  category: MarkerCategory
  /** normalised (lower-case, no diacritics/spaces) names a lab might print */
  aliases: string[]
  low?: number
  high?: number
  /** values outside these are "critical" — see a doctor today */
  criticalLow?: number
  criticalHigh?: number
  /** factor to multiply a value in another unit to get the canonical unit */
  convert?: Record<string, number>
}

export const MARKERS: Marker[] = [
  {
    key: 'glucose',
    cs: 'Glukóza',
    en: 'Glucose',
    unit: 'mmol/L',
    category: 'metabolic',
    aliases: ['glukoza', 'glucose', 'glu', 'sglu', 'glykemie', 'glukozanalacno'],
    low: 3.9,
    high: 5.6,
    criticalLow: 2.8,
    criticalHigh: 25,
    convert: { 'mg/dl': 0.0555 },
  },
  {
    key: 'hba1c',
    cs: 'HbA1c (glykovaný hemoglobin)',
    en: 'HbA1c',
    unit: 'mmol/mol',
    category: 'metabolic',
    aliases: ['hba1c', 'glykovanyhemoglobin', 'glykohemoglobin', 'a1c'],
    low: 20,
    high: 42,
  },
  {
    key: 'insulin',
    cs: 'Inzulin',
    en: 'Insulin',
    unit: 'mU/L',
    category: 'metabolic',
    aliases: ['inzulin', 'insulin'],
    low: 2,
    high: 25,
    convert: { 'uiu/ml': 1, 'miu/l': 1, 'pmol/l': 0.144 },
  },
  {
    key: 'chol_total',
    cs: 'Cholesterol celkový',
    en: 'Total cholesterol',
    unit: 'mmol/L',
    category: 'lipids',
    aliases: ['cholesterol', 'cholesterolcelkovy', 'totalcholesterol', 'chol', 'scholesterol'],
    high: 5.0,
    convert: { 'mg/dl': 0.02586 },
  },
  {
    key: 'ldl',
    cs: 'LDL cholesterol',
    en: 'LDL cholesterol',
    unit: 'mmol/L',
    category: 'lipids',
    aliases: ['ldl', 'ldlcholesterol', 'ldlc', 'ldlchol'],
    high: 3.0,
    convert: { 'mg/dl': 0.02586 },
  },
  {
    key: 'hdl',
    cs: 'HDL cholesterol',
    en: 'HDL cholesterol',
    unit: 'mmol/L',
    category: 'lipids',
    aliases: ['hdl', 'hdlcholesterol', 'hdlc', 'hdlchol'],
    low: 1.0,
    convert: { 'mg/dl': 0.02586 },
  },
  {
    key: 'tg',
    cs: 'Triacylglyceroly',
    en: 'Triglycerides',
    unit: 'mmol/L',
    category: 'lipids',
    aliases: ['triacylglyceroly', 'triglyceridy', 'triglycerides', 'tg', 'tag'],
    high: 1.7,
    convert: { 'mg/dl': 0.01129 },
  },
  {
    key: 'alt',
    cs: 'ALT',
    en: 'ALT',
    unit: 'µkat/L',
    category: 'liver',
    aliases: ['alt', 'alat', 'alaninaminotransferaza', 'sgpt'],
    high: 0.8,
    convert: { 'u/l': 0.01667, 'iu/l': 0.01667 },
  },
  {
    key: 'ast',
    cs: 'AST',
    en: 'AST',
    unit: 'µkat/L',
    category: 'liver',
    aliases: ['ast', 'asat', 'aspartataminotransferaza', 'sgot'],
    high: 0.72,
    convert: { 'u/l': 0.01667, 'iu/l': 0.01667 },
  },
  {
    key: 'ggt',
    cs: 'GGT',
    en: 'GGT',
    unit: 'µkat/L',
    category: 'liver',
    aliases: ['ggt', 'gmt', 'gamaglutamyltransferaza'],
    high: 0.84,
    convert: { 'u/l': 0.01667, 'iu/l': 0.01667 },
  },
  {
    key: 'creatinine',
    cs: 'Kreatinin',
    en: 'Creatinine',
    unit: 'µmol/L',
    category: 'kidney',
    aliases: ['kreatinin', 'creatinine', 'krea', 'screa'],
    low: 44,
    high: 104,
    convert: { 'mg/dl': 88.4 },
  },
  {
    key: 'egfr',
    cs: 'eGFR',
    en: 'eGFR',
    unit: 'mL/min/1.73m²',
    category: 'kidney',
    aliases: ['egfr', 'gfr', 'egfrckdepi', 'odhadgf'],
    low: 60,
    convert: { 'ml/s/1.73m2': 60, 'ml/s': 60 },
  },
  {
    key: 'uric_acid',
    cs: 'Kyselina močová',
    en: 'Uric acid',
    unit: 'µmol/L',
    category: 'kidney',
    aliases: ['kyselinamocova', 'uricacid', 'urat', 'kysmocova'],
    low: 200,
    high: 420,
    convert: { 'mg/dl': 59.48 },
  },
  {
    key: 'tsh',
    cs: 'TSH',
    en: 'TSH',
    unit: 'mU/L',
    category: 'thyroid',
    aliases: ['tsh', 'tyreotropin', 'thyrotropin'],
    low: 0.27,
    high: 4.2,
    convert: { 'miu/l': 1, 'uiu/ml': 1 },
  },
  {
    key: 'ft4',
    cs: 'fT4',
    en: 'Free T4',
    unit: 'pmol/L',
    category: 'thyroid',
    aliases: ['ft4', 'volnyt4', 'freet4', 'volnytyroxin'],
    low: 12,
    high: 22,
    convert: { 'ng/dl': 12.87 },
  },
  {
    key: 'hemoglobin',
    cs: 'Hemoglobin',
    en: 'Haemoglobin',
    unit: 'g/L',
    category: 'blood',
    aliases: ['hemoglobin', 'haemoglobin', 'hb', 'hgb'],
    low: 120,
    high: 175,
    criticalLow: 70,
    convert: { 'g/dl': 10 },
  },
  {
    key: 'hematocrit',
    cs: 'Hematokrit',
    en: 'Haematocrit',
    unit: 'ratio',
    category: 'blood',
    aliases: ['hematokrit', 'hematocrit', 'hct', 'htk'],
    low: 0.36,
    high: 0.52,
    convert: { '%': 0.01 },
  },
  {
    key: 'wbc',
    cs: 'Leukocyty',
    en: 'White blood cells',
    unit: '10⁹/L',
    category: 'blood',
    aliases: ['leukocyty', 'wbc', 'leu', 'leukocytes'],
    low: 4,
    high: 10,
    criticalLow: 1,
    criticalHigh: 30,
  },
  {
    key: 'platelets',
    cs: 'Trombocyty',
    en: 'Platelets',
    unit: '10⁹/L',
    category: 'blood',
    aliases: ['trombocyty', 'plt', 'platelets', 'trom'],
    low: 150,
    high: 400,
    criticalLow: 50,
  },
  {
    key: 'ferritin',
    cs: 'Feritin',
    en: 'Ferritin',
    unit: 'µg/L',
    category: 'iron',
    aliases: ['feritin', 'ferritin', 'sferritin'],
    low: 30,
    high: 300,
    convert: { 'ng/ml': 1 },
  },
  {
    key: 'iron',
    cs: 'Železo',
    en: 'Iron',
    unit: 'µmol/L',
    category: 'iron',
    aliases: ['zelezo', 'iron', 'fe', 'sfe'],
    low: 9,
    high: 30,
    convert: { 'ug/dl': 0.179 },
  },
  {
    key: 'vitd',
    cs: 'Vitamin D (25-OH)',
    en: 'Vitamin D (25-OH)',
    unit: 'nmol/L',
    category: 'vitamins',
    aliases: [
      'vitamind',
      '25ohvitamind',
      '25ohd',
      'vitd',
      '25hydroxyvitamind',
      'kalcidiol',
      'calcidiol',
      '25ohd3',
      'vitamind25oh',
    ],
    low: 50,
    high: 250,
    convert: { 'ng/ml': 2.496, 'ug/l': 2.496 },
  },
  {
    key: 'b12',
    cs: 'Vitamin B12',
    en: 'Vitamin B12',
    unit: 'pmol/L',
    category: 'vitamins',
    aliases: ['vitaminb12', 'b12', 'kobalamin', 'cobalamin'],
    low: 145,
    high: 569,
    convert: { 'pg/ml': 0.738, 'ng/l': 0.738 },
  },
  {
    key: 'folate',
    cs: 'Kyselina listová (folát)',
    en: 'Folate',
    unit: 'nmol/L',
    category: 'vitamins',
    aliases: ['folat', 'folate', 'kyselinalistova', 'folicacid'],
    low: 7,
    convert: { 'ng/ml': 2.266, 'ug/l': 2.266 },
  },
  {
    key: 'magnesium',
    cs: 'Hořčík',
    en: 'Magnesium',
    unit: 'mmol/L',
    category: 'minerals',
    aliases: ['horcik', 'magnesium', 'mg', 'smg'],
    low: 0.66,
    high: 1.07,
    convert: { 'mg/dl': 0.4114 },
  },
  {
    key: 'potassium',
    cs: 'Draslík',
    en: 'Potassium',
    unit: 'mmol/L',
    category: 'minerals',
    aliases: ['draslik', 'potassium', 'k', 'sk'],
    low: 3.5,
    high: 5.1,
    criticalLow: 2.8,
    criticalHigh: 6.2,
  },
  {
    key: 'sodium',
    cs: 'Sodík',
    en: 'Sodium',
    unit: 'mmol/L',
    category: 'minerals',
    aliases: ['sodik', 'sodium', 'na', 'sna'],
    low: 136,
    high: 145,
    criticalLow: 125,
    criticalHigh: 155,
  },
  {
    key: 'calcium',
    cs: 'Vápník',
    en: 'Calcium',
    unit: 'mmol/L',
    category: 'minerals',
    aliases: ['vapnik', 'calcium', 'ca', 'sca', 'vapnikcelkovy'],
    low: 2.15,
    high: 2.55,
    criticalLow: 1.75,
    criticalHigh: 3.2,
    convert: { 'mg/dl': 0.2495 },
  },
  {
    key: 'crp',
    cs: 'CRP',
    en: 'CRP',
    unit: 'mg/L',
    category: 'inflammation',
    aliases: ['crp', 'creaktivniprotein', 'creactiveprotein', 'hscrp'],
    high: 5,
    convert: { 'mg/dl': 10 },
  },
  {
    key: 'testosterone',
    cs: 'Testosteron',
    en: 'Testosterone',
    unit: 'nmol/L',
    category: 'hormones',
    aliases: ['testosteron', 'testosterone', 'testosteroncelkovy'],
    convert: { 'ng/dl': 0.0347, 'ng/ml': 3.47 },
  },
]

export const MARKER_BY_KEY: Record<string, Marker> = Object.fromEntries(MARKERS.map((m) => [m.key, m]))

/** lower-case, strip diacritics and everything that is not a letter/digit */
export const normName = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^s[-_ ]/, 's')
    .replace(/[^a-z0-9]/g, '')

export const normUnit = (u: string) =>
  u.trim().toLowerCase().replace(/μ|µ/g, 'u').replace(/\s+/g, '').replace(/²/g, '2')

export function matchMarker(name: string): Marker | null {
  const n = normName(name)
  if (!n) return null
  return (
    MARKERS.find((m) => m.aliases.includes(n) || normName(m.cs) === n || normName(m.en) === n) ??
    // tolerate trailing qualifiers like "glukozavplazme" / "hdlcholesterolserum"
    MARKERS.find((m) => m.aliases.some((a) => a.length >= 3 && n.startsWith(a))) ??
    null
  )
}

/** Convert a value into the marker's canonical unit; null when the unit is unknown. */
export function toCanonical(m: Marker, value: number, unit: string): number | null {
  const u = normUnit(unit)
  if (!u || u === normUnit(m.unit)) return value
  if (m.key === 'hba1c' && u === '%') return Math.round((value - 2.15) * 10.929 * 10) / 10
  const f = m.convert?.[u]
  return f === undefined ? null : Math.round(value * f * 1000) / 1000
}

export type Flag = 'low' | 'normal' | 'high' | 'critical'

export function flagFor(
  m: Marker | null,
  value: number,
  refLow?: number | null,
  refHigh?: number | null,
): Flag | null {
  if (
    m &&
    ((m.criticalLow !== undefined && value < m.criticalLow) ||
      (m.criticalHigh !== undefined && value > m.criticalHigh))
  )
    return 'critical'
  const lo = refLow ?? m?.low
  const hi = refHigh ?? m?.high
  if (lo === undefined && hi === undefined) return null
  if (lo !== undefined && lo !== null && value < lo) return 'low'
  if (hi !== undefined && hi !== null && value > hi) return 'high'
  return 'normal'
}

export interface LabCandidate {
  name: string
  marker: string | null
  value: number
  unit: string
  ref_low: number | null
  ref_high: number | null
  ref_text: string | null
  flag: Flag | null
  /** true when the unit could not be converted — the user must check it */
  needsReview: boolean
}

/** Map a raw extracted row onto the catalogue: canonical unit + flag. */
export function normalizeRow(row: {
  name: string
  value: number
  unit?: string | null
  ref_low?: number | null
  ref_high?: number | null
  ref_text?: string | null
}): LabCandidate {
  const m = matchMarker(row.name)
  const unit = row.unit ?? ''
  let value = row.value
  let refLow = row.ref_low ?? null
  let refHigh = row.ref_high ?? null
  let outUnit = unit
  let needsReview = !m
  if (m) {
    const v = toCanonical(m, value, unit)
    if (v === null) needsReview = true
    else {
      if (v !== value) {
        // the lab's range is in the lab's unit — convert it too
        refLow = refLow === null ? null : toCanonical(m, refLow, unit)
        refHigh = refHigh === null ? null : toCanonical(m, refHigh, unit)
      }
      value = v
      outUnit = m.unit
    }
  }
  return {
    name: m ? m.cs : row.name,
    marker: m?.key ?? null,
    value,
    unit: outUnit,
    ref_low: refLow,
    ref_high: refHigh,
    ref_text: row.ref_text ?? null,
    flag: needsReview ? null : flagFor(m, value, refLow, refHigh),
    needsReview,
  }
}
