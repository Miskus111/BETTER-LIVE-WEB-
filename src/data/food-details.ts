import 'server-only'
import type { FoodsFile, GeneratedFood } from '@/lib/foods/types'
import full from './foods.generated.json'

/** Full nutrient panels, portions and provenance (server only — ~660 kB of data). */
const file = full as unknown as FoodsFile

export const FOOD_DETAILS = Object.fromEntries(file.foods.map((f) => [f.id, f])) as Record<
  string,
  GeneratedFood
>
export const FOOD_DATASETS = file.datasets
