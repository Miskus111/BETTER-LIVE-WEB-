import Link from '@/components/ui/Link'
import { ArrowRight, Search } from 'lucide-react'
import { FOODS } from '@/data/foods'
import { CATEGORIES } from '@/lib/foods/categories'

/** Homepage entry to the food explorer (the explorer itself lives on /potraviny). */
export function FoodsTeaser() {
  const counts = CATEGORIES.map((c) => [c, FOODS.filter((f) => f.category === c).length] as const).filter(
    ([, n]) => n > 0,
  )
  return (
    <div className="card p-6 md:p-8">
      <div className="flex flex-wrap gap-2">
        {counts.map(([c, n]) => (
          <span key={c} className="chip">
            {c} <span className="text-subtle font-mono text-[12px]">{n}</span>
          </span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/potraviny" className="btn btn-primary" data-testid="foods-teaser">
          <Search size={16} aria-hidden /> Prohledat {FOODS.length} potravin
        </Link>
        <Link href="/food/almonds" className="btn btn-ghost">
          Ukázka: mandle <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </div>
  )
}
