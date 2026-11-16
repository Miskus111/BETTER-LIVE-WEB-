import { notFound } from 'next/navigation'
import { ROUTINES } from '@/data/mobility'
import { RoutinePlayer } from '@/components/mobility/RoutinePlayer'

export default async function RoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const routine = ROUTINES.find((r) => r.id === id)
  if (!routine) notFound()
  return <RoutinePlayer routine={routine} />
}
