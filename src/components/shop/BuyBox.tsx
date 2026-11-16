'use client'

import { useState } from 'react'
import { czk } from '@/lib/format'
import { FREE_SHIPPING_FROM } from '@/lib/commerce/pricing'
import { AddToCartButton } from './AddToCartButton'
import { QuantitySelector } from './QuantitySelector'

export function BuyBox({ id, price }: { id: string; price: number }) {
  const [qty, setQty] = useState(1)
  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[28px]">{czk(price)}</span>
        <span className="text-subtle text-[13px]">vč. DPH · ukázková cena</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <QuantitySelector value={qty} onChange={setQty} />
        <AddToCartButton
          id={id}
          qty={qty}
          label={qty > 1 ? `Přidat ${qty} ks · ${czk(price * qty)}` : 'Do košíku'}
          className="flex-1"
        />
      </div>
      <p className="text-subtle mt-3 text-[13px]">
        Doprava zdarma od {czk(FREE_SHIPPING_FROM)}. Ukázkový obchod — nic se neplatí.
      </p>
    </div>
  )
}
