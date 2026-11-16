import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Product } from '@/data/types'
import { Thumb } from '@/components/ui/Thumb'
import { OrganDots } from '@/components/ui/OrganDots'
import { productOrgans } from '@/lib/nutrition'
import { eur } from '@/lib/format'
import { AddToCartButton } from './AddToCartButton'
import { CertBadge, certLine, ExtraBadges } from './CertBadge'

export function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden" data-testid={`product-${p.id}`}>
      <Link href={`/product/${p.id}`} className="relative block" tabIndex={-1} aria-hidden>
        <Thumb
          src={p.images[0]}
          alt=""
          ratio="aspect-[5/4]"
          className="transition duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute top-3 left-3">
          <CertBadge product={p} />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[16px] leading-snug font-medium">
            <Link href={`/product/${p.id}`} className="hover:text-cyan">
              {p.name}
            </Link>
          </h3>
          <span className="font-mono text-[15px]">{eur(p.price)}</span>
        </div>
        <p className="text-subtle mt-1 flex items-center gap-1 text-[13px]">
          <MapPin size={12} aria-hidden /> {p.origin} · {p.size}
        </p>
        <p className="text-muted mt-2.5 text-[14.5px]">{p.shortDescription}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.highlights.map((h) => (
            <li key={h} className="text-fg/85 rounded-md bg-white/[0.04] px-2 py-0.5 text-[12.5px]">
              {h}
            </li>
          ))}
          <ExtraBadges product={p} />
        </ul>
        <p className="text-subtle mt-3 font-mono text-[12px]">{certLine(p)}</p>
        <p className="text-subtle font-mono text-[12px]">{p.processing}</p>
        <div className="mt-3">
          <OrganDots ids={productOrgans(p)} />
        </div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <AddToCartButton id={p.id} compact className="flex-1" />
          <Link
            href={`/product/${p.id}`}
            className="btn btn-ghost !px-3 !py-1.5 !text-[13.5px]"
            aria-label={`Details: ${p.name}`}
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}
