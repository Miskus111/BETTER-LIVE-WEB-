import type { NutrientId } from './types'

/**
 * Pořadí živin na stránce /doplnky — od nejčastěji smysluplných doplňků (vitamín D, omega-3, B12)
 * po ty, kde většinou stačí strava.
 */
export const SUPPLEMENT_NUTRIENTS: NutrientId[] = [
  'vitD',
  'omega3',
  'b12',
  'magnesium',
  'iron',
  'zinc',
  'iodine',
  'folate',
  'calcium',
  'protein',
  'fiber',
  'cultures',
  'vitC',
  'vitK',
  'vitE',
  'vitA',
]
