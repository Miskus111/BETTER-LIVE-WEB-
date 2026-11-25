import type { Food } from '@/data/types'

/**
 * Page title of a food. Search results cut titles at about 60–70 characters (" · BLWB" is added after it), so the
 * approximation note stays on the page and long names get the shorter "na 100 g".
 */
export function foodTitle(food: Pick<Food, 'name'>): string {
  const name = food.name.replace(/\s*\(blízká obdoba\)/, '')
  return name.length > 32 ? `${name} — na 100 g` : `${name} — nutriční hodnoty na 100 g`
}
