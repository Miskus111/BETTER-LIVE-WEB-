/**
 * Loads global reference data (USDA foods, affiliate catalogue) into Supabase with the service role.
 * Same content as supabase/seed.sql, but runnable without the SQL editor: npm run seed:reference
 */
import { admin } from './supabase-admin'
import { FOODS } from '../src/data/foods'
import { TOPIC_LINKS, WHERE_TO_BUY, type ShopLink } from '../src/data/retailers'
import { EXERCISES, GENERIC_STEPS } from '../src/data/exercises'
import { SUPPLEMENTS } from '../src/data/supplement-library'

async function main() {
  const db = admin()
  const foods = FOODS.map((f) => ({
    owner_id: null,
    source: 'usda',
    source_id: f.fdc,
    slug: f.id,
    name_cs: f.name,
    name_en: f.id.replace(/-/g, ' '),
    kcal: f.kcal,
    protein_g: f.macros.protein,
    fat_g: f.macros.fat,
    carbs_g: f.macros.carbs,
    fiber_g: f.macros.fiber,
    micros: f.micros,
  }))
  const r1 = await db.from('foods').upsert(foods, { onConflict: 'owner_id,slug' })
  if (r1.error) throw r1.error

  const slug = (l: ShopLink) =>
    `${l.retailer}-${new URL(l.url).pathname.replace(/\//g, '-').replace(/^-|-$/g, '')}`
  const rows = new Map<string, Record<string, unknown>>()
  const add = (l: ShopLink, nutrient: string) =>
    rows.set(slug(l), {
      slug: slug(l),
      retailer: l.retailer,
      name: l.label,
      url: l.url,
      kind: l.kind === 'doplněk' ? 'supplement' : l.kind === 'kategorie' ? 'category' : 'food',
      nutrient,
      why: l.why ?? null,
      note: l.note ?? null,
    })
  for (const [n, links] of Object.entries(WHERE_TO_BUY)) for (const l of links ?? []) add(l, n)
  for (const [t, links] of Object.entries(TOPIC_LINKS)) for (const l of links) add(l, t)
  const r2 = await db.from('products').upsert([...rows.values()], { onConflict: 'slug' })
  if (r2.error) throw r2.error
  const exercises = EXERCISES.map((e) => ({
    owner_id: null,
    slug: e.slug,
    name_cs: e.name.cs,
    name_en: e.name.en,
    category: e.category,
    primary_muscles: e.primary,
    secondary_muscles: e.secondary,
    equipment: e.equipment,
    instructions: { cs: [...GENERIC_STEPS.cs, e.cue.cs], en: [...GENERIC_STEPS.en, e.cue.en] },
    mistakes: { cs: [e.mistake.cs], en: [e.mistake.en] },
    regressions: e.regressions,
    progressions: e.progressions,
    unilateral: !!e.unilateral,
  }))
  const r3 = await db.from('exercises').upsert(exercises, { onConflict: 'owner_id,slug' })
  if (r3.error) throw r3.error
  const supps = SUPPLEMENTS.map((x) => ({
    slug: x.id,
    name_cs: x.name.cs,
    name_en: x.name.en,
    evidence: x.evidence,
    summary: x.what,
    typical_dose: x.dose,
    upper_limit: x.ul ?? null,
    interactions: x.interactions,
    avoid_if: x.avoidIf,
  }))
  const r4 = await db.from('supplements').upsert(supps, { onConflict: 'slug' })
  if (r4.error) throw r4.error
  console.log(`✓ supplements: ${supps.length}`)
  console.log(`✓ reference data: ${foods.length} foods, ${rows.size} products, ${exercises.length} exercises`)
}

main().catch((e) => {
  console.error('✗', e.message ?? e)
  process.exit(1)
})
