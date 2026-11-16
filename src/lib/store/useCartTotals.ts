'use client'
import { useMemo } from 'react'
import { PRODUCT_BY_ID } from '@/data/products'
import { commerce } from '@/lib/commerce'
import { useCart } from './cart'

/** Cart lines joined with product data, plus totals from the commerce provider. */
export function useCartTotals() {
  const lines = useCart((s) => s.lines)
  return useMemo(() => {
    const items = lines.map((l) => ({ ...l, product: PRODUCT_BY_ID[l.id] })).filter((x) => x.product)
    const quote = commerce.quote(
      items.map((i) => ({ productId: i.id, qty: i.qty, unitPrice: i.product.price })),
    )
    return { items, ...quote, count: items.reduce((s, i) => s + i.qty, 0) }
  }, [lines])
}
