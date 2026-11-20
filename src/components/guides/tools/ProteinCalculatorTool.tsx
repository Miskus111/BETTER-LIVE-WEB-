import { FOOD_BY_ID } from '@/data/foods'
import { ProteinCalculator } from './ProteinCalculator'
import { PORTIONS } from './protein-portions'

/** Server wrapper: looks up protein per 100 g here, so only eight numbers reach the browser. */
export function ProteinCalculatorTool() {
  const proteinPer100g = Object.fromEntries(
    PORTIONS.map((p) => [p.food, FOOD_BY_ID[p.food]?.macros.protein ?? 0]),
  )
  return <ProteinCalculator proteinPer100g={proteinPer100g} />
}
