'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Leaf } from 'lucide-react'
import { PRODUCTS, SHOP_CATEGORIES } from '@/data/products'
import type { ShopCategory } from '@/data/types'
import { isVerifiedOrganic } from '@/lib/nutrition'
import { ProductCard } from './ProductCard'

const SORTS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  name: 'Name A–Z',
} as const
type Sort = keyof typeof SORTS

/** Store grid with URL-synced filters: ?category=, ?bio=1, ?sort= */
export function ShopView() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const rawCat = params.get('category')
  const category = SHOP_CATEGORIES.includes(rawCat as ShopCategory) ? (rawCat as ShopCategory) : null
  const bioOnly = params.get('bio') === '1'
  const rawSort = params.get('sort') as Sort | null
  const sort: Sort = rawSort && rawSort in SORTS ? rawSort : 'featured'

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k)
      else next.set(k, v)
    }
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  let items = PRODUCTS.filter(
    (p) => (!category || p.categories.includes(category)) && (!bioOnly || isVerifiedOrganic(p)),
  )
  items = [...items].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'name') return a.name.localeCompare(b.name)
    return Number(!!b.featured) - Number(!!a.featured)
  })

  return (
    <div>
      <div className="border-line flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0"
          role="group"
          aria-label="Category"
        >
          <button
            type="button"
            className="chip shrink-0"
            aria-pressed={!category}
            onClick={() => update({ category: null })}
          >
            All
          </button>
          {SHOP_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className="chip shrink-0"
              aria-pressed={category === c}
              onClick={() => update({ category: category === c ? null : c })}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-muted flex cursor-pointer items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              checked={bioOnly}
              onChange={(e) => update({ bio: e.target.checked ? '1' : null })}
              className="h-4 w-4 accent-[#8fd16a]"
              data-testid="bio-only"
            />
            <Leaf size={14} className="text-bio" aria-hidden /> EU BIO only
          </label>
          <label className="text-muted flex items-center gap-2 text-[14px]">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}
              className="field !w-auto !py-2 !text-[14px]"
            >
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="text-subtle mt-4 font-mono text-[12.5px]" aria-live="polite">
        {items.length} product{items.length === 1 ? '' : 's'}
        {category && ` · ${category}`}
        {bioOnly && ' · EU BIO only'}
      </p>

      {items.length ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="card mt-6 p-10 text-center">
          <p className="text-muted">No products match these filters.</p>
          <button
            type="button"
            className="btn btn-ghost mt-4"
            onClick={() => update({ category: null, bio: null })}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
