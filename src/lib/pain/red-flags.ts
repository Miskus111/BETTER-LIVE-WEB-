/**
 * Red-flag screening before ANY mobility/pain exercise plan. Based on common musculoskeletal triage
 * red flags (e.g. cauda equina, fracture, infection, malignancy, cardiac, neurological).
 * If any flag is present, no exercises are shown — only "see a doctor / call emergency services".
 */
export type Region =
  'neck' | 'shoulder' | 'upper_back' | 'lower_back' | 'hip' | 'knee' | 'ankle' | 'wrist_elbow'

export const RED_FLAGS = [
  'saddle_numbness', // numbness around genitals/buttocks/inner thighs
  'bladder_bowel', // new difficulty urinating, incontinence, bowel changes
  'progressive_weakness', // getting weaker, foot drop, dropping things
  'spreading_numbness', // numbness/tingling spreading or in both legs/arms
  'major_trauma', // fall from height, car accident, significant impact
  'fever_or_weight_loss', // fever, chills, unexplained weight loss, history of cancer
  'night_pain', // severe pain at night not eased by any position
  'chest_pain', // chest pain, pressure, pain into the jaw/left arm, shortness of breath
  'sudden_severe_headache', // "worst headache of my life", with neck stiffness or neuro symptoms
  'deformity_or_unable_to_bear_weight', // visible deformity, can't put weight on the leg
  'hot_swollen_joint', // red, hot, swollen joint with fever
  'calf_swelling', // one-sided swollen, warm, tender calf — possible deep-vein thrombosis
] as const
export type RedFlag = (typeof RED_FLAGS)[number]

/** Which red-flag questions are asked for each region (all regions get the general ones). */
const GENERAL: RedFlag[] = ['major_trauma', 'fever_or_weight_loss', 'night_pain', 'progressive_weakness']
export const FLAGS_BY_REGION: Record<Region, RedFlag[]> = {
  neck: [...GENERAL, 'sudden_severe_headache', 'spreading_numbness', 'chest_pain'],
  shoulder: [...GENERAL, 'chest_pain', 'hot_swollen_joint', 'deformity_or_unable_to_bear_weight'],
  upper_back: [...GENERAL, 'chest_pain', 'spreading_numbness'],
  lower_back: [...GENERAL, 'saddle_numbness', 'bladder_bowel', 'spreading_numbness'],
  hip: [...GENERAL, 'hot_swollen_joint', 'deformity_or_unable_to_bear_weight'],
  knee: [...GENERAL, 'hot_swollen_joint', 'deformity_or_unable_to_bear_weight', 'calf_swelling'],
  ankle: [...GENERAL, 'hot_swollen_joint', 'deformity_or_unable_to_bear_weight', 'calf_swelling'],
  wrist_elbow: [...GENERAL, 'hot_swollen_joint', 'deformity_or_unable_to_bear_weight', 'spreading_numbness'],
}

/** Flags that need emergency services now rather than a doctor's appointment. */
const EMERGENCY: RedFlag[] = ['saddle_numbness', 'bladder_bowel', 'chest_pain', 'sudden_severe_headache']

export type Triage =
  | { action: 'emergency'; flags: RedFlag[] }
  | { action: 'doctor'; flags: RedFlag[] }
  | { action: 'exercise'; flags: [] }

/** The gate: exercises are allowed only when no red flag was answered "yes". */
export function triage(answers: Partial<Record<RedFlag, boolean>>): Triage {
  const flags = RED_FLAGS.filter((f) => answers[f] === true)
  if (flags.some((f) => EMERGENCY.includes(f))) return { action: 'emergency', flags }
  if (flags.length) return { action: 'doctor', flags }
  return { action: 'exercise', flags: [] }
}

/** Pain 0–10 trend: average of the latest reports vs the earliest (up to 3 each, never overlapping; negative = improving). */
export function painTrend(scores: number[]): number | null {
  if (scores.length < 4) return null
  const n = Math.min(3, Math.floor(scores.length / 2))
  const avg = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length
  return Math.round((avg(scores.slice(-n)) - avg(scores.slice(0, n))) * 10) / 10
}

/**
 * Progression rule for the exercise plan (traffic-light approach used in physio-led loading programmes):
 * pain during exercise ≤ 3/10 and back to baseline by the next morning → progress; 4–5 → stay;
 * > 5 or worse next day → step back.
 */
export function nextStep(painDuring: number, worseNextDay: boolean): 'progress' | 'hold' | 'regress' {
  if (painDuring > 5 || worseNextDay) return 'regress'
  if (painDuring > 3) return 'hold'
  return 'progress'
}
