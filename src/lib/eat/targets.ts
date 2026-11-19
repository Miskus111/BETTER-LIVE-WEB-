/**
 * Energy and macro targets. Mifflin-St Jeor (1990) BMR × activity factor = TDEE.
 * Safety: plans never go below the estimated BMR without medical supervision, weight loss is capped
 * at ~0.75 % of body weight per week, and protein/fat have minimums.
 */
export type Sex = 'female' | 'male'
export type GoalKey =
  'fat_loss' | 'muscle' | 'performance' | 'health' | 'longevity' | 'pain_relief' | 'appearance'

export function bmrMifflin(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return Math.round(sex === 'male' ? base + 5 : base - 161)
}

export const ACTIVITY = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, extra: 1.9 } as const
export type ActivityLevel = keyof typeof ACTIVITY

/** Activity level from training days and work pattern (onboarding answers). */
export function activityLevel(
  trainingDays: number,
  work: 'desk' | 'standing' | 'physical' | 'shift' | null,
): ActivityLevel {
  let score =
    trainingDays <= 0 ? 0 : trainingDays <= 2 ? 1 : trainingDays <= 4 ? 2 : trainingDays <= 6 ? 3 : 4
  if (work === 'physical') score += 1
  if (work === 'standing') score += 0.5
  const levels: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'very', 'extra']
  return levels[Math.min(4, Math.round(score))]
}

export const tdee = (bmr: number, level: ActivityLevel) => Math.round(bmr * ACTIVITY[level])

export interface Targets {
  kcal: number
  proteinG: number
  fatG: number
  carbsG: number
  fiberG: number
  /** true when the requested deficit was limited by a safety rule */
  limited: boolean
  rule?: 'bmr_floor' | 'max_rate'
}

/** Never below BMR; deficit also capped so expected loss ≤ 0.75 % body weight / week (7 700 kcal ≈ 1 kg). */
export function safeKcal(
  requested: number,
  bmr: number,
  tdeeKcal: number,
  weightKg: number,
): { kcal: number; rule?: Targets['rule'] } {
  const maxDailyDeficit = (weightKg * 0.0075 * 7700) / 7
  let kcal = requested
  let rule: Targets['rule']
  if (tdeeKcal - kcal > maxDailyDeficit) {
    kcal = Math.round(tdeeKcal - maxDailyDeficit)
    rule = 'max_rate'
  }
  if (kcal < bmr) {
    kcal = bmr
    rule = 'bmr_floor'
  }
  return { kcal: Math.round(kcal), rule }
}

const PROTEIN_G_PER_KG: Partial<Record<GoalKey, number>> = { fat_loss: 2.0, muscle: 1.8, performance: 1.6 }

/** Targets for the user's primary goal. */
export function targetsFor(opts: {
  sex: Sex
  weightKg: number
  heightCm: number
  age: number
  level: ActivityLevel
  goal: GoalKey
}): Targets & { bmr: number; tdee: number } {
  const bmr = bmrMifflin(opts.sex, opts.weightKg, opts.heightCm, opts.age)
  const t = tdee(bmr, opts.level)
  const requested = opts.goal === 'fat_loss' ? t * 0.8 : opts.goal === 'muscle' ? t * 1.1 : t
  const { kcal, rule } = safeKcal(requested, bmr, t, opts.weightKg)
  // with obesity (BMI > 30) per-kg targets use an adjusted weight: the weight at BMI 25 plus a quarter
  // of the excess — otherwise protein and the fat floor alone would fill most of the plan
  const h2 = (opts.heightCm / 100) ** 2
  const refWeight =
    bmi(opts.weightKg, opts.heightCm) > 30 ? 25 * h2 + 0.25 * (opts.weightKg - 25 * h2) : opts.weightKg
  const proteinG = Math.round(Math.min(2.2, PROTEIN_G_PER_KG[opts.goal] ?? 1.2) * refWeight)
  const fatG = Math.round(Math.max(0.6 * refWeight, (kcal * 0.28) / 9))
  const carbsG = Math.max(0, Math.round((kcal - proteinG * 4 - fatG * 9) / 4))
  const fiberG = Math.max(25, Math.round((kcal / 1000) * 14))
  return { bmr, tdee: t, kcal, proteinG, fatG, carbsG, fiberG, limited: !!rule, rule }
}

/** Full years from an ISO birth date. */
export function ageFrom(birthDate: string, today = new Date()) {
  const [y, m, d] = birthDate.split('-').map(Number)
  let a = today.getFullYear() - y
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) a--
  return a
}

export const bmi = (weightKg: number, heightCm: number) =>
  Math.round((weightKg / (heightCm / 100) ** 2) * 10) / 10

/**
 * Eating-disorder safeguard. If any signal is present, plan generation stops and supportive
 * resources are shown instead (no numbers, no deficits).
 */
export function eatingRiskSignals(input: {
  weightKg: number
  heightCm: number
  goals: string[]
  requestedKcal?: number
  bmr?: number
  answers?: {
    compensatory?: boolean
    bingeLossOfControl?: boolean
    intenseFearOfGain?: boolean
    skippedMealsToLose?: boolean
  }
}): string[] {
  const s: string[] = []
  const b = bmi(input.weightKg, input.heightCm)
  if (b < 18.5 && input.goals.includes('fat_loss')) s.push('low_bmi_weight_loss')
  if (input.requestedKcal !== undefined && input.bmr !== undefined && input.requestedKcal < input.bmr * 0.85)
    s.push('very_low_intake')
  const a = input.answers ?? {}
  if (a.compensatory) s.push('compensatory_behaviour')
  if (a.bingeLossOfControl) s.push('loss_of_control')
  if (a.intenseFearOfGain) s.push('fear_of_weight_gain')
  if (a.skippedMealsToLose) s.push('restriction')
  return s
}
