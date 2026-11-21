import Link from '@/components/ui/Link'
import { ArrowRight, HelpCircle } from 'lucide-react'
import { BODY_GUIDES, BODY_GUIDE_BY_SLUG } from '@/data/body-guides'
import { GuideIcon } from '@/components/guides/GuideIcon'

/** The topics people search for most — the full list lives on /jak-funguje-telo. */
const FEATURED = [
  'spanek',
  'dopamin-a-mobil',
  'energie-a-kofein',
  'stres',
  'svaly-a-metabolismus',
  'akne-a-plet',
  'nikotin-a-vaping',
  'hubnuti-a-energie',
]

/** Homepage strip: a handful of "how your body works" guides plus the quiz. */
export function GuidesTeaser() {
  return (
    <>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED.map((slug) => BODY_GUIDE_BY_SLUG[slug])
          .filter(Boolean)
          .map((g) => (
            <li key={g.slug}>
              <Link
                href={`/jak-funguje-telo/${g.slug}`}
                className="card hover:border-cyan/40 group flex h-full items-start gap-3 p-4 transition"
              >
                <span className="bg-cyan/10 text-cyan grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                  <GuideIcon icon={g.icon} size={18} />
                </span>
                <span>
                  <span className="block text-[15px] leading-snug font-medium">{g.short}</span>
                  <span className="text-muted mt-1 block text-[13.5px]">{g.hook}</span>
                </span>
              </Link>
            </li>
          ))}
      </ul>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/jak-funguje-telo" className="btn btn-primary" data-testid="all-guides">
          Všech {BODY_GUIDES.length} průvodců <ArrowRight size={15} aria-hidden />
        </Link>
        <Link href="/jak-funguje-telo/kviz" className="btn btn-ghost">
          <HelpCircle size={15} aria-hidden /> Kvíz: mýtus, nebo fakt?
        </Link>
      </div>
    </>
  )
}
