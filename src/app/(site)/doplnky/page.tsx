import type { Metadata } from 'next'
import { SupplementsGuide } from '@/components/supplements/SupplementsGuide'

export const metadata: Metadata = {
  title: 'Doplňky stravy — vstřebatelnost, dávky a referenční hodnoty',
  description:
    'Které formy vitamínů a minerálů se vstřebávají nejlépe, kolik jich doporučuje EFSA, jaké jsou bezpečné horní limity a kde je koupit.',
  alternates: { canonical: '/doplnky' },
}

export default function SupplementsPage() {
  return <SupplementsGuide />
}
