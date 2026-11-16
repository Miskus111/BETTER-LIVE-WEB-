import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ShopView } from '@/components/shop/ShopView'
import { SampleDataLabel } from '@/components/layout/SampleDataLabel'

export const metadata: Metadata = {
  title: 'Shop — organic food for every organ',
  description:
    'Certified EU organic dairy, eggs, meat, fish, vegetables, nuts and fermented foods — every product labelled with its certification, control body, origin and processing.',
  alternates: { canonical: '/shop' },
}

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 md:px-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">The FLX store</p>
          <h1 className="display mt-3 text-[48px] md:text-[64px]">Organic first. Evidence always.</h1>
          <p className="text-muted mt-3 text-[15px]">
            Certified EU organic wherever certification exists. Wild fish and products that cannot be
            certified are labelled exactly as what they are.
          </p>
        </div>
        <SampleDataLabel />
      </header>
      <Suspense fallback={<div className="h-96" />}>
        <ShopView />
      </Suspense>
    </div>
  )
}
