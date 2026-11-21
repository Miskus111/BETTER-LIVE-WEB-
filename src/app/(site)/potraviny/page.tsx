import type { Metadata } from 'next'
import { FoodExplorer } from '@/components/food/FoodExplorer'
import { FOODS } from '@/data/foods'

export const metadata: Metadata = {
  title: 'Potraviny — co obsahuje 100 gramů',
  description: `Makroživiny, podíl energie, vitamíny a minerály v % referenční hodnoty EU u ${FOODS.length} potravin z dat USDA. Hledání bez diakritiky, filtry a porovnání.`,
  alternates: { canonical: '/potraviny' },
}

/** The full food explorer on its own page, so the homepage doesn't carry all foods in its HTML and JavaScript. */
export default function FoodsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-20 md:px-8 md:pt-14">
      <p className="eyebrow">Průvodce potravinami</p>
      <h1 className="display mt-3 text-[44px] md:text-[64px]">Co doopravdy obsahuje 100 gramů.</h1>
      <p className="text-muted mt-3 max-w-2xl text-[16px]">
        Makroživiny, podíl energie a vitamíny a minerály v % referenční hodnoty EU — a pro které orgány je
        potravina relevantní. {FOODS.length} potravin z dat USDA FoodData Central.
      </p>
      <div id="foods" className="mt-10 scroll-mt-16">
        <FoodExplorer />
      </div>
    </div>
  )
}
