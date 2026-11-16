import { CircleSlash, FlaskRound } from 'lucide-react'
import type { Organ } from '@/data/types'
import { EvidenceLegend } from '@/components/ui/EvidenceBadge'

export function ScienceTab({ organ }: { organ: Organ }) {
  return (
    <div className="space-y-7">
      <section>
        <h3 className="eyebrow mb-3 flex items-center gap-2">
          <FlaskRound size={14} aria-hidden /> Co říká výzkum
        </h3>
        <ul className="space-y-3">
          {organ.science.points.map((p) => (
            <li key={p} className="border-cyan/40 text-fg/90 border-l-2 pl-3 text-[14.5px]">
              {p}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="eyebrow !text-warn mb-3 flex items-center gap-2">
          <CircleSlash size={14} aria-hidden /> Co výzkum NEPROKÁZAL
        </h3>
        <ul className="space-y-3">
          {organ.science.notShown.map((p) => (
            <li key={p} className="border-warn/40 text-fg/90 border-l-2 pl-3 text-[14.5px]">
              {p}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="eyebrow mb-3">Úrovně důkazů</h3>
        <EvidenceLegend />
      </section>
      <section>
        <h3 className="eyebrow mb-3">Zdroje</h3>
        <ul className="space-y-2">
          {organ.science.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer noopener" className="link text-[14px]">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
