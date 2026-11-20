import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { guidesLinkingTo, type BodyGuide } from '@/data/body-guides'
import { GuideIcon } from './GuideIcon'

/**
 * "Read also" box: body guides that mention this page, then any `extra` guides, without duplicates.
 * Renders nothing when there are none.
 */
export function RelatedGuides({
  href,
  extra = [],
  limit,
  className,
}: {
  href: string
  extra?: BodyGuide[]
  limit?: number
  className?: string
}) {
  const all = [...guidesLinkingTo(href), ...extra]
  const guides = all.filter((g, i) => all.indexOf(g) === i).slice(0, limit)
  if (!guides.length) return null
  return (
    <section className={className} aria-labelledby="related-guides">
      <h2 id="related-guides" className="eyebrow mb-3">
        Přečtěte si také — jak funguje tělo
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/jak-funguje-telo/${g.slug}`}
              className="card hover:border-cyan/40 flex h-full items-center gap-3 p-4 transition"
            >
              <span className="bg-cyan/10 text-cyan grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                <GuideIcon icon={g.icon} size={18} />
              </span>
              <span className="flex-1 text-[15px] font-medium">{g.title}</span>
              <ArrowRight size={16} className="text-cyan shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
