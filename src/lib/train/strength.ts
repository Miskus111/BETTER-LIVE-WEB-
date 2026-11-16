/**
 * Strength maths for the workout logger. All weights in kg internally.
 * References: Epley (1985) and Brzycki (1993) one-rep-max estimates.
 */

/** Epley: 1RM = w × (1 + reps/30). Exact for a single rep. */
export function epley(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0
  if (reps === 1) return weight
  return weight * (1 + reps / 30)
}

/** Brzycki: 1RM = w × 36 / (37 − reps). Undefined at 37+ reps; capped for stability. */
export function brzycki(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0
  if (reps === 1) return weight
  if (reps >= 37) return epley(weight, reps)
  return (weight * 36) / (37 - reps)
}

/**
 * Estimated 1RM used across the app: average of Epley and Brzycki for 1–10 reps; above 10 reps the
 * estimates get unreliable, so only Epley is used and the result is flagged as less precise.
 */
export function estimate1RM(weight: number, reps: number): { value: number; precise: boolean } {
  if (weight <= 0 || reps <= 0) return { value: 0, precise: false }
  if (reps <= 10) return { value: round((epley(weight, reps) + brzycki(weight, reps)) / 2, 1), precise: true }
  return { value: round(epley(weight, reps), 1), precise: false }
}

export const round = (v: number, digits = 1) => Math.round(v * 10 ** digits) / 10 ** digits

export const KG_PER_LB = 0.45359237
export const toLb = (kg: number) => round(kg / KG_PER_LB, 1)
export const toKg = (lb: number) => round(lb * KG_PER_LB, 2)

/**
 * Plate calculator: plates per side to reach `target` on a bar. Greedy with the available plate set
 * (pairs assumed). Returns the plates and the weight actually reachable if the target can't be hit exactly.
 */
export function platesPerSide(
  target: number,
  bar = 20,
  available: number[] = [25, 20, 15, 10, 5, 2.5, 1.25],
): { plates: number[]; achieved: number; remainder: number } {
  if (target <= bar) return { plates: [], achieved: bar, remainder: round(target - bar, 2) }
  let perSide = round((target - bar) / 2, 3)
  const plates: number[] = []
  for (const p of [...available].sort((a, b) => b - a)) {
    while (perSide + 1e-9 >= p) {
      plates.push(p)
      perSide = round(perSide - p, 3)
    }
  }
  const achieved = round(bar + 2 * plates.reduce((s, p) => s + p, 0), 2)
  return { plates, achieved, remainder: round(target - achieved, 2) }
}

export type SetType = 'warmup' | 'normal' | 'drop' | 'failure'

export interface LoggedSet {
  exercise: string
  weightKg: number
  reps: number
  type: SetType
  completed: boolean
}

/** Working sets only: completed, not warm-up, with reps. */
export const isWorkingSet = (s: LoggedSet) => s.completed && s.type !== 'warmup' && s.reps > 0

/** Volume load = Σ weight × reps over working sets. */
export const volume = (sets: LoggedSet[]) =>
  round(
    sets.filter(isWorkingSet).reduce((v, s) => v + s.weightKg * s.reps, 0),
    1,
  )

/**
 * Weekly hard sets per muscle: each working set counts 1 for every primary muscle and 0.5 for every
 * secondary muscle (a common convention in training-volume research).
 */
export function setsPerMuscle(
  sets: LoggedSet[],
  muscles: (exercise: string) => { primary: string[]; secondary: string[] } | undefined,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const s of sets.filter(isWorkingSet)) {
    const m = muscles(s.exercise)
    if (!m) continue
    for (const p of m.primary) out[p] = (out[p] ?? 0) + 1
    for (const p of m.secondary) out[p] = (out[p] ?? 0) + 0.5
  }
  return out
}

export interface PRs {
  e1rm: number
  maxWeight: number
  maxReps: number
  maxVolume: number
}

/** Best values for one exercise over a list of sets (working sets only). */
export function personalRecords(sets: LoggedSet[]): PRs {
  const w = sets.filter(isWorkingSet)
  return {
    e1rm: Math.max(0, ...w.map((s) => estimate1RM(s.weightKg, s.reps).value)),
    maxWeight: Math.max(0, ...w.map((s) => s.weightKg)),
    maxReps: Math.max(0, ...w.map((s) => s.reps)),
    maxVolume: Math.max(0, ...w.map((s) => s.weightKg * s.reps)),
  }
}

/** Which PR kinds a new set beats compared with previous bests. */
export function newRecords(prev: PRs, set: LoggedSet): (keyof PRs)[] {
  if (!isWorkingSet(set)) return []
  const next = personalRecords([set])
  return (Object.keys(next) as (keyof PRs)[]).filter((k) => next[k] > prev[k] && next[k] > 0)
}
