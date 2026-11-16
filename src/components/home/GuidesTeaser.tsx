import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BODY_GUIDES } from '@/data/body-guides'
import { GuideIcon } from '@/components/guides/GuideIcon'

/** Homepage strip: the "how your body works" guides. */
export function GuidesTeaser() {
  return (
    <>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BODY_GUIDES.map((g) => (
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
      <div className="mt-6 flex justify-center">
        <Link href="/jak-funguje-telo" className="btn btn-ghost">
          Všichni průvodci <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </>
  )
}
