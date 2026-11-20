import type { Food } from '@/data/types'
import { BODY_GUIDE_BY_SLUG, type BodyGuide } from '@/data/body-guides'

/**
 * Body guides that explain something this food is notable for, decided from its composition
 * (per 100 g) — not from loose organ links. Most specific reason first.
 */
const RULES: [slug: string, applies: (f: Food) => boolean][] = [
  ['laktoza-a-lepek', (f) => f.allergens.includes('milk') || f.allergens.includes('gluten')],
  ['streva-a-mikrobiom', (f) => !!f.liveCultures || f.macros.fiber >= 6],
  ['traveni-a-zacpa', (f) => f.macros.fiber >= 6],
  ['tuky', (f) => (f.micros.omega3 ?? 0) >= 250 || f.category === 'Oleje a tuky' || f.macros.fat >= 30],
  ['bilkoviny', (f) => f.macros.protein >= 15],
  ['rostlinna-strava', (f) => f.diet.vegan && f.macros.protein >= 6],
  ['cukr-a-inzulin', (f) => f.category === 'Sladidla a sladkosti'],
  ['pitny-rezim', (f) => f.category === 'Nápoje'],
]

export function guidesForFood(food: Food): BodyGuide[] {
  return RULES.filter(([slug, applies]) => BODY_GUIDE_BY_SLUG[slug] && applies(food)).map(
    ([slug]) => BODY_GUIDE_BY_SLUG[slug],
  )
}
