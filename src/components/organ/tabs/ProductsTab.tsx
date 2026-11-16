import Link from 'next/link'
import type { Organ } from '@/data/types'
import { Thumb } from '@/components/ui/Thumb'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { CertBadge } from '@/components/shop/CertBadge'
import { SampleDataLabel } from '@/components/layout/SampleDataLabel'
import { productsForOrgan } from '@/lib/nutrition'
import { WhereToBuy } from '@/components/ui/WhereToBuy'
import { WHERE_TO_BUY, type ShopLink } from '@/data/retailers'
import { czk } from '@/lib/format'

export function ProductsTab({ organ }: { organ: Organ }) {
  const products = productsForOrgan(organ.id)
  // supplements for the nutrients this organ depends on (not ones it merely handles), max 6, deduplicated
  const shopLinks = [
    ...new Map(
      organ.nutrients
        .filter((n) => (n.relation ?? 'supports') === 'supports' && n.level !== 'preliminary')
        .flatMap((n) => WHERE_TO_BUY[n.id] ?? [])
        .map((l): [string, ShopLink] => [l.url, l]),
    ).values(),
  ].slice(0, 6)
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted text-[14px]">Produkty, jejichž složení je pro tento orgán relevantní.</p>
        <SampleDataLabel />
      </div>
      <ul className="space-y-3">
        {products.map((p) => (
          <li key={p.id} className="card flex gap-3 p-3">
            <Link href={`/product/${p.id}`} className="w-20 shrink-0 overflow-hidden rounded-xl">
              <Thumb src={p.images[0]} alt={p.name} ratio="aspect-square" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${p.id}`}
                className="hover:text-cyan block truncate text-[14.5px] font-medium"
              >
                {p.name}
              </Link>
              <p className="text-subtle truncate text-[12.5px]">
                {p.origin} · {p.size}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <CertBadge product={p} />
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end justify-between gap-2">
              <span className="font-mono text-[14px]">{czk(p.price)}</span>
              <AddToCartButton id={p.id} label="Přidat" compact />
            </div>
          </li>
        ))}
      </ul>
      <WhereToBuy
        links={shopLinks}
        title="Doplňky stravy v českých obchodech"
        compact
        className="border-line mt-6 border-t pt-5"
      />
      <Link href="/shop" className="btn btn-ghost mt-5 w-full">
        Celý obchod
      </Link>
    </div>
  )
}
