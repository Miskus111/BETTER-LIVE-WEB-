import 'server-only'
import { activityLevel, ageFrom, eatingRiskSignals, targetsFor, type GoalKey } from './targets'

type Profile = {
  sex: 'female' | 'male' | null
  weight_kg: number | null
  height_cm: number | null
  birth_date: string | null
}
type Prefs = {
  training_days: number | null
  work_pattern: 'desk' | 'standing' | 'physical' | 'shift' | null
} | null

/** Daily targets for the signed-in user, or a reason why none are shown. */
export function profileTargets(p: Profile | null, prefs: Prefs, goals: string[]) {
  if (!p?.sex || !p.weight_kg || !p.height_cm || !p.birth_date) return { status: 'incomplete' as const }
  const weightKg = Number(p.weight_kg)
  const heightCm = Number(p.height_cm)
  const risk = eatingRiskSignals({ weightKg, heightCm, goals })
  if (risk.length) return { status: 'support' as const, risk }
  const primary = (['fat_loss', 'muscle', 'performance'].find((g) => goals.includes(g)) ??
    'health') as GoalKey
  const t = targetsFor({
    sex: p.sex,
    weightKg,
    heightCm,
    age: ageFrom(p.birth_date),
    level: activityLevel(prefs?.training_days ?? 0, prefs?.work_pattern ?? null),
    goal: primary,
  })
  return { status: 'ok' as const, targets: t, goal: primary }
}
