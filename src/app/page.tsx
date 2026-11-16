import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '@/data/products'
import { AnatomyExplorer } from '@/components/anatomy/AnatomyExplorer'
import { Section } from '@/components/home/Section'
import { NutrientIndex } from '@/components/home/NutrientIndex'
import { StorePreview } from '@/components/home/StorePreview'
import { ScienceTeaser } from '@/components/home/ScienceTeaser'
import { StandardTeaser } from '@/components/home/StandardTeaser'
import { FoodExplorer } from '@/components/food/FoodExplorer'
import { ProductCard } from '@/components/shop/ProductCard'
import { SampleDataLabel } from '@/components/layout/SampleDataLabel'

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4)
  return (
    <>
      <section id="body" aria-label="Interactive human body" className="relative scroll-mt-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(58,168,255,0.09),transparent_70%)]"
          aria-hidden
        />
        <div className="mx-auto max-w-[1440px] px-4 pt-6 md:px-8 lg:hidden">
          <p className="eyebrow">FLX · Body × Nutrition</p>
          <h1 className="display mt-2 text-[44px]">
            Your body, <em className="text-cyan">decoded.</em>
          </h1>
          <p className="text-muted mt-2 text-[15px]">Tap an organ to see what it needs — and why.</p>
        </div>
        <AnatomyExplorer />
      </section>

      <Section
        id="featured"
        eyebrow="Featured"
        title="Food, chosen like evidence."
        intro="A small range of certified organic and honestly labelled foods — each linked to the organs its nutrients support."
        aside={
          <div className="flex items-center gap-3">
            <SampleDataLabel />
            <Link href="/shop" className="btn btn-ghost">
              All products <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        }
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="nutrients"
        eyebrow="Nutrient index"
        title="25 nutrients, one honest map."
        intro="Reference values, EU-authorised claims, the organs in our model and the richest foods — per 100 g."
      >
        <NutrientIndex />
      </Section>

      <Section
        id="foods"
        eyebrow="Food explorer"
        title="What 100 grams really holds."
        intro="Macros, energy split and vitamins and minerals as % of the EU reference — and which organs each food is relevant to."
      >
        <FoodExplorer />
      </Section>

      <Section
        id="store"
        eyebrow="Store"
        title="Shop by what your body needs."
        intro="Browse by organ system. Every product shows its certification, control body, origin and processing."
      >
        <StorePreview />
      </Section>

      <Section id="science" eyebrow="Science" title="Four rules we never break.">
        <ScienceTeaser />
      </Section>

      <Section id="standard" eyebrow="Our standard" title="Organic first. Honest always.">
        <StandardTeaser />
      </Section>
    </>
  )
}
