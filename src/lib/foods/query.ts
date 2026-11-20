import { NUTRIENTS } from '@/data/nutrients'
import type { Food, NutrientId } from '@/data/types'
import { norm } from '@/lib/guide-search'
import { amountOf, isSource, rankable } from '@/lib/nutrition'

/** Sortable measures: energy, macros and every nutrient with an amount per 100 g. */
export type Measure = 'kcal' | 'protein' | 'fat' | 'carbs' | 'fiber' | NutrientId

export const MEASURES: { id: Measure; label: string; unit: string }[] = [
  { id: 'kcal', label: 'Energie', unit: 'kcal' },
  { id: 'protein', label: 'Bílkoviny', unit: 'g' },
  { id: 'fat', label: 'Tuky', unit: 'g' },
  { id: 'carbs', label: 'Sacharidy', unit: 'g' },
  { id: 'fiber', label: 'Vláknina', unit: 'g' },
  ...(Object.values(NUTRIENTS)
    .filter((n) => !n.qualitative && !['protein', 'fiber'].includes(n.id))
    .map((n) => ({ id: n.id, label: n.name, unit: n.unit })) as {
    id: Measure
    label: string
    unit: string
  }[]),
]

/** Value per 100 g, or undefined when the dataset has no value ("no data"). */
export function measureOf(food: Food, m: Measure): number | undefined {
  if (m === 'kcal') return food.kcal
  if (m === 'fat') return food.macros.fat
  if (m === 'carbs') return food.macros.carbs
  return amountOf(food, m)
}

export const perPortion = (food: Food, v: number) => (v * food.portion.grams) / 100

export const ALLERGEN_CS: Record<string, string> = {
  gluten: 'lepek',
  crustaceans: 'korýši',
  eggs: 'vejce',
  fish: 'ryby',
  peanuts: 'arašídy',
  soy: 'sója',
  milk: 'mléko',
  nuts: 'skořápkové plody',
  celery: 'celer',
  mustard: 'hořčice',
  sesame: 'sezam',
  sulphites: 'oxid siřičitý a siřičitany',
  lupin: 'vlčí bob',
  molluscs: 'měkkýši',
}

export interface FoodQuery {
  q: string
  category: string
  state: string
  diet: '' | 'vegan' | 'vegetarian' | 'glutenFree'
  without: string
  highIn: '' | NutrientId
  sort: '' | Measure
  per: '100g' | 'portion'
}

export const EMPTY_QUERY: FoodQuery = {
  q: '',
  category: '',
  state: '',
  diet: '',
  without: '',
  highIn: '',
  sort: '',
  per: '100g',
}

/** Diacritics-insensitive search over Czech + English names, category and basis. */
export function matchesText(food: Food, q: string) {
  const words = norm(q).split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const hay = norm(`${food.name} ${food.nameEn} ${food.category} ${food.subcategory ?? ''} ${food.basis}`)
  return words.every((w) => hay.includes(w))
}

export function queryFoods(foods: Food[], q: FoodQuery): Food[] {
  const out = foods.filter(
    (f) =>
      matchesText(f, q.q) &&
      (!q.category || f.category === q.category) &&
      (!q.state || f.state === q.state) &&
      (!q.diet || f.diet[q.diet]) &&
      (!q.without || !f.allergens.includes(q.without)) &&
      (!q.highIn || isSource(f, q.highIn)),
  )
  // default order: curated everyday foods first, then the dataset order (by category)
  if (!q.sort) return [...out].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  const sort = q.sort
  const val = (f: Food) => {
    const v = measureOf(f, sort)
    if (v === undefined) return -1 // "no data" sorts last
    return q.per === 'portion' ? perPortion(f, v) : v
  }
  // per 100 g, foods eaten by the pinch (spices, dried herbs) go after real foods, still visible
  const last = (f: Food) => Number(!rankable(f, q.per === 'portion' ? 'portion' : '100g'))
  return [...out].sort((a, b) => last(a) - last(b) || val(b) - val(a))
}

/** "porce 125 g" already states the weight; "1 vejce L" needs it added. */
export const portionText = (p: { label: string; grams: number }) =>
  /\d\s*(g|ml|l)(?!\p{L})/u.test(p.label) ? p.label : `${p.label} (${p.grams.toLocaleString('cs-CZ')} g)`
