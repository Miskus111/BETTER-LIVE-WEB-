'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { flagFor, MARKER_BY_KEY } from '@/lib/labs/markers'

const Row = z.object({
  marker: z.string().min(1).max(60),
  value: z.number().finite(),
  unit: z.string().max(30),
  ref_low: z.number().finite().nullable(),
  ref_high: z.number().finite().nullable(),
  ref_text: z.string().max(80).nullable(),
})
const Report = z.object({
  kind: z.enum(['blood', 'inbody']),
  taken_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lab_name: z.string().max(120).nullable(),
  storage_path: z.string().max(200).nullable(),
  rows: z.array(Row).max(200),
  inbody: z
    .object({
      weight_kg: z.number().positive().max(400).nullable(),
      skeletal_muscle_kg: z.number().positive().max(150).nullable(),
      body_fat_pct: z.number().min(2).max(75).nullable(),
      visceral_fat_level: z.number().min(0).max(30).nullable(),
    })
    .nullable(),
})
export type ReportInput = z.infer<typeof Report>

type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

/** Saves only what the user reviewed and confirmed — extracted values are never stored unconfirmed. */
export async function saveLabReport(
  input: ReportInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const s = await getSession()
  if (!s?.healthConsent) return { ok: false, error: 'unauthorized' }
  const parsed = Report.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const r = parsed.data
  if (r.storage_path && !r.storage_path.startsWith(`${s.user.id}/`)) return { ok: false, error: 'invalid' }
  const db = s.supabase as unknown as Db

  const { data: report, error } = await db
    .from('lab_reports')
    .insert({
      kind: r.kind,
      taken_on: r.taken_on,
      lab_name: r.lab_name,
      storage_path: r.storage_path,
      status: 'confirmed',
    })
    .select('id')
    .single()
  if (error || !report) return { ok: false, error: error?.message ?? 'insert failed' }

  if (r.rows.length) {
    const { error: e2 } = await db.from('lab_values').insert(
      r.rows.map((x) => ({
        report_id: report.id,
        marker: x.marker,
        value: x.value,
        unit: x.unit,
        ref_low: x.ref_low,
        ref_high: x.ref_high,
        ref_text: x.ref_text,
        flag: flagFor(MARKER_BY_KEY[x.marker] ?? null, x.value, x.ref_low, x.ref_high),
        confirmed: true,
        taken_on: r.taken_on,
      })),
    )
    if (e2) return { ok: false, error: e2.message }
  }
  if (r.inbody && Object.values(r.inbody).some((v) => v !== null)) {
    const { error: e3 } = await db
      .from('body_composition')
      .insert({ report_id: report.id, measured_on: r.taken_on, ...r.inbody, confirmed: true })
    if (e3) return { ok: false, error: e3.message }
  }
  revalidatePath('/labs')
  return { ok: true }
}

export async function deleteLabReport(id: string) {
  const s = await getSession()
  if (!s) return
  const db = s.supabase as unknown as Db
  const { data } = await db.from('lab_reports').select('storage_path').eq('id', id).maybeSingle()
  if (data?.storage_path) await s.supabase.storage.from('lab-reports').remove([data.storage_path])
  await db.from('lab_reports').delete().eq('id', id)
  revalidatePath('/labs')
}
