import { FOODS, FOOD_BY_ID } from '@/data/foods'
import { foodSummary } from '@/lib/foods/summary'
import { OG_SIZE, ogCard } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Nutriční hodnoty potraviny na 100 g'

export function generateStaticParams() {
  return FOODS.map((f) => ({ id: f.id }))
}

/** Share card: name, energy and protein per 100 g, and the first line of "V kostce" (EU claim thresholds). */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const f = FOOD_BY_ID[(await params).id]
  if (!f) return ogCard({ eyebrow: 'Potraviny', title: 'Nutriční hodnoty na 100 g' })
  const unit = f.liquid ? '100 ml' : '100 g'
  const fmt = (v: number) => v.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })
  const highlight = foodSummary(f).find((l) => l.startsWith('Vysoký obsah:')) ?? foodSummary(f)[0]
  return ogCard({
    eyebrow: `Potraviny · ${f.category}`,
    title: f.name,
    subtitle: `${fmt(f.kcal)} kcal · ${fmt(f.macros.protein)} g bílkovin na ${unit}${highlight ? ` — ${highlight}` : ''}`,
  })
}
