import type { Food } from '@/data/types'
import { TOPIC_LINKS, WHERE_TO_BUY, type ShopLink } from '@/data/retailers'

const OILY_FISH = new Set([
  'salmon',
  'salmon-cooked',
  'salmon-wild',
  'salmon-smoked',
  'salmon-canned',
  'sardines',
])
const OATS = new Set(['oats', 'oats-cooked', 'oat-bran'])
const SEEDS = new Set(['flaxseed', 'chia', 'linseed-oil'])

/** Store products that sell this food itself (never supplements chosen by nutrient). */
export function shopLinksForFood(food: Food): ShopLink[] {
  const food_ = (links: ShopLink[] | undefined) => (links ?? []).filter((l) => l.kind === 'potravina')
  if (OILY_FISH.has(food.id)) return food_(TOPIC_LINKS.fish)
  if (OATS.has(food.id)) return food_(WHERE_TO_BUY.fiber)
  if (SEEDS.has(food.id)) return food_(WHERE_TO_BUY.ala)
  if (food.category === 'Ořechy a semínka' && !food.allergens.includes('peanuts'))
    return food_(WHERE_TO_BUY.vitE)
  return []
}
