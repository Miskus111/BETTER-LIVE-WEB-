import { FOODS } from '@/data/foods'
import { NUTRIENTS } from '@/data/nutrients'
import { ORGANS } from '@/data/organs'
import type { Food, NutrientId, Organ } from '@/data/types'

/** Amount of a nutrient per 100 g, or undefined if the food does not supply / we do not track it. */
export function amountOf(
  food: Pick<Food, 'macros' | 'micros' | 'completeProtein' | 'liveCultures'>,
  id: NutrientId,
) {
  if (id === 'protein') return food.macros.protein || undefined
  if (id === 'fiber') return food.macros.fiber || undefined
  if (id === 'eaa') return food.completeProtein && food.macros.protein >= 10 ? food.macros.protein : undefined
  if (id === 'cultures') return food.liveCultures ? 1 : undefined
  return food.micros[id]
}

/**
 * "Source of" threshold: explicit rule, else 15 % of the reference value per 100 g — or 7.5 % per
 * 100 ml for drinks (Reg. (EU) 1169/2011, Annex XIII; used by Reg. 1924/2006 for 'source of').
 */
export function thresholdOf(id: NutrientId, liquid = false): number | undefined {
  const n = NUTRIENTS[id]
  if (n.threshold) return n.threshold.value
  if (n.ref) return +(n.ref.value * (liquid ? 0.075 : 0.15)).toPrecision(6)
  return undefined
}

export function thresholdBasis(id: NutrientId): string {
  const n = NUTRIENTS[id]
  if (n.qualitative) return n.qualitative.rule
  if (n.threshold) return n.threshold.basis
  if (n.ref) return `15 % ${n.ref.kind} (${n.ref.value} ${n.unit}) na 100 g — úroveň „zdroj“ podle EU.`
  return 'Neřadí se.'
}

export function isSource(food: Food, id: NutrientId): boolean {
  const v = amountOf(food, id)
  if (v === undefined) return false
  const n = NUTRIENTS[id]
  if (n.qualitative) return id !== 'water'
  const t = thresholdOf(id, food.liquid)
  return t !== undefined && v >= t
}

/** Percentage of the daily reference value (rounded), if a reference exists. */
export function pctRef(id: NutrientId, v: number): number | undefined {
  const r = NUTRIENTS[id].ref
  return r ? Math.round((v / r.value) * 100) : undefined
}

export function fmtAmount(v: number, unit: string) {
  // české formátování: mezera jako oddělovač tisíců, desetinná čárka
  const digits = v >= 100 ? 0 : v >= 10 ? 1 : 2
  const s = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: digits }).format(v)
  return `${s}\u00a0${unit}`
}

/** Share of energy from protein / fat / carbs (Atwater 4/9/4, fibre at 2 kcal/g counted under carbs). */
export function energySplit(m: { protein: number; fat: number; carbs: number; fiber: number }) {
  const p = m.protein * 4
  const f = m.fat * 9
  const c = Math.max(0, m.carbs - m.fiber) * 4 + m.fiber * 2
  const total = p + f + c || 1
  return { protein: p / total, fat: f / total, carbs: c / total }
}

// ── Relationships ───────────────────────────────────────────────────────────

export interface OrganLink {
  organ: Organ
  via: NutrientId[]
}

/** Nutrients that link foods to an organ: those the organ depends on ("supports") — not ones it merely handles. */
const linking = (organ: Organ) => organ.nutrients.filter((n) => (n.relation ?? 'supports') === 'supports')

/**
 * Nutrients through which a food is relevant to an organ. A food qualifies only if 100 g reaches the
 * "source of" threshold, and at least one match is established or plausible (preliminary-only links are dropped).
 */
export function linkVia(food: Food, organ: Organ): NutrientId[] {
  const matches = linking(organ).filter((n) => isSource(food, n.id))
  return matches.some((n) => n.level !== 'preliminary') ? matches.map((n) => n.id) : []
}

export type Basis = '100g' | 'portion'
/** amount in the chosen basis: per 100 g, or per the food's default household portion */
const scaled = (food: Food, v: number, per: Basis) => (per === 'portion' ? (v * food.portion.grams) / 100 : v)

/**
 * Ranking score: how much of the organ's nutrient list a food covers, weighted by evidence and % reference.
 * Eligibility always uses the EU per-100 g "source of" rule; `per` only changes the ranking amount.
 */
export function organScore(food: Food, organ: Organ, per: Basis = '100g') {
  return linking(organ).reduce((s, n) => {
    if (!isSource(food, n.id)) return s
    const v = scaled(food, amountOf(food, n.id)!, per)
    const pct = pctRef(n.id, v)
    const weight = n.level === 'established' ? 1 : n.level === 'plausible' ? 0.6 : 0.3
    return s + weight * (1 + Math.min(pct ?? 30, 200) / 100)
  }, 0)
}

/** Organs for which this food is a notable source of at least one supporting nutrient, best match first. */
export function organsForFood(food: Food): OrganLink[] {
  return ORGANS.map((organ) => ({ organ, via: linkVia(food, organ) }))
    .filter((x) => x.via.length > 0)
    .sort((a, b) => organScore(food, b.organ) - organScore(food, a.organ))
}

export function foodsForOrgan(
  organ: Organ,
  k = 12,
  per: Basis = '100g',
): { food: Food; via: NutrientId[] }[] {
  return FOODS.map((food) => ({ food, via: linkVia(food, organ) }))
    .filter((x) => x.via.length > 0)
    .sort((a, b) => organScore(b.food, organ, per) - organScore(a.food, organ, per))
    .slice(0, k)
}

/** Best sources of a nutrient; `v` is per 100 g or per the default portion depending on `per`. */
export function topFoodsFor(id: NutrientId, k = 5, per: Basis = '100g'): { food: Food; v: number }[] {
  const qualitative = !!NUTRIENTS[id].qualitative
  return FOODS.filter((f) => isSource(f, id))
    .map((food) => ({ food, v: scaled(food, amountOf(food, id)!, per) }))
    .sort((a, b) => (qualitative ? 0 : b.v - a.v))
    .slice(0, k)
}

export function organsForNutrient(id: NutrientId): Organ[] {
  return ORGANS.filter((o) => o.nutrients.some((n) => n.id === id))
}
