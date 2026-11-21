import { NUTRIENTS } from '@/data/nutrients'
import type { NutrientId } from '@/data/types'
import { fmtAmount, pctRef, thresholdOf } from '@/lib/nutrition'
import { Rhp } from './Rhp'

/** Amount per 100 g with a bar showing % of the daily reference (capped visually at 100 %). */
export function NrvBar({ id, value }: { id: NutrientId; value: number }) {
  const n = NUTRIENTS[id]
  const pct = pctRef(id, value)
  const t = thresholdOf(id)
  const source = t !== undefined && value >= t
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[14.5px]">
        <span className={source ? 'text-fg' : 'text-muted'}>{n.name}</span>
        <span className="text-muted font-mono text-[13px]">
          {fmtAmount(value, n.unit)}
          {pct !== undefined && (
            <span className={source ? 'text-cyan ml-2' : 'text-subtle ml-2'}>
              {pct} % {n.ref?.kind === 'RHP' ? <Rhp /> : n.ref?.kind}
            </span>
          )}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
        <div
          className={`h-full rounded-full ${source ? 'from-cyan-2 to-cyan bg-gradient-to-r' : 'bg-white/25'}`}
          style={{ width: `${Math.min(100, pct ?? (t ? (value / t) * 15 : 0))}%` }}
        />
      </div>
    </div>
  )
}
