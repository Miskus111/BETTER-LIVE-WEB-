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

/** Czech URL slugs for the per-nutrient guide pages (/doplnky/[slug]). */
export const SUPPLEMENT_SLUGS: Partial<Record<NutrientId, string>> = {
  vitD: 'vitamin-d',
  omega3: 'omega-3',
  b12: 'vitamin-b12',
  magnesium: 'horcik',
  iron: 'zelezo',
  zinc: 'zinek',
  iodine: 'jod',
  folate: 'folat',
  calcium: 'vapnik',
  protein: 'bilkoviny',
  fiber: 'vlaknina',
  cultures: 'probiotika',
  vitC: 'vitamin-c',
  vitK: 'vitamin-k',
  vitE: 'vitamin-e',
  vitA: 'vitamin-a',
}

export const nutrientBySlug = (slug: string): NutrientId | undefined =>
  (Object.entries(SUPPLEMENT_SLUGS) as [NutrientId, string][]).find(([, s]) => s === slug)?.[0]

/** Link to a nutrient's guide page; falls back to the anchor on the overview page. */
export const supplementHref = (id: NutrientId) =>
  SUPPLEMENT_SLUGS[id] ? `/doplnky/${SUPPLEMENT_SLUGS[id]}` : `/doplnky#${id}`
