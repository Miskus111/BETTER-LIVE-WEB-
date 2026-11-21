import { NUTRIENT_LIST } from '@/data/nutrients'
import { ORGANS } from '@/data/organs'
import type { Food } from '@/data/types'
import { foodsForOrgan, topFoodsFor } from '@/lib/food-rankings'
import type { Basis } from '@/lib/nutrition'

/** What the organ panel and nutrient index show of a food — nothing more goes to the browser. */
const slim = (f: Food) => ({ id: f.id, name: f.name, image: f.image, portion: f.portion })

const BASES: Basis[] = ['100g', 'portion']

/**
 * Precomputed rankings for the interactive body and nutrient index (`npm run gen:picks` writes them to
 * src/data/food-picks.generated.json; a unit test fails when the file is stale).
 */
export function buildFoodPicks() {
  return {
    organs: Object.fromEntries(
      ORGANS.map((o) => [
        o.id,
        Object.fromEntries(
          BASES.map((per) => [
            per,
            foodsForOrgan(o, 12, per).map((x) => ({ food: slim(x.food), via: x.via })),
          ]),
        ),
      ]),
    ),
    nutrients: Object.fromEntries(
      NUTRIENT_LIST.map((n) => [
        n.id,
        Object.fromEntries(
          BASES.map((per) => [per, topFoodsFor(n.id, 6, per).map((x) => ({ food: slim(x.food), v: x.v }))]),
        ),
      ]),
    ),
  }
}
