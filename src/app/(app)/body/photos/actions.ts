'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { isOwnPhotoPath } from '@/lib/body/photo'
import { gate } from '@/lib/plan'

const Photo = z.object({
  path: z.string().max(120),
  taken_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pose: z.enum(['front', 'side', 'back', 'other']),
  notes: z.string().max(300).nullable(),
})
export type PhotoInput = z.infer<typeof Photo>

type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

/** Registers a photo the browser already uploaded to the user's private folder. */
export async function savePhoto(input: PhotoInput): Promise<{ ok: boolean; error?: string }> {
  const s = await getSession()
  if (!s?.healthConsent) return { ok: false, error: 'unauthorized' }
  const p = Photo.safeParse(input)
  if (!p.success || !isOwnPhotoPath(p.data.path, s.user.id)) return { ok: false, error: 'invalid' }
  if (!(await gate(s.supabase, s.user.id, 'photos')).allowed) {
    await s.supabase.storage.from('progress-photos').remove([p.data.path])
    return { ok: false, error: 'upgrade' }
  }
  const { error } = await (s.supabase as unknown as Db).from('progress_photos').insert({
    user_id: s.user.id,
    storage_path: p.data.path,
    taken_at: p.data.taken_at,
    pose: p.data.pose,
    notes: p.data.notes?.trim() || null,
  })
  if (error) {
    // don't leave an orphaned file behind
    await s.supabase.storage.from('progress-photos').remove([p.data.path])
    return { ok: false, error: error.message }
  }
  revalidatePath('/body/photos')
  return { ok: true }
}

/** Deletes the database row and the file. */
export async function deletePhoto(id: string): Promise<{ ok: boolean }> {
  const s = await getSession()
  if (!s?.healthConsent || !z.string().uuid().safeParse(id).success) return { ok: false }
  const db = s.supabase as unknown as Db
  const { data } = await db.from('progress_photos').select('storage_path').eq('id', id).maybeSingle()
  if (!data) return { ok: false }
  await s.supabase.storage.from('progress-photos').remove([data.storage_path])
  const { error } = await db.from('progress_photos').delete().eq('id', id)
  revalidatePath('/body/photos')
  return { ok: !error }
}
