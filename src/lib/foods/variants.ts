import type { Food } from '@/data/types'

/** Name without the preparation part: "Kuřecí prsa, pečená" → "kuřecí prsa", "Brokolice vařená" → "brokolice". */
export function baseName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '')
    .replace(
      /,?\s+(vařen\p{L}*|pečen\p{L}*|dušen\p{L}*|smažen\p{L}*|grilovan\p{L}*|uvařen\p{L}*|natvrdo|na pánvi.*|mražen\p{L}*|v konzervě|z konzervy|suš\p{L}*)(\s.*)?$/u,
      '',
    )
    .replace(/,.*$/, '')
    .trim()
}

/** Other preparations of the same food (raw / cooked / canned …) in the same category. */
export function variantsOf(food: Food, all: Food[]): Food[] {
  const b = baseName(food.name)
  return all.filter((f) => f.id !== food.id && f.category === food.category && baseName(f.name) === b)
}
