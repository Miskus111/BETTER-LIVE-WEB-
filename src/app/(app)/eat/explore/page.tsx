import { FoodExplorer } from '@/components/food/FoodExplorer'
import { NutrientIndex } from '@/components/home/NutrientIndex'

export default function ExplorePage() {
  return (
    <div className="space-y-14">
      <section id="foods" aria-label="Průvodce potravinami">
        <FoodExplorer />
      </section>
      <section id="nutrients" aria-label="Nutrients">
        <NutrientIndex />
      </section>
    </div>
  )
}
