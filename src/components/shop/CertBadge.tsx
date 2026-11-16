import { Fish, Leaf, Microscope, Sprout, Tag } from 'lucide-react'
import type { Product } from '@/data/types'
import { isVerifiedOrganic } from '@/lib/nutrition'
import { cx } from '@/lib/format'

/**
 * Certification label. The EU BIO badge is shown ONLY for verified EU organic products.
 * Everything else is labelled plainly — never "natural".
 */
export function CertBadge({ product, size = 'sm' }: { product: Product; size?: 'sm' | 'md' }) {
  const c = product.certification
  const base = cx(
    'inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide',
    size === 'sm' ? 'px-2 py-0.5 text-[12px]' : 'px-3 py-1 text-[13px]',
  )
  if (isVerifiedOrganic(product))
    return (
      <span className={cx(base, 'border-bio/40 bg-bio/10 text-bio')} data-cert="eu-bio">
        <Leaf size={size === 'sm' ? 12 : 14} aria-hidden />
        EU BIO
      </span>
    )
  if (c.status === 'wild')
    return (
      <span className={cx(base, 'border-blue/35 bg-blue/10 text-[#9cc9ff]')} data-cert="wild">
        <Fish size={size === 'sm' ? 12 : 14} aria-hidden />
        Wild-caught · not eligible for organic certification
      </span>
    )
  return (
    <span className={cx(base, 'border-line-strong text-muted')} data-cert="conventional">
      <Tag size={size === 'sm' ? 12 : 14} aria-hidden />
      Conventional
    </span>
  )
}

export function ExtraBadges({ product }: { product: Product }) {
  return (
    <>
      {product.pasture === 'verified' && (
        <span className="border-line text-muted inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[12px]">
          <Sprout size={12} aria-hidden /> Pasture verified
        </span>
      )}
      {product.liveCultures && (
        <span className="border-line text-muted inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[12px]">
          <Microscope size={12} aria-hidden /> Live cultures
        </span>
      )}
    </>
  )
}

/** One-line certification detail used on cards and the detail page. */
export function certLine(product: Product): string {
  const c = product.certification
  if (isVerifiedOrganic(product)) return `Certified organic · control body ${c.controlBody}`
  if (c.status === 'wild') return 'Wild-caught · not eligible for organic certification'
  return 'Conventional · not organic certified'
}
