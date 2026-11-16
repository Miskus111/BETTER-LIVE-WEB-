import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Product } from '@/data/types'
import { Thumb } from '@/components/ui/Thumb'
import { OrganDots } from '@/components/ui/OrganDots'
import { isVerifiedOrganic, productOrgans } from '@/lib/nutrition'
import { czk } from '@/lib/format'
import { AddToCartButton } from './AddToCartButton'
import { CertBadge, certLine } from './CertBadge'

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
        <span className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <CertBadge product={p} />
          {p.pasture === 'verified' && (
            <span className="bg-ink/70 border-line text-fg/85 inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[12px] backdrop-blur">
              Ověřená pastva
            </span>
          )}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[16px] leading-snug font-medium">
            <Link href={`/product/${p.id}`} className="hover:text-cyan">
              {p.name}
            </Link>
          </h3>
          <span className="font-mono text-[15px]">{czk(p.price)}</span>
        </div>
        <p className="text-subtle mt-1 flex items-center gap-1 text-[13px]">
          <MapPin size={12} aria-hidden /> {p.origin} · {p.size}
        </p>
        <p className="text-muted mt-2.5 line-clamp-2 text-[14.5px]">{p.shortDescription}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Nutriční přednosti">
          {p.highlights.slice(0, 2).map((h) => (
            <li key={h} className="text-fg/85 rounded-md bg-white/[0.05] px-2 py-0.5 text-[12.5px]">
              {h}
            </li>
          ))}
        </ul>
        <dl className="border-line mt-4 grid grid-cols-[84px_minmax(0,1fr)] gap-x-3 gap-y-1 border-t pt-3 text-[12.5px]">
          <dt className="text-subtle">{p.certification.status === 'eu-bio' ? 'Kontrola' : 'Status'}</dt>
          <dd className="text-fg/85 truncate font-mono" title={certLine(p)}>
            {isVerifiedOrganic(p)
              ? p.certification.controlBody
              : p.certification.status === 'wild'
                ? 'Divoký úlovek'
                : 'Není bio'}
          </dd>
          <dt className="text-subtle">Zpracování</dt>
          <dd className="text-fg/85 truncate" title={p.processing}>
            {p.processing.split(' · ')[0]}
          </dd>
        </dl>
        <div className="mt-3">
          <OrganDots ids={productOrgans(p)} max={3} />
        </div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <AddToCartButton id={p.id} compact className="flex-1" />
          <Link
            href={`/product/${p.id}`}
            className="btn btn-ghost !px-3 !py-1.5 !text-[13.5px]"
            aria-label={`Detail: ${p.name}`}
          >
            Detail
          </Link>
        </div>
      </div>
    </article>
  )
}
