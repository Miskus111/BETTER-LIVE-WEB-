'use client'

import { useState } from 'react'
import { eur } from '@/lib/format'
import { FREE_SHIPPING_FROM } from '@/lib/commerce/pricing'
import { AddToCartButton } from './AddToCartButton'
import { QuantitySelector } from './QuantitySelector'

export function BuyBox({ id, price }: { id: string; price: number }) {
  const [qty, setQty] = useState(1)
  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[28px]">{eur(price)}</span>
        <span className="text-subtle text-[13px]">incl. VAT · sample price</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <QuantitySelector value={qty} onChange={setQty} />
        <AddToCartButton
          id={id}
          qty={qty}
          label={qty > 1 ? `Add ${qty} to cart · ${eur(price * qty)}` : 'Add to cart'}
          className="flex-1"
        />
      </div>
      <p className="text-subtle mt-3 text-[13px]">
        Free shipping from {eur(FREE_SHIPPING_FROM)}. Demo store — no payment is taken.
      </p>
    </div>
  )
}
