import { MousePointerClick } from 'lucide-react'
import { ORGANS } from '@/data/organs'
import type { OrganId } from '@/data/types'
import { EvidenceLegend } from '@/components/ui/EvidenceBadge'

export function PanelIntro({ onSelect }: { onSelect: (id: OrganId) => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <span className="eyebrow">Interactive anatomy</span>
      <h2 className="display mt-3 text-[34px]">Select an organ to see what it needs — and why.</h2>
      <p className="text-muted mt-3 text-[14.5px]">
        Hover the body to identify structures, click to zoom in. Every nutrient link is graded by evidence and
        every food link is computed from USDA data.
      </p>
      <p className="text-subtle mt-5 flex items-center gap-2 font-mono text-[12px]">
        <MousePointerClick size={14} aria-hidden /> Or jump straight to
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {ORGANS.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => onSelect(o.id)}
              className="border-line hover:border-line-strong flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[14.5px] transition hover:bg-white/[0.03]"
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: o.accent }} aria-hidden />
              {o.shortName}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <h3 className="eyebrow !text-subtle mb-3">Evidence levels</h3>
        <EvidenceLegend />
      </div>
    </div>
  )
}
