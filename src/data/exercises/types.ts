/** Muscle ids — mapped to regions of the anatomy model for the weekly heat-map. */
export const MUSCLES = [
  'chest',
  'front_delts',
  'side_delts',
  'rear_delts',
  'triceps',
  'biceps',
  'forearms',
  'lats',
  'upper_back',
  'traps',
  'lower_back',
  'abs',
  'obliques',
  'glutes',
  'quads',
  'hamstrings',
  'adductors',
  'abductors',
  'calves',
  'hip_flexors',
  'neck',
] as const
export type Muscle = (typeof MUSCLES)[number]

export const EQUIPMENT_KINDS = [
  'barbell',
  'dumbbell',
  'kettlebell',
  'cable',
  'machine',
  'bodyweight',
  'band',
  'pullup_bar',
  'bench',
  'smith',
  'ez_bar',
  'trap_bar',
  'sled',
  'medicine_ball',
  'suspension',
  'cardio_machine',
  'box',
  'landmine',
] as const
export type Equipment = (typeof EQUIPMENT_KINDS)[number]

export type Category =
  | 'push'
  | 'pull'
  | 'legs'
  | 'hinge'
  | 'core'
  | 'full_body'
  | 'olympic'
  | 'carry'
  | 'conditioning'
  | 'plyometric'

export type Bilingual = { cs: string; en: string }

export interface Exercise {
  slug: string
  name: Bilingual
  category: Category
  primary: Muscle[]
  secondary: Muscle[]
  equipment: Equipment[]
  /** key technique cue */
  cue: Bilingual
  /** most common mistake */
  mistake: Bilingual
  regressions: string[]
  progressions: string[]
  unilateral?: boolean
}
