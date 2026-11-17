import { COMPOUNDS, COMPOUND_BY_SLUG } from '@/data/compounds'
import { NUTRIENTS } from '@/data/nutrients'
import { SUPPLEMENT_NUTRIENTS, SUPPLEMENT_SLUGS, nutrientBySlug } from '@/data/supplements'
import { OG_SIZE, ogCard } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Doplňky stravy podle důkazů'

export function generateStaticParams() {
  return [
    ...SUPPLEMENT_NUTRIENTS.filter((id) => SUPPLEMENT_SLUGS[id]).map((id) => ({
      slug: SUPPLEMENT_SLUGS[id]!,
    })),
    ...COMPOUNDS.map((c) => ({ slug: c.slug })),
  ]
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const c = COMPOUND_BY_SLUG[slug]
  if (c) return ogCard({ eyebrow: 'Doplňky stravy', title: c.name, subtitle: c.verdict })
  const id = nutrientBySlug(slug)
  const n = id ? NUTRIENTS[id] : undefined
  return ogCard({
    eyebrow: 'Doplňky stravy',
    title: n ? `${n.name}: kterou formu vybrat` : 'Doplňky stravy',
    subtitle: n?.blurb,
  })
}
