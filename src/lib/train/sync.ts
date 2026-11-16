'use client'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { personalRecords, type LoggedSet } from './strength'
import { useSession, type QueuedWorkout } from './session-store'

/**
 * Writes queued workouts to Supabase. Idempotent: workouts and sets carry client-generated
 * `client_id`s and are upserted on them, so retries after a dropped connection never duplicate data.
 */
type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

let idCache: Record<string, string> | null = null
async function exerciseIds(db: Db): Promise<Record<string, string>> {
  if (idCache) return idCache
  const { data, error } = await db.from('exercises').select('id, slug').is('owner_id', null)
  if (error) throw error
  idCache = Object.fromEntries((data as { id: string; slug: string }[]).map((r) => [r.slug, r.id]))
  return idCache
}

export async function syncWorkout(w: QueuedWorkout, db: Db): Promise<void> {
  const ids = await exerciseIds(db)
  const wo = await db
    .from('workouts')
    .upsert(
      {
        client_id: w.id,
        name: w.name || 'Workout',
        started_at: w.startedAt,
        finished_at: w.finishedAt,
        notes: w.notes || null,
      },
      { onConflict: 'client_id' },
    )
    .select('id')
    .single()
  if (wo.error) throw wo.error
  const workoutId = (wo.data as { id: string }).id

  const rows = w.exercises.flatMap((e, pos) =>
    e.sets
      .filter((s) => s.done)
      .map((s, i) => ({
        client_id: s.id,
        workout_id: workoutId,
        exercise_id: ids[e.slug],
        position: pos,
        set_index: i,
        set_type: s.type,
        reps: s.reps,
        weight_kg: s.weightKg,
        rpe: s.rpe,
        superset_group: e.superset,
        completed: true,
      })),
  )
  const missing = rows.filter((r) => !r.exercise_id)
  if (missing.length) throw new Error('Exercise library not seeded')
  if (rows.length) {
    const r = await db.from('workout_sets').upsert(rows, { onConflict: 'client_id' })
    if (r.error) throw r.error
  }

  // personal records per exercise (only improvements are written)
  for (const e of w.exercises) {
    const sets: LoggedSet[] = e.sets
      .filter((s) => s.done && s.reps !== null && s.weightKg !== null)
      .map((s) => ({ exercise: e.slug, weightKg: s.weightKg!, reps: s.reps!, type: s.type, completed: true }))
    if (!sets.length) continue
    const best = personalRecords(sets)
    const kinds = {
      e1rm: best.e1rm,
      max_weight: best.maxWeight,
      max_reps: best.maxReps,
      max_volume: best.maxVolume,
    }
    const { data: existing } = await db
      .from('personal_records')
      .select('kind, value')
      .eq('exercise_id', ids[e.slug])
    const prev = Object.fromEntries(
      ((existing ?? []) as { kind: string; value: number }[]).map((r) => [r.kind, Number(r.value)]),
    )
    const better = Object.entries(kinds)
      .filter(([k, v]) => v > 0 && v > (prev[k] ?? 0))
      .map(([kind, value]) => ({ exercise_id: ids[e.slug], kind, value, achieved_at: w.finishedAt }))
    if (better.length)
      await db.from('personal_records').upsert(better, { onConflict: 'user_id,exercise_id,kind' })
  }
}

/** Sync every unsynced workout. Safe to call often (on load, on `online`, after finishing). */
export async function syncQueue(): Promise<{ synced: number; failed: number }> {
  if (!isSupabaseConfigured() || typeof navigator === 'undefined' || !navigator.onLine)
    return { synced: 0, failed: 0 }
  const db = createClient() as unknown as Db
  const pending = useSession.getState().queue.filter((w) => !w.synced)
  let synced = 0
  let failed = 0
  for (const w of pending) {
    try {
      await syncWorkout(w, db)
      useSession.getState().markSynced(w.id)
      synced++
    } catch (e) {
      useSession.getState().markSynced(w.id, e instanceof Error ? e.message : String(e))
      failed++
    }
  }
  return { synced, failed }
}
