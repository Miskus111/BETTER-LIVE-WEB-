import Link from '@/components/ui/Link'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { MYTHS, PILLARS } from '@/data/looksmaxing'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'

export function LooksmaxingTeaser() {
  const pillars = PILLARS.slice(0, 3)
  const myths = MYTHS.filter((m) => m.danger).slice(0, 2)
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_1.1fr]">
      {pillars.map((p, i) => (
        <Link
          key={p.id}
          href={`/looksmaxing#${p.id}`}
          className="card group hover:border-cyan/40 flex flex-col p-5 transition"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-cyan font-mono text-[12px]">0{i + 1}</span>
            <EvidenceBadge level={p.level} />
          </div>
          <h3 className="display mt-4 text-[28px]">{p.title}</h3>
          <p className="text-muted mt-1 text-[14.5px]">{p.lead}</p>
          <span className="text-cyan mt-auto flex items-center gap-1 pt-5 text-[13.5px]">
            Jak na to <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      ))}
      <div className="flex flex-col gap-3 rounded-[1.25rem] border border-[#ff8b8b]/25 bg-[#ff8b8b]/[0.04] p-5">
        <p className="eyebrow !text-[#ff9b9b]">Pozor na</p>
        {myths.map((m) => (
          <p key={m.myth} className="flex gap-2 text-[14px]">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#ff9b9b]" aria-hidden />
            <span>
              <span className="font-medium">{m.short}</span>
              <span className="text-muted"> — {m.fact.split('. ')[0].replace(/\.$/, '')}.</span>
            </span>
          </p>
        ))}
        <Link href="/looksmaxing" className="btn btn-primary mt-auto">
          Celý průvodce <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </div>
  )
}
