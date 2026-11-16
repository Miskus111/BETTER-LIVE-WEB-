import { notFound } from 'next/navigation'
import { TrainHome } from '@/components/train/TrainHome'
import { WorkoutLogger } from '@/components/train/WorkoutLogger'
import { ExerciseLibrary } from '@/components/train/ExerciseLibrary'
import { PainFlow } from '@/components/mobility/PainFlow'
import { PainMap } from '@/components/mobility/PainMap'
import { RoutinePlayer } from '@/components/mobility/RoutinePlayer'
import { StackTracker } from '@/components/supplements/StackTracker'
import { FoodDiary } from '@/components/eat/FoodDiary'
import { TargetsCard } from '@/components/eat/TargetsCard'
import { SportForm } from '@/components/train/SportForm'
import { ROUTINES } from '@/data/mobility'
import { targetsFor } from '@/lib/eat/targets'

export const dynamic = 'force-dynamic'

export default async function Preview({ params }: { params: Promise<{ screen: string }> }) {
  if (process.env.ENABLE_PREVIEW !== '1') notFound()
  const { screen } = await params
  switch (screen) {
    case 'train':
      return <TrainHome finished={false} base="/preview" />
    case 'session':
      return <WorkoutLogger home="/preview/train" />
    case 'library':
      return <ExerciseLibrary />
    case 'sport':
      return <SportForm />
    case 'pain-map':
      return <PainMap latest={{ lower_back: 6, knee: 3 }} />
    case 'pain-lower-back':
      return <PainFlow region="lower_back" />
    case 'routine':
      return <RoutinePlayer routine={ROUTINES[0]} />
    case 'stack':
      return (
        <StackTracker
          medications="Warfarin"
          rows={[
            { id: 'a', slug: 'omega-3', dose_amount: 1000, timing: 'S večeří', reminder_time: '19:00:00', takenToday: true },
            { id: 'b', slug: 'vitamin-d3', dose_amount: 125, timing: 'Ráno', reminder_time: null, takenToday: false },
          ]}
        />
      )
    case 'eat': {
      const t = targetsFor({ sex: 'male', weightKg: 82, heightCm: 181, age: 32, level: 'moderate', goal: 'muscle' })
      return (
        <div className="space-y-6">
          <TargetsCard result={{ status: 'ok', targets: t }} totals={{ kcal: 1450, protein: 96, fat: 52, carbs: 150, fiber: 18 }} />
          <FoodDiary
            day="2026-11-16"
            rows={[
              { id: '1', meal: 'breakfast', title: 'Ovesné vločky|oats', grams: 80, kcal: 311, protein_g: 13.5, fat_g: 5.5, carbs_g: 53, fiber_g: 8.5 },
              { id: '2', meal: 'breakfast', title: 'Řecký jogurt|greek-yogurt', grams: 200, kcal: 194, protein_g: 18, fat_g: 10, carbs_g: 8, fiber_g: 0 },
              { id: '3', meal: 'lunch', title: 'Losos obecný|salmon', grams: 180, kcal: 374, protein_g: 36.7, fat_g: 24.1, carbs_g: 0, fiber_g: 0 },
            ]}
          />
        </div>
      )
    }
    default:
      notFound()
  }
}
