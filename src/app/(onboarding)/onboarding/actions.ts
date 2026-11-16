'use server'
import { getSession } from '@/lib/auth'
import { CONSENT_VERSION } from '@/lib/onboarding/options'
import { normalisePain, onboardingSchema, type OnboardingInput } from '@/lib/onboarding/schema'

export type SaveResult = { ok: true } | { ok: false; error: 'auth' | 'invalid' | 'db'; issues?: string[] }

export async function saveOnboarding(input: OnboardingInput): Promise<SaveResult> {
  const s = await getSession()
  if (!s) return { ok: false, error: 'auth' }
  const parsed = onboardingSchema.safeParse(input)
  if (!parsed.success)
    return { ok: false, error: 'invalid', issues: parsed.error.issues.map((i) => i.path.join('.')) }
  const d = parsed.data
  const { supabase, user } = s

  const profile = await supabase
    .from('profiles')
    .update({
      display_name: d.displayName,
      birth_date: d.birthDate,
      sex: d.sex,
      height_cm: d.heightCm,
      weight_kg: d.weightKg,
      experience: d.experience,
      onboarded_at: s.profile?.onboarded_at ?? new Date().toISOString(),
    })
    .eq('id', user.id)
  if (profile.error) return { ok: false, error: 'db' }

  const prefs = await supabase.from('preferences').upsert({
    user_id: user.id,
    sports: d.sports,
    training_days: d.trainingDays,
    session_minutes: d.sessionMinutes,
    equipment: d.equipment,
    diet_type: d.dietType,
    allergies: [...d.allergies, ...d.allergiesOther],
    dislikes: d.dislikes,
    budget: d.budget,
    pain_areas: normalisePain(d.painAreas),
    medications: d.medications || null,
    sleep_hours: d.sleepHours,
    work_pattern: d.workPattern,
  })
  if (prefs.error) return { ok: false, error: 'db' }

  // goals: replace the set
  await supabase.from('goals').delete().eq('user_id', user.id)
  const goals = await supabase.from('goals').insert(d.goals.map((goal, i) => ({ goal, priority: i + 1 })))
  if (goals.error) return { ok: false, error: 'db' }

  // consent log: only append when the state changes
  if (!s.healthConsent) {
    const c = await supabase.from('consents').insert([
      { kind: 'health_data', granted: true, version: CONSENT_VERSION },
      { kind: 'terms', granted: true, version: CONSENT_VERSION },
    ])
    if (c.error) return { ok: false, error: 'db' }
  }
  return { ok: true }
}
