import type { NutrientId } from '@/data/types'
import type { Panel } from './panel'
import type { GeneratedFood } from './types'
import { STATE_CS, methodCs } from './categories'

/**
 * Compact, client-safe record of a food: what lists, search, the diary and the organ panels need.
 * The full 50-nutrient panel stays on the server (src/data/food-details.ts).
 */
export interface LiteFood {
  id: string
  name: string
  nameEn: string
  category: string
  subcategory: string | null
  state: string
  /** Czech description of the 100 g basis, e.g. "tepelně upravené · pečené" */
  basis: string
  kcal: number | null
  /** g per 100 g; null = no data */
  protein: number | null
  fat: number | null
  /** total carbohydrate (incl. fibre) */
  carbs: number | null
  fiber: number | null
  micros: Partial<Record<NutrientId, number>>
  sodiumMg: number | null
  portion: { label: string; grams: number }
  allergens: string[]
  vegan: boolean
  vegetarian: boolean
  glutenFree: boolean
  completeProtein: boolean
  liquid: boolean
  liveCultures: boolean
  recipe: boolean
  /** short provenance line */
  source: string
}

/** Panel → nutrient ids used by organs, nutrient pages and the diary (NRV-based). */
export function microsFromPanel(p: Panel): Partial<Record<NutrientId, number>> {
  const map: [NutrientId, number | null][] = [
    ['vitA', p.vitA],
    ['vitC', p.vitC],
    ['vitD', p.vitD],
    ['vitE', p.vitE],
    ['vitK', p.vitK],
    ['b1', p.b1],
    ['b6', p.b6],
    ['b12', p.b12],
    ['folate', p.folate],
    ['choline', p.choline],
    ['calcium', p.calcium],
    ['phosphorus', p.phosphorus],
    ['magnesium', p.magnesium],
    ['potassium', p.potassium],
    ['iron', p.iron],
    ['zinc', p.zinc],
    ['iodine', p.iodine],
    // EPA + DHA in mg; known if the dataset reports at least one of them
    ['omega3', p.epa === null && p.dha === null ? null : Math.round(((p.epa ?? 0) + (p.dha ?? 0)) * 1000)],
    ['ala', p.ala],
    ['lutein', p.lutein],
    ['water', p.water],
  ]
  return Object.fromEntries(map.filter(([, v]) => v !== null && v > 0)) as Partial<Record<NutrientId, number>>
}

export function toLite(g: GeneratedFood): LiteFood {
  const state = STATE_CS[g.state] ?? g.state
  const method = g.state === 'cooked' ? methodCs(g.provenance.sourceDescription) : null
  const p = g.nutrients
  return {
    id: g.id,
    name: g.nameCs,
    nameEn: g.nameEn,
    category: g.category,
    subcategory: g.subcategory,
    state: g.state,
    basis: method ? `${state} · ${method}` : state,
    kcal: p.kcal,
    protein: p.protein,
    fat: p.fat,
    carbs: p.carbsTotal,
    fiber: p.fiber,
    micros: microsFromPanel(p),
    sodiumMg: p.sodium,
    portion: { label: g.portions[0].label, grams: g.portions[0].grams },
    allergens: g.allergens,
    vegan: g.diet.vegan,
    vegetarian: g.diet.vegetarian,
    glutenFree: g.diet.glutenFree,
    completeProtein: g.completeProtein,
    liquid: g.liquid,
    liveCultures: !!g.liveCultures,
    recipe: !!g.recipe,
    source:
      g.provenance.source === 'USDA FoodData Central'
        ? `USDA FoodData Central, FDC ${g.provenance.sourceId}, ${g.provenance.sourceVersion}`
        : 'Vypočtený recept ze surovin USDA FoodData Central',
  }
}
