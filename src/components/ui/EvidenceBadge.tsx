import { EVIDENCE } from '@/data/sources'
import type { Evidence } from '@/data/types'

export function EvidenceBadge({ level, className = '' }: { level: Evidence; className?: string }) {
  const e = EVIDENCE[level]
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[12px] tracking-wide ${className}`}
      style={{ color: e.color, borderColor: `${e.color}55`, background: `${e.color}12` }}
      title={e.desc}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: e.color }} aria-hidden />
      {e.label}
    </span>
  )
}

export function EvidenceLegend() {
  return (
    <dl className="grid grid-cols-1 gap-3">
      {(Object.keys(EVIDENCE) as Evidence[]).map((k) => (
        <div key={k} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
          <dt className="sm:w-32">
            <EvidenceBadge level={k} />
          </dt>
          <dd className="text-muted text-[14.5px]">{EVIDENCE[k].desc}</dd>
        </div>
      ))}
    </dl>
  )
}
