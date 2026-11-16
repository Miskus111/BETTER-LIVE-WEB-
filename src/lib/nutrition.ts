import { FOOD_BY_ID, FOODS } from '@/data/foods'
import { NUTRIENTS } from '@/data/nutrients'
import { ORGANS } from '@/data/organs'
import { PRODUCTS } from '@/data/products'
import type { Food, NutrientId, Organ, OrganId, Product, ProductNutrition } from '@/data/types'

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

/** "Source of" threshold per 100 g: explicit rule, else 15 % of the reference value. */
export function thresholdOf(id: NutrientId): number | undefined {
  const n = NUTRIENTS[id]
  if (n.threshold) return n.threshold.value
  if (n.ref) return +(n.ref.value * 0.15).toPrecision(6)
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
  const t = thresholdOf(id)
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

/** Ranking score: how much of the organ's nutrient list a food covers, weighted by evidence and % reference. */
export function organScore(food: Food, organ: Organ) {
  return linking(organ).reduce((s, n) => {
    if (!isSource(food, n.id)) return s
    const v = amountOf(food, n.id)!
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

export function foodsForOrgan(organ: Organ, k = 12): { food: Food; via: NutrientId[] }[] {
  return FOODS.map((food) => ({ food, via: linkVia(food, organ) }))
    .filter((x) => x.via.length > 0)
    .sort((a, b) => organScore(b.food, organ) - organScore(a.food, organ))
    .slice(0, k)
}

export function topFoodsFor(id: NutrientId, k = 5): { food: Food; v: number }[] {
  const qualitative = !!NUTRIENTS[id].qualitative
  return FOODS.filter((f) => isSource(f, id))
    .map((food) => ({ food, v: amountOf(food, id)! }))
    .sort((a, b) => (qualitative ? 0 : b.v - a.v))
    .slice(0, k)
}

export function organsForNutrient(id: NutrientId): Organ[] {
  return ORGANS.filter((o) => o.nutrients.some((n) => n.id === id))
}

// ── Products ────────────────────────────────────────────────────────────────

/** Per-100 g nutrition of a product: reference food, weighted blend, or manual values. */
export function productNutrition(p: Product): ProductNutrition | undefined {
  if (p.nutrition) return p.nutrition
  if (p.food) {
    const f = FOOD_BY_ID[p.food]
    return {
      kcal: f.kcal,
      ...f.macros,
      micros: f.micros,
      basis: `Referenční potravina USDA: ${f.name}, ${f.basis}`,
    }
  }
  if (p.blend) {
    const out: ProductNutrition = { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, micros: {}, basis: '' }
    for (const { food, share } of p.blend) {
      const f = FOOD_BY_ID[food]
      out.kcal += f.kcal * share
      out.protein += f.macros.protein * share
      out.fat += f.macros.fat * share
      out.carbs += f.macros.carbs * share
      out.fiber += f.macros.fiber * share
      for (const [k, v] of Object.entries(f.micros) as [NutrientId, number][]) {
        out.micros[k] = (out.micros[k] ?? 0) + v * share
      }
    }
    out.kcal = Math.round(out.kcal)
    out.basis = `Vypočteno z receptury: ${p.blend.map((b) => `${Math.round(b.share * 100)} % ${FOOD_BY_ID[b.food].name.toLowerCase()}`).join(', ')} (referenční hodnoty USDA)`
    return out
  }
  return undefined
}

/** Pseudo-food used to run the same "source of" logic on product nutrition. */
function productAsFood(p: Product): Food | undefined {
  if (p.food) return FOOD_BY_ID[p.food]
  const n = productNutrition(p)
  if (!n) return undefined
  return {
    id: p.id,
    name: p.name,
    category: 'Obiloviny a oleje',
    basis: n.basis,
    fdc: n.basis,
    kcal: n.kcal,
    macros: { protein: n.protein, fat: n.fat, carbs: n.carbs, fiber: n.fiber },
    micros: n.micros,
    liveCultures: p.liveCultures,
    image: p.images[0],
    art: p.art,
  }
}

/** Organs a product is relevant to (best match first) — computed from its nutrition, else the manual list. */
export function productOrgans(p: Product): OrganId[] {
  const asFood = productAsFood(p)
  const computed = asFood ? organsForFood(asFood).map((x) => x.organ.id) : []
  return computed.length ? computed : (p.organs ?? [])
}

export function productsForOrgan(id: OrganId): Product[] {
  return PRODUCTS.filter((p) => productOrgans(p).includes(id))
}

export function productsForFood(foodId: string): Product[] {
  return PRODUCTS.filter((p) => p.food === foodId || p.blend?.some((b) => b.food === foodId))
}

export function productFoods(p: Product): Food[] {
  if (p.food) return [FOOD_BY_ID[p.food]]
  return (p.blend ?? []).map((b) => FOOD_BY_ID[b.food])
}

/** Organic badge is shown ONLY for verified EU organic products. */
export const isVerifiedOrganic = (p: Product) =>
  p.certification.status === 'eu-bio' && p.certification.verified === true && !!p.certification.controlBody
