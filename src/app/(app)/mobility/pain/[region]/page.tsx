import { notFound } from 'next/navigation'
import { FLAGS_BY_REGION, type Region } from '@/lib/pain/red-flags'
import { PainFlow } from '@/components/mobility/PainFlow'

export default async function PainRegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params
  if (!(region in FLAGS_BY_REGION)) notFound()
  return <PainFlow region={region as Region} />
}
