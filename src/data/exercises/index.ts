import { ATHLETIC } from './athletic'
import { LOWER } from './lower'
import type { Exercise } from './types'
import { UPPER } from './upper'

export * from './types'

/** Global exercise library (seeded into public.exercises with owner_id = null). */
export const EXERCISES: Exercise[] = [...UPPER, ...LOWER, ...ATHLETIC]
export const EXERCISE_BY_SLUG: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.slug, e]),
)

/** Default instructions shown with every exercise; the specific cue/mistake follow. */
export const GENERIC_STEPS = {
  cs: [
    'Rozcvič se: 1–2 lehké série s nižší váhou.',
    'Nastav pozici a zpevni trup.',
    'Proveď opakování kontrolovaně v plném rozsahu, který zvládneš bez bolesti.',
    'Dýchej: výdech v nejnáročnější fázi.',
  ],
  en: [
    'Warm up with 1–2 lighter sets.',
    'Set up your position and brace your trunk.',
    'Perform controlled reps through the full pain-free range you own.',
    'Breathe out during the hardest part of the rep.',
  ],
}
