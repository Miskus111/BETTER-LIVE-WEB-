import { NUTRIENTS } from '@/data/nutrients'
import { EVIDENCE } from '@/data/sources'
import type { Evidence, Organ } from '@/data/types'
import { FermentationExplainer } from '../FermentationExplainer'
import type { OrganTab } from '../OrganPanel'

export function OverviewTab({ organ, goTo }: { organ: Organ; goTo: (t: OrganTab) => void }) {
  return (
    <div className="space-y-6">
      <Block title="What it does">{organ.what}</Block>
      <Block title="How it works">{organ.how}</Block>
      <Block title="Why nutrition matters">{organ.why}</Block>
      <div>
        <h3 className="eyebrow mb-3">Key nutrients</h3>
        <ul className="flex flex-wrap gap-2">
          {organ.nutrients.map((n) => (
            <li key={n.id}>
              <button type="button" onClick={() => goTo('Nutrients')} className="chip">
                {NUTRIENTS[n.id].name}
                <EvidenceDot level={n.level} />
              </button>
            </li>
          ))}
        </ul>
        <p className="text-subtle mt-3 text-[13px]">
          These nutrients matter throughout the body — none is needed by this organ alone.
        </p>
      </div>
      {organ.fermentation && <FermentationExplainer />}
    </div>
  )
}

function EvidenceDot({ level }: { level: Evidence }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{ background: EVIDENCE[level].color }}
      title={`Evidence: ${EVIDENCE[level].label}`}
      aria-label={`evidence ${EVIDENCE[level].label}`}
    />
  )
}

export function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-2">{title}</h3>
      <p className="text-fg/90 text-[15px] leading-relaxed">{children}</p>
    </div>
  )
}
