import type { Panel } from './panel'

export type FoodState =
  | 'raw'
  | 'cooked'
  | 'dried'
  | 'dry'
  | 'canned'
  | 'fermented'
  | 'frozen'
  | 'pickled'
  | 'cured'
  | 'roasted'
  | 'baked'
  | 'brewed'
  | 'processed'
  | 'recipe'

export interface Portion {
  label: string
  grams: number
  /** FDC = gram weight from FoodData Central portion data; household = typical household amount */
  source: 'FDC' | 'household' | 'recipe'
}

export interface Provenance {
  source: 'USDA FoodData Central' | 'Calculated recipe' | 'Open Food Facts' | 'Manual'
  /** FDC id (or recipe key / EAN) */
  sourceId: string
  /** dataset and release, e.g. "SR Legacy 2018-04" */
  sourceVersion: string
  /** the exact description of the matched record */
  sourceDescription: string
  retrievedAt: string
  licence: string
  verified: boolean
  notes: string[]
}

/** One food in src/data/foods.generated.json (values per 100 g edible portion). */
export interface GeneratedFood {
  id: string
  nameCs: string
  nameEn: string
  synonyms: string[]
  category: string
  subcategory: string | null
  state: FoodState
  nutrients: Panel
  portions: Portion[]
  allergens: string[]
  diet: { vegan: boolean; vegetarian: boolean; glutenFree: boolean }
  completeProtein: boolean
  liquid: boolean
  liveCultures: string | null
  /** FDC calorie conversion factors for this food (kcal/g), used to check the reported energy */
  energyFactors: { protein: number; fat: number; carbs: number } | null
  recipe: { ingredients: { id: string; grams: number }[]; note: string } | null
  provenance: Provenance
}

export interface FoodsFile {
  generated: true
  generatedAt: string
  datasets: Record<string, string>
  foods: GeneratedFood[]
}
