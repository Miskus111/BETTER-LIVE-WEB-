import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ABSORPTION } from '@/data/absorption'
import { NUTRIENTS } from '@/data/nutrients'
import { REFERENCE } from '@/data/reference'
import type { NutrientId } from '@/data/types'
import { RatingBadge } from '@/components/ui/AbsorptionCard'
import { supplementHref } from '@/data/supplements'
import { COMPOUNDS } from '@/data/compounds'

const KEY: NutrientId[] = ['vitD', 'omega3', 'magnesium', 'iron']

export function SupplementsTeaser() {
  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KEY.map((id) => {
          const a = ABSORPTION[id]!
          const best = a.forms[0]
          const weak = a.forms.find((f) => f.rating === 'slabší')
          const r = REFERENCE[id]
          return (
            <li key={id}>
              <Link
                href={supplementHref(id)}
                className="card group hover:border-cyan/40 flex h-full flex-col p-5 transition"
              >
                <p className="eyebrow">{NUTRIENTS[id].kind}</p>
                <h3 className="display mt-2 text-[30px]">{NUTRIENTS[id].name}</h3>
                <div className="mt-4 space-y-2 text-[14px]">
                  <p className="flex flex-wrap items-center gap-2">
                    <RatingBadge rating={best.rating} /> {best.name}
                  </p>
                  {weak && (
                    <p className="text-muted flex flex-wrap items-center gap-2">
                      <RatingBadge rating={weak.rating} /> {weak.name}
                    </p>
                  )}
                </div>
                <dl className="border-line mt-4 grid grid-cols-2 gap-2 border-t pt-3 text-[12.5px]">
                  <div>
                    <dt className="text-subtle font-mono">EFSA</dt>
                    <dd>{r?.efsa?.text ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-subtle font-mono">Horní limit</dt>
                    <dd>{r?.ul?.text ?? '—'}</dd>
                  </div>
                </dl>
                <span className="text-cyan mt-auto flex items-center gap-1 pt-4 text-[13.5px]">
                  Formy, dávky, kde koupit
                  <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="text-muted mt-6 text-center text-[15px]">
        Víc než vitamíny:{' '}
        {COMPOUNDS.map((c, i) => (
          <span key={c.id}>
            <Link href={`/doplnky/${c.slug}`} className="link">
              {c.name}
            </Link>
            {i < COMPOUNDS.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      <div className="mt-6 flex justify-center">
        <Link href="/doplnky" className="btn btn-primary text-center whitespace-normal">
          Všechny doplňky a referenční hodnoty <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </div>
  )
}
