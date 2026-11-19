import { z } from 'zod'
import { ageFrom } from '@/lib/eat/targets'
import { ALLERGIES, BUDGETS, DIETS, EQUIPMENT, EXPERIENCE, GOALS, PAIN_AREAS, SPORTS, WORK } from './options'

/** Full years between a birth date (YYYY-MM-DD) and `today` — one implementation shared with the
 * nutrition targets, so the 18+ gate and calorie maths always agree on age. */
export const ageOn = ageFrom

export const isAdult = (birthDate: string, today = new Date()) => ageOn(birthDate, today) >= 18

/** Splits "a, b ,c" into trimmed, de-duplicated, non-empty items (max 30, 40 chars each). */
export const csvList = z
  .string()
  .max(600)
  .transform((s) =>
    [
      ...new Set(
        s
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    ]
      .slice(0, 30)
      .map((x) => x.slice(0, 40)),
  )

export const aboutSchema = z.object({
  displayName: z.string().trim().min(1).max(60),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((v) => ageOn(v) <= 110, 'invalid')
    .refine((v) => isAdult(v), 'underage'),
  sex: z.enum(['female', 'male']),
  heightCm: z.coerce.number().min(120).max(250),
  weightKg: z.coerce.number().min(30).max(300),
  adultConfirmed: z.literal(true),
})

export const goalsSchema = z.object({ goals: z.array(z.enum(GOALS)).min(1) })

export const sportSchema = z.object({
  sports: z.array(z.enum(SPORTS)).min(1),
  experience: z.enum(EXPERIENCE),
})

export const trainingSchema = z.object({
  trainingDays: z.coerce.number().int().min(0).max(7),
  sessionMinutes: z.coerce.number().int().min(10).max(240),
  equipment: z.array(z.enum(EQUIPMENT)).min(1),
})

export const dietSchema = z.object({
  dietType: z.enum(DIETS),
  allergies: z.array(z.enum(ALLERGIES)),
  allergiesOther: csvList,
  dislikes: csvList,
  budget: z.enum(BUDGETS),
})

export const healthSchema = z.object({
  painAreas: z.array(z.enum(PAIN_AREAS)),
  medications: z.string().trim().max(1000),
  sleepHours: z.coerce.number().min(0).max(16),
  workPattern: z.enum(WORK),
})

export const consentSchema = z.object({
  healthData: z.literal(true),
  terms: z.literal(true),
})

export const onboardingSchema = aboutSchema
  .merge(goalsSchema)
  .merge(sportSchema)
  .merge(trainingSchema)
  .merge(dietSchema)
  .merge(healthSchema)
  .merge(consentSchema)

export type OnboardingInput = z.input<typeof onboardingSchema>
export type Onboarding = z.output<typeof onboardingSchema>

/** Pain areas: "none" is exclusive. */
export const normalisePain = (areas: string[]) => (areas.includes('none') ? [] : areas)
