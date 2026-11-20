import { atwaterKcal } from './units'
import type { GeneratedFood } from './types'

/**
 * Energy check tolerance. Atwater general factors (4/4/9/7, fibre 2) — or the specific factors FDC lists
 * for that food (bran, cocoa, spices…) — vs the dataset's reported energy: must agree within 15 %. Below 40 kcal / 100 g a relative check is meaningless (tea, broth, leafy greens),
 * so there the absolute difference may be up to 6 kcal.
 */
const REL_TOLERANCE = 0.15
const LOW_ENERGY = 40
const ABS_TOLERANCE = 6

/**
 * Foods whose energy legitimately departs from Atwater general factors, with the reason. Each is a
 * documented exception, not a silenced error.
 */
export const ENERGY_EXCEPTIONS: Record<string, string> = {
  vinegar: 'Energie z kyseliny octové (3,6 kcal/g), kterou Atwaterovy faktory nezahrnují.',
  'apple-cider-vinegar': 'Energie z kyseliny octové, kterou Atwaterovy faktory nezahrnují.',
  stevia: 'Sladidlo s nulovou energií; nosič se do energie nezapočítává.',
  'lemon-juice': 'Organické kyseliny (citronová) mají jiný energetický faktor než sacharidy.',
  lemon: 'Organické kyseliny (citronová) mají jiný energetický faktor než sacharidy.',
  lime: 'Organické kyseliny (citronová) mají jiný energetický faktor než sacharidy.',
}

export interface ValidationIssue {
  id: string
  problem: string
}

export function validateFoods(foods: GeneratedFood[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const seen = new Set<string>()
  for (const f of foods) {
    const err = (problem: string) => issues.push({ id: f.id, problem })
    if (seen.has(f.id)) err('duplicate id')
    seen.add(f.id)

    const p = f.provenance
    if (!p || !p.source || !p.sourceId || !p.sourceVersion || !p.retrievedAt || !p.licence)
      err('missing provenance')
    if (!f.nameCs || !f.nameEn) err('missing name')
    if (!f.portions.length) err('no portions')
    for (const po of f.portions) if (!(po.grams > 0)) err(`portion "${po.label}" has no weight`)
    // a wrong FDC match ("cup, dry, yields" 528 g, "cup (4.86 large eggs)" 243 g) shows up as a huge portion
    for (const po of f.portions)
      if (po.source === 'FDC' && po.grams > 400)
        err(`portion "${po.label}" is ${po.grams} g — wrong FDC match?`)

    const n = f.nutrients
    for (const [k, v] of Object.entries(n)) {
      if (v === null) continue
      if (!Number.isFinite(v)) err(`${k} is not a number`)
      else if (v < 0) err(`${k} is negative (${v})`)
    }
    for (const k of ['protein', 'fat', 'carbsTotal', 'water', 'alcohol', 'fiber'] as const) {
      const v = n[k]
      if (v !== null && v > 100) err(`${k} > 100 g per 100 g (${v})`)
    }
    const solids = (n.protein ?? 0) + (n.fat ?? 0) + (n.carbsTotal ?? 0) + (n.alcohol ?? 0)
    if (solids > 100.5) err(`protein + fat + carbohydrate + alcohol = ${solids.toFixed(1)} g > 100 g`)

    if (n.kcal === null) err('missing energy (kcal)')
    if (n.kcal !== null && n.kj !== null) {
      const expected = n.kcal * 4.184
      if (Math.abs(n.kj - expected) > Math.max(5, expected * 0.03))
        err(`kJ ${n.kj} does not match kcal ${n.kcal}`)
    }
    if (n.kcal !== null && n.protein !== null && n.fat !== null && n.carbsAvailable !== null) {
      const calc = atwaterKcal({
        protein: n.protein,
        fat: n.fat,
        carbsAvailable: n.carbsAvailable,
        fiber: n.fiber ?? 0,
        alcohol: n.alcohol ?? 0,
      })
      // the dataset's own specific factors (FDC CalorieConversionFactor) apply to total carbohydrate
      const ef = f.energyFactors
      const specific = ef
        ? ef.protein * n.protein + ef.fat * n.fat + ef.carbs * (n.carbsTotal ?? 0) + 7 * (n.alcohol ?? 0)
        : null
      const agrees = (c: number) => {
        const diff = Math.abs(c - n.kcal!)
        return n.kcal! >= LOW_ENERGY ? diff / n.kcal! <= REL_TOLERANCE : diff <= ABS_TOLERANCE
      }
      if (!agrees(calc) && !(specific !== null && agrees(specific)) && !ENERGY_EXCEPTIONS[f.id])
        err(
          `energy ${n.kcal} kcal vs Atwater ${calc.toFixed(0)} kcal` +
            (specific !== null ? ` / specific factors ${specific.toFixed(0)} kcal` : ''),
        )
    }
    if (
      n.salt !== null &&
      n.sodium !== null &&
      Math.abs(n.salt - (n.sodium / 1000) * 2.5) > Math.max(0.01, n.salt * 0.01)
    )
      err('salt ≠ sodium × 2.5')
    if (/\b(bio|organic|organick)/i.test(`${f.nameCs} ${f.nameEn}`))
      err('organic claim without certification (store rules)')
    if (f.liveCultures && f.state !== 'fermented') err('live cultures on a non-fermented food')
  }
  return issues
}
