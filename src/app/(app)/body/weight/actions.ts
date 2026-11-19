'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { defined } from '@/lib/defined'

const cm = z.number().min(20).max(250).nullable()
const Measurement = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    weight_kg: z.number().min(25).max(350).nullable(),
    waist_cm: cm,
    hips_cm: cm,
    chest_cm: cm,
    arm_cm: z.number().min(10).max(80).nullable(),
    thigh_cm: z.number().min(20).max(120).nullable(),
  })
  .refine((m) => Object.entries(m).some(([k, v]) => k !== 'date' && v !== null), 'empty')
export type MeasurementInput = z.infer<typeof Measurement>

type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * The newest weigh-in becomes the profile weight, so energy and protein targets follow the user's current
 * body weight. Recomputed after every save and delete; values outside the profile range (30–300 kg) are
 * left out instead of failing silently on the column check.
 */
async function syncProfileWeight(db: Db, userId: string) {
  const { data: newest } = await db
    .from('body_measurements')
    .select('weight_kg')
    .not('weight_kg', 'is', null)
    .gte('weight_kg', 30)
    .lte('weight_kg', 300)
    .order('measured_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (newest) await db.from('profiles').update({ weight_kg: Number(newest.weight_kg) }).eq('id', userId)
}

/** One entry per day: a second save on the same date adds the new values and keeps the others. */
export async function saveMeasurement(input: MeasurementInput): Promise<{ ok: boolean; error?: string }> {
  const s = await getSession()
  if (!s?.healthConsent) return { ok: false, error: 'unauthorized' }
  const p = Measurement.safeParse(input)
  if (!p.success) return { ok: false, error: 'invalid' }
  const { date, ...values } = p.data
  if (date > new Date(Date.now() + 864e5).toISOString().slice(0, 10)) return { ok: false, error: 'future' }
  const db = s.supabase as unknown as Db

  const { data: existing } = await db
    .from('body_measurements')
    .select('id')
    .eq('measured_at', date)
    .limit(1)
    .maybeSingle()
  const { error } = existing
    ? await db.from('body_measurements').update(defined(values)).eq('id', existing.id)
    : await db.from('body_measurements').insert({ user_id: s.user.id, measured_at: date, ...values })
  if (error) return { ok: false, error: error.message }

  if (values.weight_kg !== null) await syncProfileWeight(db, s.user.id)
  revalidatePath('/body/weight')
  revalidatePath('/today')
  revalidatePath('/eat')
  return { ok: true }
}

export async function deleteMeasurement(id: string): Promise<{ ok: boolean }> {
  const s = await getSession()
  if (!s?.healthConsent || !z.string().uuid().safeParse(id).success) return { ok: false }
  const db = s.supabase as unknown as Db
  const { error } = await db.from('body_measurements').delete().eq('id', id)
  if (!error) await syncProfileWeight(db, s.user.id)
  revalidatePath('/body/weight')
  revalidatePath('/today')
  revalidatePath('/eat')
  return { ok: !error }
}
