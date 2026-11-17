import { BODY_GUIDES, BODY_GUIDE_BY_SLUG } from '@/data/body-guides'
import { OG_SIZE, ogCard } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Průvodce: jak funguje tělo'

export function generateStaticParams() {
  return BODY_GUIDES.map((g) => ({ slug: g.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const g = BODY_GUIDE_BY_SLUG[(await params).slug]
  return ogCard({ eyebrow: 'Jak funguje tělo', title: g?.title ?? 'Jak funguje tělo', subtitle: g?.hook })
}
