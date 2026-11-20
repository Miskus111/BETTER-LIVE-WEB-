import { NUTRIENTS } from '@/data/nutrients'
import type { Food, NutrientId } from '@/data/types'
import { amountOf, pctRef, thresholdOf } from '@/lib/nutrition'
import { portionText } from './query'

const num = (v: number, digits = 1) => v.toLocaleString('cs-CZ', { maximumFractionDigits: digits })
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)
const nameOf = (id: NutrientId) => lower(NUTRIENTS[id].name.replace(/ \(.+\)/, ''))

/**
 * "V kostce": a few plain-language lines computed from the data, using the wording and thresholds of
 * EU nutrition claims (Reg. (EC) 1924/2006, Annex): low energy ≤ 40 kcal/100 g (20 kcal/100 ml),
 * source of / high protein ≥ 12 / 20 % of energy, source of / high fibre ≥ 3 / 6 g/100 g, low fat
 * ≤ 3 g/100 g (1,5 g/100 ml), source of / high in a vitamin or mineral ≥ 15 / 30 % NRV per 100 g
 * (half for drinks). Downsides use the UK FSA "high" thresholds: sugars > 22,5 g, fat > 17,5 g, saturated fat > 5 g,
 * salt > 1,5 g per 100 g (half for drinks). Nothing here is written by hand, so it can't overstate a food.
 */
export function foodSummary(f: Food): string[] {
  const out: string[] = []
  const per = f.liquid ? '100 ml' : '100 g'

  if (f.kcal <= (f.liquid ? 20 : 40)) out.push(`Nízký obsah energie: ${num(f.kcal, 0)} kcal na ${per}.`)
  else if (f.kcal >= 400)
    out.push(
      `Energeticky hutné: ${num(f.kcal, 0)} kcal na ${per} — záleží hlavně na velikosti porce (${portionText(f.portion)} ≈ ${num((f.kcal * f.portion.grams) / 100, 0)} kcal).`,
    )

  // the other side, per the UK FSA front-of-pack "high" thresholds (per 100 g; half for drinks)
  const half = f.liquid ? 0.5 : 1
  if (f.sugars !== undefined && f.sugars > 22.5 * half)
    out.push(
      `Vysoký obsah cukrů: ${num(f.sugars)} g na ${per}${f.category === 'Ovoce' ? ' (přirozené cukry z ovoce)' : ''}.`,
    )
  if (f.macros.fat > 17.5 * half) out.push(`Vysoký obsah tuku: ${num(f.macros.fat)} g na ${per}.`)
  if (f.satFat !== undefined && f.satFat > 5 * half)
    out.push(`Vysoký obsah nasycených tuků: ${num(f.satFat)} g na ${per}.`)
  if (f.sodiumMg !== undefined && (f.sodiumMg * 2.5) / 1000 > 1.5 * half)
    out.push(`Vysoký obsah soli: ${num((f.sodiumMg * 2.5) / 1000)} g na ${per}.`)

  // claims about protein only when there is a meaningful amount (coffee is 48 % protein energy at 0,1 g)
  if (f.kcal > 0 && f.macros.protein >= (f.liquid ? 2.5 : 5)) {
    const share = (f.macros.protein * 4) / f.kcal
    if (share >= 0.2)
      out.push(
        `Vysoký obsah bílkovin: ${num(share * 100, 0)}\u00a0% energie pochází z bílkovin (${num(f.macros.protein)} g na ${per}).`,
      )
    else if (share >= 0.12)
      out.push(
        `Zdroj bílkovin: ${num(share * 100, 0)}\u00a0% energie z bílkovin (${num(f.macros.protein)} g na ${per}).`,
      )
  }

  if (!f.liquid) {
    if (f.macros.fiber >= 6) out.push(`Vysoký obsah vlákniny: ${num(f.macros.fiber)} g na 100 g.`)
    else if (f.macros.fiber >= 3) out.push(`Zdroj vlákniny: ${num(f.macros.fiber)} g na 100 g.`)
  }

  const lowEnergy = f.kcal <= (f.liquid ? 20 : 40)
  if (!lowEnergy && f.macros.fat <= (f.liquid ? 1.5 : 3))
    out.push(`Nízký obsah tuku: ${num(f.macros.fat)} g na ${per}.`)

  const micros = (Object.keys(f.micros) as NutrientId[])
    .filter((id) => NUTRIENTS[id]?.ref && !['protein', 'fiber'].includes(id))
    .map((id) => {
      const v = amountOf(f, id) ?? 0
      return { id, v, pct: pctRef(id, v) ?? 0, t: thresholdOf(id, f.liquid) ?? Infinity }
    })
    .sort((a, b) => b.pct - a.pct)
  const label = (m: (typeof micros)[number]) => `${nameOf(m.id)} (${m.pct}\u00a0%)`
  const rich = micros.filter((m) => m.v >= 2 * m.t)
  const source = micros.filter((m) => m.v >= m.t && m.v < 2 * m.t)
  if (rich.length)
    out.push(`Vysoký obsah: ${rich.slice(0, 4).map(label).join(', ')} denní referenční hodnoty na ${per}.`)
  if (source.length)
    out.push(`Zdroj: ${source.slice(0, 4).map(label).join(', ')} denní referenční hodnoty na ${per}.`)

  const top = micros[0]
  if (top) {
    const portionPct = Math.round((top.pct * f.portion.grams) / 100)
    if (portionPct >= 50)
      out.push(
        `Jedna porce (${portionText(f.portion)}) pokryje ${portionPct}\u00a0% denní referenční hodnoty pro ${nameOf(top.id)}.`,
      )
  }
  return out
}
