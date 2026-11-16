import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { FOOD_BY_ID, FOODS } from '@/data/foods'
import { FoodDetail } from '@/components/food/FoodDetail'

type Params = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return FOODS.map((f) => ({ id: f.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const f = FOOD_BY_ID[id]
  if (!f) return {}
  const title = `${f.name} — nutrition per 100 g`
  const description = `${f.name} (${f.basis}): ${f.kcal} kcal, ${f.macros.protein} g protein per 100 g. Vitamins, minerals and the organs they support.`
  return {
    title,
    description,
    alternates: { canonical: `/food/${f.id}` },
    openGraph: { title, description, url: `/food/${f.id}` },
  }
}

export default async function FoodPage({ params }: Params) {
  const { id } = await params
  const food = FOOD_BY_ID[id]
  if (!food) notFound()
  const i = FOODS.indexOf(food)
  const prev = FOODS[(i - 1 + FOODS.length) % FOODS.length]
  const next = FOODS[(i + 1) % FOODS.length]
  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 md:px-8">
      <Link href="/#foods" className="link inline-flex items-center gap-1 text-[14px]">
        <ChevronLeft size={15} aria-hidden /> Food explorer
      </Link>
      <div className="card mt-5 p-5 md:p-8">
        <FoodDetail food={food} headingLevel="h1" />
      </div>
      <nav className="mt-6 flex justify-between gap-4 text-[14.5px]" aria-label="More foods">
        <Link href={`/food/${prev.id}`} className="link">
          ← {prev.name}
        </Link>
        <Link href={`/food/${next.id}`} className="link">
          {next.name} →
        </Link>
      </nav>
    </div>
  )
}
