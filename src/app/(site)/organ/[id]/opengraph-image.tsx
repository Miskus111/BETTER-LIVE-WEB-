import { ORGANS, ORGAN_BY_ID } from '@/data/organs'
import type { OrganId } from '@/data/types'
import { OG_SIZE, ogCard } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Orgán: co dělá a které živiny potřebuje'

export function generateStaticParams() {
  return ORGANS.map((o) => ({ id: o.id }))
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const o = ORGAN_BY_ID[(await params).id as OrganId]
  if (!o) return ogCard({ eyebrow: 'Tělo', title: 'Vaše tělo, rozluštěné.' })
  return ogCard({ eyebrow: 'Tělo × výživa', title: `${o.shortName} — funkce a výživa`, subtitle: o.what })
}
