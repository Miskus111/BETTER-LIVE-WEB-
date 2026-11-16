import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/cart/CheckoutForm'

export const metadata: Metadata = { title: 'Checkout (demo)', robots: { index: false } }

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-10 md:px-8">
      <p className="eyebrow">Demo · no payment</p>
      <h1 className="display mt-2 mb-8 text-[48px]">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
