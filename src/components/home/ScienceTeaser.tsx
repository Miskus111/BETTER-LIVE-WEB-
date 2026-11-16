import Link from 'next/link'
import { EvidenceLegend } from '@/components/ui/EvidenceBadge'

const RULES = [
  { k: '01', t: 'No cures', d: 'No food cures, detoxes or repairs an organ. We never say it does.' },
  {
    k: '02',
    t: 'Graded evidence',
    d: 'Every nutrient–organ link carries an evidence level, using EU-authorised claim wording where it exists.',
  },
  {
    k: '03',
    t: 'Computed, not curated',
    d: 'A food is linked to an organ only if 100 g supplies ≥ 15 % of the reference value — calculated from USDA data.',
  },
  {
    k: '04',
    t: 'Shared nutrients',
    d: 'No nutrient serves a single organ. The body map shows examples, not exclusive needs.',
  },
]

export function ScienceTeaser() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <ol className="grid gap-3 sm:grid-cols-2">
        {RULES.map((r) => (
          <li key={r.k} className="card p-5">
            <span className="text-cyan font-mono text-[12px]">{r.k}</span>
            <h3 className="mt-3 text-[18px] font-medium">{r.t}</h3>
            <p className="text-muted mt-1.5 text-[14.5px]">{r.d}</p>
          </li>
        ))}
      </ol>
      <div className="card flex flex-col p-6">
        <h3 className="eyebrow mb-4">Evidence legend</h3>
        <EvidenceLegend />
        <Link href="/science" className="btn btn-ghost mt-auto self-start">
          Methodology &amp; sources
        </Link>
      </div>
    </div>
  )
}
