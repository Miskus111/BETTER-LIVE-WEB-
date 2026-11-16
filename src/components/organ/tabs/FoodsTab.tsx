import Link from 'next/link'
import { NUTRIENTS } from '@/data/nutrients'
import type { Organ } from '@/data/types'
import { Thumb } from '@/components/ui/Thumb'
import { foodsForOrgan } from '@/lib/nutrition'

export function FoodsTab({ organ }: { organ: Organ }) {
  const foods = foodsForOrgan(organ, 12)
  return (
    <div>
      <p className="text-muted mb-4 text-[14px]">
        Foods where 100 g supplies at least the EU &ldquo;source of&rdquo; level (≥ 15 % of the reference
        value) of a nutrient this organ depends on. Ranked by evidence and amount — computed from USDA data.
      </p>
      <ul className="grid grid-cols-2 gap-3">
        {foods.map(({ food, via }) => (
          <li key={food.id}>
            <Link
              href={`/food/${food.id}`}
              className="card group hover:border-line-strong block overflow-hidden transition"
            >
              <Thumb src={food.image} alt="" ratio="aspect-[4/3]" />
              <div className="p-3">
                <p className="group-hover:text-cyan text-[14.5px] font-medium">{food.name}</p>
                <p className="text-subtle mt-1 line-clamp-2 text-[12px]">
                  {via.map((id) => NUTRIENTS[id].name.replace(/ \(.+\)/, '')).join(' · ')}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
