import type { Metadata } from 'next'
import { CartView } from '@/components/cart/CartView'

export const metadata: Metadata = { title: 'Košík', robots: { index: false } }

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-10 md:px-8">
      <h1 className="display mb-8 text-[48px]">Košík</h1>
      <CartView />
    </div>
  )
}
