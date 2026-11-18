import Link from 'next/link'
import { ArrowRight, Beef, Coffee, Droplet, Headphones, HeartPulse } from 'lucide-react'
import { TOOLS } from '@/data/tools'

const ICONS = { coffee: Coffee, headphones: Headphones, beef: Beef, heart: HeartPulse, droplet: Droplet }

/** Grid of the interactive calculators; each card opens the tool inside its guide. */
export function ToolCards({ limit }: { limit?: number }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="tool-cards">
      {TOOLS.slice(0, limit).map((t) => {
        const Icon = ICONS[t.icon]
        return (
          <li key={t.guide}>
            <Link
              href={`/jak-funguje-telo/${t.guide}#try`}
              className="card hover:border-cyan/40 group flex h-full flex-col p-5 transition"
            >
              <span className="bg-cyan/10 text-cyan grid h-10 w-10 place-items-center rounded-xl">
                <Icon size={20} aria-hidden />
              </span>
              <span className="mt-4 text-[17px] leading-snug font-medium">{t.title}</span>
              <span className="text-muted mt-2 text-[14px]">{t.text}</span>
              <span className="text-subtle mt-3 font-mono text-[11.5px]">Podle: {t.basis}</span>
              <span className="text-cyan mt-auto inline-flex items-center gap-1 pt-4 text-[13.5px]">
                Spočítat{' '}
                <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
