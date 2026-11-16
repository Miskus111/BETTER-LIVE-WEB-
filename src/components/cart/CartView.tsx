'use client'

import Link from 'next/link'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useCartTotals } from '@/lib/store/useCartTotals'
import { useHydrated } from '@/lib/useHydrated'
import { eur } from '@/lib/format'
import { Thumb } from '@/components/ui/Thumb'
import { QuantitySelector } from '@/components/shop/QuantitySelector'
import { CertBadge } from '@/components/shop/CertBadge'
import { ShippingProgress } from './ShippingProgress'
import { OrderSummary } from './OrderSummary'

export function CartView() {
  const hydrated = useHydrated()
  const { items, subtotal, shipping, total, count } = useCartTotals()
  const { setQty, remove, clear } = useCart()

  if (!hydrated) return <div className="h-64" aria-busy="true" />

  if (!items.length)
    return (
      <div className="card flex flex-col items-center p-12 text-center">
        <ShoppingBag size={28} className="text-subtle" aria-hidden />
        <p className="mt-4 text-[17px]">Your cart is empty.</p>
        <p className="text-muted mt-1">Start from an organ, a food — or browse the store.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">
            Browse the store
          </Link>
          <Link href="/#body" className="btn btn-ghost">
            Explore the body
          </Link>
        </div>
      </div>
    )

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section aria-label="Cart items">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-subtle font-mono text-[13px]">
            {count} item{count === 1 ? '' : 's'}
          </p>
          <button
            type="button"
            onClick={clear}
            className="text-muted hover:text-fg text-[13.5px] underline-offset-4 hover:underline"
          >
            Clear cart
          </button>
        </div>
        <ul className="divide-line border-line divide-y border-y" data-testid="cart-lines">
          {items.map(({ id, qty, product: p }) => (
            <li key={id} className="flex gap-4 py-4">
              <Link href={`/product/${id}`} className="w-20 shrink-0 overflow-hidden rounded-xl sm:w-24">
                <Thumb src={p.images[0]} alt={p.name} ratio="aspect-square" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/product/${id}`} className="hover:text-cyan text-[15.5px] font-medium">
                      {p.name}
                    </Link>
                    <p className="text-subtle text-[13px]">
                      {p.size} · {eur(p.price)} each
                    </p>
                  </div>
                  <span className="font-mono text-[15px]">{eur(p.price * qty)}</span>
                </div>
                <div>
                  <CertBadge product={p} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <QuantitySelector
                    value={qty}
                    onChange={(n) => setQty(id, n)}
                    label={`Quantity of ${p.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(id)}
                    className="text-muted inline-flex items-center gap-1.5 text-[13.5px] hover:text-[#ff9b9b]"
                    aria-label={`Remove ${p.name}`}
                  >
                    <Trash2 size={14} aria-hidden /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="card h-fit p-5 lg:sticky lg:top-20" aria-label="Order summary">
        <ShippingProgress subtotal={subtotal} />
        <div className="mt-5">
          <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
        </div>
        <Link href="/checkout" className="btn btn-primary mt-5 w-full" data-testid="to-checkout">
          Checkout
        </Link>
        <p className="text-subtle mt-3 text-center text-[12.5px]">Demo checkout — no payment is taken.</p>
      </aside>
    </div>
  )
}
