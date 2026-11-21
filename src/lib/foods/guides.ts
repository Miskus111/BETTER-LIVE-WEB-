import type { Food } from '@/data/types'
import { BODY_GUIDE_BY_SLUG, type BodyGuide } from '@/data/body-guides'
import { onePerFood, rankable } from '@/lib/nutrition'

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

/** What a guide's reader should eat more of, measured per usual portion (real amounts, not per 100 g). */
const PICKS: Record<
  string,
  { title: string; unit: string; value: (f: Food) => number; only?: (f: Food) => boolean }
> = {
  'traveni-a-zacpa': { title: 'Nejvíc vlákniny v běžné porci', unit: 'g', value: (f) => f.macros.fiber },
  'streva-a-mikrobiom': {
    title: 'Vláknina pro střevní bakterie — nejvíc v běžné porci',
    unit: 'g',
    value: (f) => f.macros.fiber,
  },
  tuky: { title: 'Nejvíc omega-3 EPA + DHA v běžné porci', unit: 'mg', value: (f) => f.micros.omega3 ?? 0 },
  bilkoviny: { title: 'Nejvíc bílkovin v běžné porci', unit: 'g', value: (f) => f.macros.protein },
  'svaly-a-metabolismus': {
    title: 'Nejvíc bílkovin v běžné porci',
    unit: 'g',
    value: (f) => f.macros.protein,
  },
  'rostlinna-strava': {
    title: 'Rostlinné potraviny s nejvíc bílkovinami v porci',
    unit: 'g',
    value: (f) => f.macros.protein,
    only: (f) => f.diet.vegan,
  },
  kosti: { title: 'Nejvíc vápníku v běžné porci', unit: 'mg', value: (f) => f.micros.calcium ?? 0 },
  // only where the guide itself names the nutrient
  unava: {
    title: 'Nejvíc železa v běžné porci (chudokrevnost z nedostatku železa je častá příčina únavy)',
    unit: 'mg',
    value: (f) => f.micros.iron ?? 0,
  },
  'menstruacni-cyklus': {
    title: 'Nejvíc železa v běžné porci',
    unit: 'mg',
    value: (f) => f.micros.iron ?? 0,
  },
  'srdce-a-tlak': {
    title: 'Nejvíc draslíku v běžné porci',
    unit: 'mg',
    value: (f) => f.micros.potassium ?? 0,
  },
  cholesterol: { title: 'Nejvíc vlákniny v běžné porci', unit: 'g', value: (f) => f.macros.fiber },
  'priprava-na-tehotenstvi': {
    title:
      'Nejvíc folátu v běžné porci — kyselinu listovou před početím ale doporučují v doplňku (400 µg), jídlo ji nenahradí',
    unit: 'µg',
    value: (f) => f.micros.folate ?? 0,
    // liver: too much vitamin A (retinol) in pregnancy
    only: (f) => !/liver|játr/i.test(`${f.id} ${f.name}`),
  },
}

export interface GuideFoodPicks {
  title: string
  unit: string
  items: { food: Food; amount: number }[]
}

/** Top foods for a guide's topic (recommendable foods, one preparation each), or null for other guides. */
export function foodPicksForGuide(slug: string, foods: Food[], k = 6): GuideFoodPicks | null {
  const p = PICKS[slug]
  if (!p) return null
  const ranked = foods
    // calculated dishes (a 470 g plate of svíčková) aren't a sensible tip for one nutrient
    .filter((f) => rankable(f, 'portion') && !f.recipe && (!p.only || p.only(f)) && p.value(f) > 0)
    .map((food) => ({ food, amount: (p.value(food) * food.portion.grams) / 100 }))
    .sort((a, b) => b.amount - a.amount)
  // only real sources (at least a quarter of the best portion), at most two per category so a fibre list
  // isn't six kinds of beans; free places are refilled from the remaining real sources
  const strong = onePerFood(ranked).filter((x, _, all) => x.amount >= all[0].amount * 0.25)
  const perCategory = new Map<string, number>()
  const varied = strong.filter(({ food }) => {
    const n = perCategory.get(food.category) ?? 0
    perCategory.set(food.category, n + 1)
    return n < 2
  })
  const items = [...varied, ...strong.filter((x) => !varied.includes(x))]
    .slice(0, k)
    .sort((a, b) => b.amount - a.amount)
  return { title: p.title, unit: p.unit, items }
}
