import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ShopView } from '@/components/shop/ShopView'
import { SampleDataLabel } from '@/components/layout/SampleDataLabel'

export const metadata: Metadata = {
  title: 'Obchod — bio potraviny pro každý orgán',
  description:
    'Certifikované bio mléčné výrobky, vejce, maso, ryby, zelenina, ořechy a fermentované potraviny — u každého produktu certifikace, kontrolní subjekt, původ a zpracování.',
  alternates: { canonical: '/shop' },
}

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 md:px-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Obchod FLX</p>
          <h1 className="display mt-3 text-[48px] md:text-[64px]">Nejdřív bio. Vždy podle důkazů.</h1>
          <p className="text-muted mt-3 text-[15px]">
            Certifikované bio EU všude, kde certifikace existuje. Divoké ryby a výrobky, které certifikovat
            nelze, označujeme přesně tím, čím jsou.
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
