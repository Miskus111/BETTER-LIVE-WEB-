import type { Panel, PanelKey } from './panel'

/**
 * EFSA tolerable upper intake levels for adults (total daily intake from all sources), for the
 * nutrients where ordinary foods can get close: preformed vitamin A (retinol — not beta-carotene),
 * vitamin D, vitamin B6, zinc, iodine, selenium. Same values as src/data/reference.ts; selenium from
 * EFSA (2023) Scientific opinion on the tolerable upper intake level of selenium.
 */
export const UPPER_LIMITS: { key: PanelKey; name: string; ul: number; unit: string; note?: string }[] = [
  {
    key: 'retinol',
    name: 'retinolu (hotového vitamínu A)',
    ul: 3000,
    unit: 'µg',
    note: 'V těhotenství se játra a výrobky z nich nedoporučují — poraďte se s lékařem.',
  },
  { key: 'vitD', name: 'vitamínu D', ul: 100, unit: 'µg' },
  { key: 'b6', name: 'vitamínu B6', ul: 12, unit: 'mg' },
  { key: 'zinc', name: 'zinku', ul: 25, unit: 'mg' },
  { key: 'iodine', name: 'jódu', ul: 600, unit: 'µg' },
  { key: 'selenium', name: 'selenu', ul: 255, unit: 'µg' },
]

export interface UpperLimitHit {
  name: string
  amount: number
  unit: string
  ul: number
  pct: number
  note?: string
}

/** Nutrients where one portion reaches at least half of the adult daily upper limit. */
export function upperLimitHits(nutrients: Panel, grams: number): UpperLimitHit[] {
  return UPPER_LIMITS.flatMap(({ key, name, ul, unit, note }) => {
    const per100 = nutrients[key]
    if (per100 === null || per100 === undefined) return []
    const amount = (per100 * grams) / 100
    const pct = Math.round((amount / ul) * 100)
    return pct >= 50 ? [{ name, amount, unit, ul, pct, note }] : []
  })
}
