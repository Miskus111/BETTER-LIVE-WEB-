import { OG_SIZE, ogCard } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Mýtus, nebo fakt? Kvíz o těle'

export default function Image() {
  return ogCard({
    eyebrow: 'Kvíz',
    title: 'Mýtus, nebo fakt?',
    subtitle: 'Dehydratuje káva? Mění se svaly v tuk? Otestujte se — 10 otázek s vysvětlením.',
  })
}
