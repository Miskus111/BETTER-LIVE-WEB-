import data from './food-picks.generated.json'
import type { Food, NutrientId, OrganId } from './types'
import type { Basis } from '@/lib/nutrition'

/** The slice of a food that browser components need for ranked lists. */
export type FoodRef = Pick<Food, 'id' | 'name' | 'image' | 'portion'>

type Picks = {
  organs: Record<string, Record<Basis, { food: FoodRef; via: NutrientId[] }[]>>
  nutrients: Record<string, Record<Basis, { food: FoodRef; v: number }[]>>
}
const PICKS = data as unknown as Picks

/** Best foods for an organ (same order as foodsForOrgan), without shipping the whole food list. */
export const organFoods = (id: OrganId, per: Basis = '100g') => PICKS.organs[id]?.[per] ?? []

/** Best sources of a nutrient (same order as topFoodsFor, at most 6). */
export const nutrientFoods = (id: NutrientId, per: Basis = '100g', k = 6) =>
  (PICKS.nutrients[id]?.[per] ?? []).slice(0, k)
