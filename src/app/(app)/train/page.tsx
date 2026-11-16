import { TrainHome } from '@/components/train/TrainHome'

export default async function TrainPage({ searchParams }: { searchParams: Promise<{ finished?: string }> }) {
  const { finished } = await searchParams
  return <TrainHome finished={finished === '1'} />
}
