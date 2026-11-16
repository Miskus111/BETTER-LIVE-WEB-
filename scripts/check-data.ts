/**
 * Data validation: `npm run check:data`.
 * Fails (exit 1) on certification, referential-integrity and scientific-wording violations.
 * Pass --verbose to print the computed organ ↔ food ↔ product relationships.
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { FOOD_BY_ID, FOODS } from '../src/data/foods'
import { NUTRIENTS } from '../src/data/nutrients'
import { ORGANS } from '../src/data/organs'
import { PRODUCTS, SHOP_CATEGORIES } from '../src/data/products'
import type { OrganId } from '../src/data/types'
import { foodsForOrgan, productNutrition, productOrgans, thresholdOf } from '../src/lib/nutrition'

const errors: string[] = []
const warn: string[] = []
const fail = (m: string) => errors.push(m)

// Words that must never appear in claim-bearing copy. Negated "what research does NOT show" lists are exempt.
const BANNED =
  /\b(cure[sd]?|curing|detox\w*|heal(s|ing|ed)?|repair(s|ing|ed)?|cleans(e|es|ing)|boost(s|ing)?|miracle|superfood)\b/i
const checkCopy = (where: string, text: string | undefined) => {
  if (text && BANNED.test(text))
    fail(`${where}: banned claim wording "${text.match(BANNED)![0]}" in: ${text}`)
}

const organIds = new Set<OrganId>(ORGANS.map((o) => o.id))
const publicDir = join(process.cwd(), 'public')

// ── Nutrients ──
for (const n of Object.values(NUTRIENTS)) {
  if (!n.qualitative && thresholdOf(n.id) === undefined)
    fail(`nutrient ${n.id}: no reference value or threshold`)
  n.functions.forEach((f) => checkCopy(`nutrient ${n.id} function`, f))
  checkCopy(`nutrient ${n.id} blurb`, n.blurb)
}

// ── Organs ──
for (const o of ORGANS) {
  ;[o.what, o.how, o.why, o.tagline, ...o.science.points].forEach((t) => checkCopy(`organ ${o.id}`, t))
  if (!o.nutrients.length) fail(`organ ${o.id}: no nutrients`)
  for (const n of o.nutrients) {
    if (!NUTRIENTS[n.id]) fail(`organ ${o.id}: unknown nutrient ${n.id}`)
    if (!['established', 'plausible', 'preliminary'].includes(n.level))
      fail(`organ ${o.id}/${n.id}: no evidence level`)
    checkCopy(`organ ${o.id}/${n.id} role`, n.role)
    // a nutrient without any EU-authorised function cannot be "established" via a claim
    if (n.level === 'established' && NUTRIENTS[n.id].functions.length === 0)
      warn.push(
        `organ ${o.id}/${n.id}: "established" but nutrient has no authorised claim — must be textbook physiology`,
      )
  }
  if (!o.science.sources.length) fail(`organ ${o.id}: no sources`)
  if (!o.science.notShown.length) fail(`organ ${o.id}: missing "what research does NOT show"`)
  if (o.id === 'intestines' && !o.fermentation)
    fail('organ intestines: fermentation explainer must be enabled')
}

// ── Foods ──
const foodIds = new Set<string>()
for (const f of FOODS) {
  if (foodIds.has(f.id)) fail(`food ${f.id}: duplicate id`)
  foodIds.add(f.id)
  if (!(f.kcal > 0) && f.id !== 'water') fail(`food ${f.id}: missing kcal`)
  const { protein, fat, carbs, fiber } = f.macros
  if ([protein, fat, carbs, fiber].some((x) => typeof x !== 'number' || x < 0))
    fail(`food ${f.id}: invalid macros`)
  if (protein + fat + carbs > 101) fail(`food ${f.id}: macros exceed 100 g`)
  for (const k of Object.keys(f.micros)) if (!(k in NUTRIENTS)) fail(`food ${f.id}: unknown nutrient ${k}`)
  if (!existsSync(join(publicDir, f.image))) fail(`food ${f.id}: image missing at public${f.image}`)
  checkCopy(`food ${f.id} note`, f.note)
  if (f.category === 'Fermented' && f.liveCultures === undefined)
    warn.push(`food ${f.id}: fermented but liveCultures unset`)
}

// ── Products ──
const productIds = new Set<string>()
for (const p of PRODUCTS) {
  const where = `product ${p.id}`
  if (productIds.has(p.id)) fail(`${where}: duplicate id`)
  productIds.add(p.id)
  const c = p.certification

  // Organic rules (hard requirement)
  if (c.status === 'eu-bio') {
    if (c.verified !== true) fail(`${where}: claims EU organic but verified !== true`)
    if (!c.controlBody || !/^[A-Z]{2}-(BIO|ÖKO|ECO|ORG|EKO|BIO-\w+)-\d{3}$/.test(c.controlBody))
      fail(`${where}: claims EU organic without a valid control-body code (got "${c.controlBody ?? ''}")`)
  } else {
    if (c.verified) fail(`${where}: non-organic product must not be marked verified organic`)
    if (c.controlBody) fail(`${where}: non-organic product must not show an organic control-body code`)
  }
  if (c.status === 'wild' && p.food && FOOD_BY_ID[p.food]?.category !== 'Fish & seafood')
    fail(`${where}: "wild" status is reserved for wild-caught fish`)
  if (/\bnatural\b/i.test(p.name)) warn.push(`${where}: avoid "natural" in names — say what it is instead`)
  // Organic-ingredient marking: an EU organic product's ingredient list must mark organic ingredients with *
  if (c.status === 'eu-bio' && !p.ingredients.includes('*'))
    fail(`${where}: organic ingredients not marked with *`)
  if (p.pasture === 'verified' && c.status !== 'eu-bio')
    fail(`${where}: pasture claim only allowed on independently verified (EU organic) products`)

  // Integrity
  if (!p.origin || !p.processing) fail(`${where}: origin and processing are required`)
  if (!(p.price > 0)) fail(`${where}: invalid price`)
  for (const cat of p.categories)
    if (!SHOP_CATEGORIES.includes(cat)) fail(`${where}: unknown category ${cat}`)
  if (p.food && !FOOD_BY_ID[p.food]) fail(`${where}: unknown food ${p.food}`)
  if (p.blend) {
    const sum = p.blend.reduce((s, b) => s + b.share, 0)
    if (Math.abs(sum - 1) > 0.001) fail(`${where}: blend shares sum to ${sum}`)
    for (const b of p.blend) if (!FOOD_BY_ID[b.food]) fail(`${where}: unknown blend food ${b.food}`)
  }
  for (const o of p.organs ?? []) if (!organIds.has(o)) fail(`${where}: unknown organ ${o}`)
  if (!productNutrition(p)) fail(`${where}: no nutrition (needs food, blend or manual nutrition)`)
  if (!productOrgans(p).length) fail(`${where}: not linked to any organ`)
  for (const src of p.images)
    if (!existsSync(join(publicDir, src))) fail(`${where}: image missing at public${src}`)
  ;[p.description, p.shortDescription, ...p.highlights].forEach((t) => checkCopy(where, t))
}

if (process.argv.includes('--verbose')) {
  for (const o of ORGANS)
    console.log(
      `${o.id.padEnd(11)} foods: ${foodsForOrgan(o)
        .map((x) => x.food.id)
        .join(', ')}`,
    )
  for (const p of PRODUCTS) console.log(`${p.id.padEnd(15)} organs: ${productOrgans(p).join(', ')}`)
}

warn.forEach((w) => console.warn(`warn  ${w}`))
if (errors.length) {
  errors.forEach((e) => console.error(`error ${e}`))
  console.error(`\n✗ check:data failed with ${errors.length} error(s)`)
  process.exit(1)
}
console.log(
  `✓ check:data passed — ${ORGANS.length} organs, ${Object.keys(NUTRIENTS).length} nutrients, ${FOODS.length} foods, ${PRODUCTS.length} products`,
)
