/**
 * Food data pipeline: download → parse → map nutrients → convert units → derive → validate → write.
 *
 *   npm run foods:build      # writes src/data/foods.generated.json (prints a diff against the old file)
 *   npm run foods:validate   # validates the committed file
 *
 * The curated list scripts/foods/selection.csv decides which foods get in (one FDC record each).
 * Every number comes from USDA FoodData Central; unknown values stay null. The output is generated:
 * never hand-edit it — curated texts live in src/data/food-notes.ts.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PANEL, type Panel, type PanelKey } from '../../src/lib/foods/panel'
import type { FoodsFile, FoodState, GeneratedFood, Portion } from '../../src/lib/foods/types'
import { folateDfe, iuToUgVitD, kcalToKj, round, saltFromSodiumMg } from '../../src/lib/foods/units'
import { validateFoods } from '../../src/lib/foods/validate'
import { toLite } from '../../src/lib/foods/lite'
import { DATASETS, ensureDataset, loadDataset, type DatasetName, type FdcFood } from './fdc'
import { RECIPES } from './recipes'
import {
  CATEGORIES,
  FDC_SUBCATEGORY,
  LIVE_CULTURES,
  allergensFor,
  dietFor,
  isCompleteProtein,
  isLiquid,
  type Category,
} from './rules'

const ROOT = process.cwd()
const OUT = join(ROOT, 'src/data/foods.generated.json')
const OUT_LITE = join(ROOT, 'src/data/foods.lite.generated.json')
const LICENCE = 'USDA FoodData Central — public domain (CC0 1.0)'
const UNIT_SYNONYMS: Record<string, string[]> = { tbsp: ['tablespoon'], tsp: ['teaspoon'], cup: ['cup'] }
const ZERO_IF_MISSING = new Set(['water', 'salt'])
const log: string[] = []

// ── selection.csv ───────────────────────────────────────────────────────────
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (c === '"') q = false
      else cell += c
    } else if (c === '"') q = true
    else if (c === ',') {
      row.push(cell)
      cell = ''
    } else if (c === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (c !== '\r') cell += c
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  const [head, ...body] = rows
  return body
    .filter((r) => r.some(Boolean))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])))
}

// ── nutrient mapping ────────────────────────────────────────────────────────
function amounts(food: FdcFood) {
  const m = new Map<number, number>()
  for (const n of food.foodNutrients) if (typeof n.amount === 'number') m.set(n.nutrient.id, n.amount)
  return m
}

function panelFrom(food: FdcFood, notes: string[]): Panel {
  const a = amounts(food)
  const out = {} as Panel
  for (const p of PANEL) {
    const id = p.fdc.find((x) => a.has(x))
    out[p.key] = id === undefined ? null : a.get(id)!
  }
  // fallbacks with documented conversions
  if (out.vitD === null && a.has(1110)) {
    out.vitD = iuToUgVitD(a.get(1110)!)
    notes.push('Vitamín D přepočten z IU (1 IU = 0,025 µg).')
  }
  if (out.folate === null && (a.has(1187) || a.has(1186))) {
    out.folate = folateDfe(a.get(1187) ?? 0, a.get(1186) ?? 0)
    notes.push('Folát DFE dopočten: potravinový folát + 1,7 × kyselina listová.')
  }
  if (out.kcal === null) notes.push('Energie v datasetu chybí.')
  if (out.kj === null && out.kcal !== null) {
    out.kj = kcalToKj(out.kcal)
    notes.push('kJ dopočteny z kcal (× 4,184).')
  }
  if (out.carbsTotal !== null) {
    out.carbsAvailable = Math.max(0, out.carbsTotal - (out.fiber ?? 0))
    if (out.fiber === null) notes.push('Vláknina neuvedena — využitelné sacharidy = sacharidy celkem.')
  }
  if (out.sodium !== null) out.salt = saltFromSodiumMg(out.sodium)
  for (const k of Object.keys(out) as PanelKey[]) if (out[k] !== null) out[k] = round(out[k]!)
  return out
}

function energyFactorsOf(food: FdcFood) {
  const c = food.nutrientConversionFactors?.find((x) => x.type === '.CalorieConversionFactor')
  return c && c.proteinValue && c.fatValue && c.carbohydrateValue
    ? { protein: c.proteinValue, fat: c.fatValue, carbs: c.carbohydrateValue }
    : null
}

// ── portions ────────────────────────────────────────────────────────────────
function portionsFor(key: string, spec: string, food: FdcFood | null): Portion[] {
  const out: Portion[] = []
  if (spec) {
    const exact = spec.split('==')
    if (exact.length === 2) {
      out.push({ label: exact[0].trim(), grams: Number(exact[1]), source: 'household' })
    } else {
      const [label, kw] = spec.split('=').map((s) => s.trim())
      const words = [kw.toLowerCase(), ...(UNIT_SYNONYMS[kw.toLowerCase()] ?? [])]
      // "cup, dry, yields" is the cooked yield of a dry cup, not a cup of this food — never use it.
      // (Other "yields" are fine: "ear … yields" is the edible part of one ear.)
      // Prefer the portion whose own name is exactly the keyword ("can" over "can (12.5 oz), drained").
      const name = (p: NonNullable<FdcFood['foodPortions']>[number]) =>
        (p.modifier || p.portionDescription || p.measureUnit?.name || '').toLowerCase().trim()
      const usable = (food?.foodPortions ?? []).filter((p) => !/\bdry\b.*\byields?\b/.test(name(p)))
      const hit =
        usable.find((p) => words.includes(name(p))) ??
        usable.find((p) => {
          const text = `${p.amount ?? ''} ${p.measureUnit?.name ?? ''} ${p.modifier ?? ''} ${p.portionDescription ?? ''}`
          return words.some((w) => text.toLowerCase().includes(w))
        })
      if (hit && hit.gramWeight > 0) {
        const per = hit.gramWeight / (hit.amount && hit.amount > 0 ? hit.amount : 1)
        // "6 ústřic" = six times the FDC weight of one — unless the label already states the weight
        const n = /\(\s*\d[^)]*\b(g|ml)\)/.test(label) ? 1 : Number(/^\s*(\d+)\s/.exec(label)?.[1] ?? 1)
        out.push({ label, grams: round(per * n), source: 'FDC' })
      } else log.push(`portion: ${key} — no FDC portion matching "${kw}", skipped`)
    }
  }
  out.push({ label: '100 g', grams: 100, source: 'household' })
  return out
}

// ── build ───────────────────────────────────────────────────────────────────
function build(): FoodsFile {
  const retrieved: Record<string, string> = {}
  const data = {} as Record<DatasetName, Map<number, FdcFood>>
  for (const name of Object.keys(DATASETS) as DatasetName[]) {
    retrieved[name] = ensureDataset(name)
    data[name] = loadDataset(name)
  }
  const rows = parseCsv(readFileSync(join(ROOT, 'scripts/foods/selection.csv'), 'utf8'))
  const foods: GeneratedFood[] = []

  for (const r of rows) {
    const ds = r.dataset as DatasetName
    const food = data[ds]?.get(Number(r.fdc_id))
    if (!food) {
      log.push(`skip: ${r.key} — FDC ${r.fdc_id} not found in ${ds}`)
      continue
    }
    if (food.description !== r.fdc_description) {
      log.push(`skip: ${r.key} — FDC ${r.fdc_id} is "${food.description}", expected "${r.fdc_description}"`)
      continue
    }
    if (!(CATEGORIES as readonly string[]).includes(r.category)) throw new Error(`${r.key}: unknown category`)
    const cat = r.category as Category
    const notes: string[] = []
    const allergens = allergensFor(r.key, cat, r.allergens)
    foods.push({
      id: r.key,
      nameCs: r.name_cs,
      nameEn: r.name_en,
      synonyms: [r.name_en, food.description],
      category: cat,
      subcategory: FDC_SUBCATEGORY[food.foodCategory?.description ?? ''] ?? null,
      state: r.state as FoodState,
      nutrients: panelFrom(food, notes),
      portions: portionsFor(r.key, r.portion, food),
      allergens,
      diet: dietFor(r.key, cat, allergens),
      completeProtein: isCompleteProtein(r.key, cat),
      liquid: isLiquid(r.key, cat),
      liveCultures: LIVE_CULTURES[r.key] ?? null,
      energyFactors: energyFactorsOf(food),
      recipe: null,
      provenance: {
        source: 'USDA FoodData Central',
        sourceId: String(food.fdcId),
        sourceVersion: DATASETS[ds].version,
        sourceDescription: food.description,
        retrievedAt: retrieved[ds],
        licence: LICENCE,
        verified: true,
        notes,
      },
    })
  }

  // calculated Czech recipes (may build on each other, defined in dependency order)
  const byId = new Map(foods.map((f) => [f.id, f]))
  for (const rec of RECIPES) {
    const parts = rec.ingredients.map((i) => {
      const f = byId.get(i.key)
      if (!f) throw new Error(`recipe ${rec.key}: unknown ingredient ${i.key}`)
      return { f, grams: i.grams }
    })
    const total = parts.reduce((s, p) => s + p.grams, 0)
    const nutrients = {} as Panel
    // water and salt contain no vitamins, fibre or fatty acids: a missing value there counts as 0.
    // For every other ingredient a missing value makes the recipe value unknown.
    const val = (f: GeneratedFood, k: PanelKey) => f.nutrients[k] ?? (ZERO_IF_MISSING.has(f.id) ? 0 : null)
    for (const p of PANEL) {
      const vals = parts.map((x) => val(x.f, p.key))
      nutrients[p.key] = vals.some((v) => v === null)
        ? null
        : round(parts.reduce((s, x) => s + (val(x.f, p.key)! * x.grams) / 100, 0) / (total / 100))
    }
    if (nutrients.sodium !== null) nutrients.salt = round(saltFromSodiumMg(nutrients.sodium))
    const allergens = [...new Set(parts.flatMap((x) => x.f.allergens))]
    const recipe: GeneratedFood = {
      id: rec.key,
      nameCs: rec.nameCs,
      nameEn: rec.nameEn,
      synonyms: [rec.nameEn],
      category: 'Česká jídla',
      subcategory: 'Vypočtený recept',
      state: 'recipe',
      nutrients,
      portions: [
        { ...rec.portion, source: 'recipe' },
        { label: '100 g', grams: 100, source: 'household' },
      ],
      allergens,
      diet: {
        vegan: parts.every((x) => x.f.diet.vegan),
        vegetarian: parts.every((x) => x.f.diet.vegetarian),
        glutenFree: parts.every((x) => x.f.diet.glutenFree),
      },
      completeProtein: false,
      liquid: false,
      liveCultures: null,
      energyFactors: null,
      recipe: { ingredients: rec.ingredients.map((i) => ({ id: i.key, grams: i.grams })), note: rec.note },
      provenance: {
        source: 'Calculated recipe',
        sourceId: rec.key,
        sourceVersion: 'BLWB recipe calculation from USDA FoodData Central ingredients',
        sourceDescription: rec.ingredients.map((i) => `${i.key} ${i.grams} g`).join(', '),
        retrievedAt: Object.values(retrieved).sort().at(-1)!,
        licence: LICENCE,
        verified: false,
        notes: [
          'Vypočteno ze surovin podle receptu, bez korekce na ztráty při vaření. Hodnota živiny chybí, pokud ji nemá některá surovina (u vody a soli se chybějící hodnota počítá jako 0).',
        ],
      },
    }
    foods.push(recipe)
    byId.set(recipe.id, recipe)
  }

  return {
    generated: true,
    generatedAt: Object.values(retrieved).sort().at(-1)!,
    datasets: Object.fromEntries(Object.entries(DATASETS).map(([k, v]) => [k, v.version])),
    foods,
  }
}

function diff(prev: FoodsFile | null, next: FoodsFile) {
  if (!prev) return [`new file with ${next.foods.length} foods`]
  const out: string[] = []
  const old = new Map(prev.foods.map((f) => [f.id, f]))
  for (const f of next.foods) {
    const o = old.get(f.id)
    if (!o) out.push(`+ ${f.id}`)
    else if (JSON.stringify(o) !== JSON.stringify(f)) {
      const fields = (Object.keys(f) as (keyof GeneratedFood)[]).filter(
        (k) => JSON.stringify(o[k]) !== JSON.stringify(f[k]),
      )
      out.push(`~ ${f.id}: ${fields.join(', ')}`)
    }
    old.delete(f.id)
  }
  for (const id of old.keys()) out.push(`- ${id}`)
  return out
}

const next = build()
const issues = validateFoods(next.foods)
for (const l of log) console.log(`  ${l}`)
if (issues.length) {
  for (const i of issues) console.error(`✗ ${i.id}: ${i.problem}`)
  console.error(`\n${issues.length} validation issue(s) — nothing written.`)
  process.exit(1)
}
const prev = existsSync(OUT) ? (JSON.parse(readFileSync(OUT, 'utf8')) as FoodsFile) : null
const changes = diff(prev, next)
console.log(changes.length ? `Changes:\n  ${changes.join('\n  ')}` : 'No changes.')
const lite = next.foods.map(toLite)
const liteChanged =
  !existsSync(OUT_LITE) || JSON.stringify(JSON.parse(readFileSync(OUT_LITE, 'utf8'))) !== JSON.stringify(lite)
if (liteChanged) console.log('Client index (foods.lite.generated.json) changed.')
if (changes.length || liteChanged) {
  writeFileSync(OUT, JSON.stringify(next) + '\n')
  writeFileSync(OUT_LITE, JSON.stringify(lite) + '\n')
  // same formatting as the committed files, so git diffs show only real changes
  execFileSync(
    join(process.cwd(), 'node_modules/.bin/prettier'),
    ['--write', '--log-level=warn', OUT, OUT_LITE],
    {
      stdio: 'inherit',
    },
  )
}
console.log(`✓ ${next.foods.length} foods → src/data/foods.generated.json (${log.length} log entries)`)
