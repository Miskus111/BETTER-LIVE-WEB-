import { getTranslations } from 'next-intl/server'
import { FoodExplorer } from '@/components/food/FoodExplorer'
import { NutrientIndex } from '@/components/home/NutrientIndex'

export default async function EatPage() {
  const t = await getTranslations('nav')
  return (
    <div className="space-y-14">
      <header>
        <h1 className="display text-[44px] md:text-[56px]">{t('eat')}</h1>
      </header>
      <section id="foods" aria-label="Food explorer">
        <FoodExplorer />
      </section>
      <section id="nutrients" aria-label="Nutrients">
        <NutrientIndex />
      </section>
    </div>
  )
}
