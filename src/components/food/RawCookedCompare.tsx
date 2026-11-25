import Link from '@/components/ui/Link'
import type { Food } from '@/data/types'
import { FOOD_DETAILS } from '@/data/food-details'
import { PANEL_BY_KEY, type PanelKey } from '@/lib/foods/panel'
import { fmtAmount } from '@/lib/nutrition'

// highlighted only when the loss isn't just dilution by absorbed water
const HEAT_SENSITIVE = new Set<PanelKey>(['vitC', 'folate', 'b1'])
const ROWS: PanelKey[] = [
  'water',
  'kcal',
  'protein',
  'carbsAvailable',
  'fiber',
  'vitC',
  'folate',
  'b1',
  'potassium',
]

/**
 * Uncooked vs cooked, per 100 g, straight from the two FDC records. Explains the two effects readers
 * mix up: water (cooking concentrates or dilutes everything per 100 g) and heat/leaching (vitamin C,
 * folate and B1 are partly lost). Server component: reads the full panels.
 */
export function RawCookedCompare({ before, after, current }: { before: Food; after: Food; current: string }) {
  const a = FOOD_DETAILS[before.id]?.nutrients
  const b = FOOD_DETAILS[after.id]?.nutrients
  if (!a || !b) return null
  const rows = ROWS.filter((k) => a[k] !== null && b[k] !== null && (a[k]! > 0 || b[k]! > 0))
  const waterDelta = (b.water ?? 0) - (a.water ?? 0)
  const other = before.id === current ? after : before
  const beforeLabel = before.state === 'dry' ? 'Suché' : 'Syrové'

  return (
    <section className="card mt-6 p-5" aria-labelledby="raw-cooked" data-testid="raw-cooked">
      <h2 id="raw-cooked" className="text-[18px] font-medium">
        Jak se mění úpravou
      </h2>
      <p className="text-muted mt-1 text-[14.5px]">
        {Math.abs(waterDelta) >= 5
          ? waterDelta < 0
            ? `Úpravou se odpaří voda (${fmtAmount(Math.abs(waterDelta), 'g')} na 100 g), takže se ostatní živiny na 100 g zahustí.`
            : `Úpravou nasákne vodu (+${fmtAmount(waterDelta, 'g')} na 100 g), takže se živiny na 100 g zředí — porce ale váží víc.`
          : 'Obsah vody se úpravou skoro nemění, rozdíly jsou tedy hlavně vliv tepla a vyvaření do vody.'}{' '}
        Vitamín C, folát a B1 se teplem a vyluhováním částečně ničí; minerály se ztrácejí hlavně do vody z
        vaření.
      </p>
      <p className="mt-2 text-[13.5px]">
        <span className="text-subtle">Srovnání: </span>
        {before.basis} → {after.basis} ·{' '}
        <Link href={`/food/${other.id}`} className="link">
          stránka {other.id === after.id ? 'upravené' : before.state === 'dry' ? 'suché' : 'syrové'} podoby
        </Link>
      </p>
      <div className="mt-3 overflow-x-auto" tabIndex={0}>
        <table className="w-full text-[13.5px]">
          <thead className="text-subtle font-mono text-[11.5px] uppercase">
            <tr>
              <th className="py-1.5 text-left font-normal">Na 100 g</th>
              <th className="py-1.5 pl-3 text-right font-normal">{beforeLabel}</th>
              <th className="py-1.5 pl-3 text-right font-normal">Upravené</th>
              <th className="py-1.5 pl-3 text-right font-normal">Změna</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => {
              const p = PANEL_BY_KEY[k]
              const change = a[k]! > 0 ? Math.round(((b[k]! - a[k]!) / a[k]!) * 100) : null
              return (
                <tr key={k} className="border-line border-t">
                  <td className="py-1.5">{p.cs}</td>
                  <td className="py-1.5 pl-3 text-right font-mono whitespace-nowrap">
                    {fmtAmount(a[k]!, p.unit)}
                  </td>
                  <td className="py-1.5 pl-3 text-right font-mono whitespace-nowrap">
                    {fmtAmount(b[k]!, p.unit)}
                  </td>
                  <td
                    className={`py-1.5 pl-3 text-right font-mono whitespace-nowrap ${HEAT_SENSITIVE.has(k) && change !== null && change <= -20 && waterDelta < 5 ? 'text-warn' : 'text-subtle'}`}
                  >
                    {change === null ? '—' : `${change > 0 ? '+' : ''}${change} %`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-subtle mt-2 text-[12px]">
        Dva samostatné záznamy USDA FoodData Central (FDC {FOOD_DETAILS[before.id].provenance.sourceId} a{' '}
        {FOOD_DETAILS[after.id].provenance.sourceId}) — jiné vzorky, takže malé rozdíly mohou být i přirozená
        variabilita.
      </p>
    </section>
  )
}
