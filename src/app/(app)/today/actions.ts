'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSession } from '@/lib/auth'

const CheckIn = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sleep_hours: z.number().min(0).max(16).nullable(),
  sleep_quality: z.number().int().min(1).max(5).nullable(),
  steps: z.number().int().min(0).max(150000).nullable(),
  water_ml: z.number().int().min(0).max(15000).nullable(),
  hrv_ms: z.number().int().min(5).max(300).nullable(),
  resting_hr: z.number().int().min(25).max(150).nullable(),
  stress: z.number().int().min(1).max(5).nullable(),
})
export type CheckInInput = z.infer<typeof CheckIn>

type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Daily check-in: last night's sleep + today's recovery markers (one row per day, upserted). The form is
 * prefilled with the day's saved values, so an empty field is a deliberate clear and is written as null.
 */
export async function saveCheckIn(input: CheckInInput): Promise<{ ok: boolean; error?: string }> {
  const s = await getSession()
  if (!s?.healthConsent) return { ok: false, error: 'unauthorized' }
  const p = CheckIn.safeParse(input)
  if (!p.success) return { ok: false, error: 'invalid' }
  const d = p.data
  const db = s.supabase as unknown as Db
  const night = new Date(`${d.date}T12:00:00`)
  night.setDate(night.getDate() - 1)
  if (d.sleep_hours !== null || d.sleep_quality !== null) {
    const { error } = await db.from('sleep_logs').upsert(
      {
        user_id: s.user.id,
        night_of: night.toISOString().slice(0, 10),
        duration_min: d.sleep_hours === null ? null : Math.round(d.sleep_hours * 60),
        quality: d.sleep_quality,
      },
      { onConflict: 'user_id,night_of' },
    )
    if (error) return { ok: false, error: error.message }
  }
  const { error } = await db.from('recovery_logs').upsert(
    {
      user_id: s.user.id,
      logged_on: d.date,
      steps: d.steps,
      water_ml: d.water_ml,
      hrv_ms: d.hrv_ms,
      resting_hr: d.resting_hr,
      stress: d.stress,
    },
    { onConflict: 'user_id,logged_on' },
  )
  if (error) return { ok: false, error: error.message }
  revalidatePath('/today')
  return { ok: true }
}
