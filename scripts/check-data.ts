/**
 * Data validation: `npm run check:data`.
 * Fails (exit 1) on certification, referential-integrity and scientific-wording violations.
 * Pass --verbose to print the computed organ ↔ food ↔ product relationships.
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { FOODS } from '../src/data/foods'
import { NUTRIENTS } from '../src/data/nutrients'
import { ORGANS } from '../src/data/organs'
import { ABSORPTION } from '../src/data/absorption'
import { REFERENCE } from '../src/data/reference'
import { WHERE_TO_BUY } from '../src/data/retailers'
import { SUPPLEMENT_NUTRIENTS } from '../src/data/supplements'
import { thresholdOf } from '../src/lib/nutrition'
import { foodsForOrgan } from '../src/lib/food-rankings'

const errors: string[] = []
const warn: string[] = []
const fail = (m: string) => errors.push(m)

// Words that must never appear in claim-bearing copy. Negated "what research does NOT show" lists are exempt.
const BANNED =
  /(?<!\p{L})(cure[sd]?|curing|detox\p{L}*|heal(s|ing|ed)?|repair(s|ing|ed)?|cleans(e|es|ing)|boost\p{L}*|miracle|superfood|vyléč\p{L}*|léčí|detoxik\p{L}*|očist\p{L}*|zázra\p{L}*|superpotravin\p{L}*)(?!\p{L})/iu
const checkCopy = (where: string, text: string | undefined) => {
  if (text && BANNED.test(text))
    fail(`${where}: banned claim wording "${text.match(BANNED)![0]}" in: ${text}`)
}

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
  // 0 kcal is a real value (salt, water, black coffee); missing energy is caught by foods:validate
  if (!(f.kcal >= 0)) fail(`food ${f.id}: missing kcal`)
  const { protein, fat, carbs, fiber } = f.macros
  if ([protein, fat, carbs, fiber].some((x) => typeof x !== 'number' || x < 0))
    fail(`food ${f.id}: invalid macros`)
  if (protein + fat + carbs > 101) fail(`food ${f.id}: macros exceed 100 g`)
  for (const k of Object.keys(f.micros)) if (!(k in NUTRIENTS)) fail(`food ${f.id}: unknown nutrient ${k}`)
  if (!existsSync(join(publicDir, f.image))) fail(`food ${f.id}: image missing at public${f.image}`)
  checkCopy(`food ${f.id} note`, f.note)
  if (f.category === 'Fermentované' && f.liveCultures === undefined)
    warn.push(`food ${f.id}: fermented but liveCultures unset`)
}

// ── Reference values, absorption and recommendations ──
for (const id of SUPPLEMENT_NUTRIENTS) {
  if (!NUTRIENTS[id]) fail(`supplements: unknown nutrient ${id}`)
  if (!ABSORPTION[id]) fail(`supplements: ${id} has no absorption data`)
  if (!NUTRIENTS[id].qualitative && !REFERENCE[id]?.efsa)
    fail(`supplements: ${id} has no EFSA reference value`)
}
for (const [id, a] of Object.entries(ABSORPTION)) {
  if (!a.forms.length) fail(`absorption ${id}: no forms`)
  if (!a.sources.length) fail(`absorption ${id}: no sources`)
  ;[a.when, ...a.tips, ...a.forms.map((f) => f.note)].forEach((t) => checkCopy(`absorption ${id}`, t))
}
for (const [id, links] of Object.entries(WHERE_TO_BUY)) {
  if (!(id in NUTRIENTS)) fail(`retailers: unknown nutrient ${id}`)
  for (const l of links ?? []) {
    if (!/^https:\/\//.test(l.url)) fail(`retailers ${id}: link must be https (${l.url})`)
    if (l.why) checkCopy(`retailers ${id}`, l.why)
  }
}

if (process.argv.includes('--verbose')) {
  for (const o of ORGANS)
    console.log(
      `${o.id.padEnd(11)} foods: ${foodsForOrgan(o)
        .map((x) => x.food.id)
        .join(', ')}`,
    )
}

warn.forEach((w) => console.warn(`warn  ${w}`))
if (errors.length) {
  errors.forEach((e) => console.error(`error ${e}`))
  console.error(`\n✗ check:data failed with ${errors.length} error(s)`)
  process.exit(1)
}
console.log(
  `✓ check:data passed — ${ORGANS.length} organs, ${Object.keys(NUTRIENTS).length} nutrients, ${FOODS.length} foods, ${Object.keys(ABSORPTION).length} absorption profiles`,
)
