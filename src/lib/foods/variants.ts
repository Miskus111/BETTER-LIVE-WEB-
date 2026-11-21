import type { Food } from '@/data/types'

/** Name without the preparation part: "Kuřecí prsa, pečená" → "kuřecí prsa", "Mražený špenát, uvařený" → "špenát". */
export function baseName(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/\s*\([^)]*\)/g, '')
      // a leading preparation word ("Mražený špenát, uvařený"), but not "sušené" — dried fruit is another food
      .replace(/^(mražen|vařen|pečen)\p{L}*\s+/u, '')
      .replace(
        /,?\s+(vařen\p{L}*|pečen\p{L}*|dušen\p{L}*|smažen\p{L}*|grilovan\p{L}*|uvařen\p{L}*|natvrdo|na pánvi.*|mražen\p{L}*|v konzervě|z konzervy|suš\p{L}*)(\s.*)?$/u,
        '',
      )
      .replace(/,.*$/, '')
      .trim()
  )
}

/** Other preparations of the same food (raw / cooked / canned …) in the same category. */
export function variantsOf(food: Food, all: Food[]): Food[] {
  const b = baseName(food.name)
  return all.filter((f) => f.id !== food.id && f.category === food.category && baseName(f.name) === b)
}

const BEFORE = new Set(['raw', 'dry'])
const AFTER = new Set(['cooked', 'baked', 'roasted'])

/** The uncooked and cooked forms of this food (either may be `food` itself), or null if there is no pair. */
export function rawCookedPair(food: Food, all: Food[]): { before: Food; after: Food } | null {
  const group = [food, ...variantsOf(food, all)]
  const before = BEFORE.has(food.state) ? food : group.find((f) => BEFORE.has(f.state))
  const after = AFTER.has(food.state) ? food : group.find((f) => AFTER.has(f.state))
  return before && after && before !== after ? { before, after } : null
}
