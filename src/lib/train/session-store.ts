'use client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { SetType } from './strength'

export interface SessionSet {
  id: string // client_id (uuid) — makes offline sync idempotent
  type: SetType
  weightKg: number | null
  reps: number | null
  rpe: number | null
  done: boolean
}
export interface SessionExercise {
  id: string
  slug: string
  superset: number | null
  notes: string
  sets: SessionSet[]
}
export interface ActiveWorkout {
  id: string // client_id
  name: string
  startedAt: string
  notes: string
  exercises: SessionExercise[]
}
/** A finished workout waiting to be written to Supabase (or already synced). */
export interface QueuedWorkout extends ActiveWorkout {
  finishedAt: string
  synced: boolean
  error?: string
}

const uuid = () => crypto.randomUUID()
const newSet = (prev?: SessionSet): SessionSet => ({
  id: uuid(),
  type: 'normal',
  weightKg: prev?.weightKg ?? null,
  reps: prev?.reps ?? null,
  rpe: null,
  done: false,
})

interface SessionState {
  active: ActiveWorkout | null
  queue: QueuedWorkout[]
  /** last completed working sets per exercise slug, for the inline "previous" column */
  previous: Record<string, { weightKg: number; reps: number }[]>
  units: 'kg' | 'lb'
  restSeconds: number
  restEndsAt: number | null

  start: (name?: string, slugs?: string[]) => void
  discard: () => void
  rename: (name: string) => void
  setNotes: (notes: string) => void
  addExercise: (slug: string) => void
  removeExercise: (id: string) => void
  setExerciseNotes: (id: string, notes: string) => void
  toggleSuperset: (id: string) => void
  addSet: (exerciseId: string) => void
  updateSet: (exerciseId: string, setId: string, patch: Partial<SessionSet>) => void
  removeSet: (exerciseId: string, setId: string) => void
  finish: () => QueuedWorkout | null
  markSynced: (id: string, error?: string) => void
  setUnits: (u: 'kg' | 'lb') => void
  setRestSeconds: (s: number) => void
  startRest: (seconds?: number) => void
  stopRest: () => void
  setPrevious: (p: SessionState['previous']) => void
}

/**
 * Keep the queue small without losing data: workouts not yet written to Supabase are never dropped,
 * only the oldest already-synced ones (so at most `max` entries unless more than that are unsynced).
 */
export function trimQueue(queue: QueuedWorkout[], max = 50): QueuedWorkout[] {
  let extra = queue.length - max
  if (extra <= 0) return queue
  return queue.filter((w) => !(w.synced && extra-- > 0))
}

const mapEx = (w: ActiveWorkout, id: string, fn: (e: SessionExercise) => SessionExercise): ActiveWorkout => ({
  ...w,
  exercises: w.exercises.map((e) => (e.id === id ? fn(e) : e)),
})

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      active: null,
      queue: [],
      previous: {},
      units: 'kg',
      restSeconds: 90,
      restEndsAt: null,

      start: (name, slugs = []) =>
        set({
          active: {
            id: uuid(),
            name: name ?? '',
            startedAt: new Date().toISOString(),
            notes: '',
            exercises: slugs.map((slug) => ({
              id: uuid(),
              slug,
              superset: null,
              notes: '',
              sets: [newSet()],
            })),
          },
        }),
      discard: () => set({ active: null, restEndsAt: null }),
      rename: (name) => set((s) => (s.active ? { active: { ...s.active, name } } : s)),
      setNotes: (notes) => set((s) => (s.active ? { active: { ...s.active, notes } } : s)),
      addExercise: (slug) =>
        set((s) =>
          s.active
            ? {
                active: {
                  ...s.active,
                  exercises: [
                    ...s.active.exercises,
                    {
                      id: uuid(),
                      slug,
                      superset: null,
                      notes: '',
                      // prefill weight/reps from the last time this exercise was done
                      sets: [{ ...newSet(), ...(s.previous[slug]?.[0] ?? {}) }],
                    },
                  ],
                },
              }
            : s,
        ),
      removeExercise: (id) =>
        set((s) =>
          s.active
            ? { active: { ...s.active, exercises: s.active.exercises.filter((e) => e.id !== id) } }
            : s,
        ),
      setExerciseNotes: (id, notes) =>
        set((s) => (s.active ? { active: mapEx(s.active, id, (e) => ({ ...e, notes })) } : s)),
      /** links the exercise with the one above it into a superset (or unlinks it) */
      toggleSuperset: (id) =>
        set((s) => {
          if (!s.active) return s
          const i = s.active.exercises.findIndex((e) => e.id === id)
          if (i <= 0) return s
          const above = s.active.exercises[i - 1]
          const cur = s.active.exercises[i]
          const group = cur.superset !== null ? null : (above.superset ?? i)
          return {
            active: {
              ...s.active,
              exercises: s.active.exercises.map((e, k) =>
                k === i
                  ? { ...e, superset: group }
                  : k === i - 1 && group !== null
                    ? { ...e, superset: group }
                    : e,
              ),
            },
          }
        }),
      addSet: (exerciseId) =>
        set((s) =>
          s.active
            ? {
                active: mapEx(s.active, exerciseId, (e) => ({
                  ...e,
                  sets: [...e.sets, newSet(e.sets.at(-1))],
                })),
              }
            : s,
        ),
      updateSet: (exerciseId, setId, patch) =>
        set((s) =>
          s.active
            ? {
                active: mapEx(s.active, exerciseId, (e) => ({
                  ...e,
                  sets: e.sets.map((x) => (x.id === setId ? { ...x, ...patch } : x)),
                })),
              }
            : s,
        ),
      removeSet: (exerciseId, setId) =>
        set((s) =>
          s.active
            ? {
                active: mapEx(s.active, exerciseId, (e) => ({
                  ...e,
                  sets: e.sets.filter((x) => x.id !== setId),
                })),
              }
            : s,
        ),
      finish: () => {
        const a = get().active
        if (!a) return null
        const q: QueuedWorkout = { ...a, finishedAt: new Date().toISOString(), synced: false }
        // update the "previous" cache with this workout's working sets
        const previous = { ...get().previous }
        for (const e of a.exercises) {
          const working = e.sets.filter((x) => x.done && x.type !== 'warmup' && x.reps && x.weightKg !== null)
          if (working.length)
            previous[e.slug] = working.map((x) => ({ weightKg: x.weightKg!, reps: x.reps! }))
        }
        set({ active: null, restEndsAt: null, queue: trimQueue([...get().queue, q]), previous })
        return q
      },
      markSynced: (id, error) =>
        set((s) => ({ queue: s.queue.map((w) => (w.id === id ? { ...w, synced: !error, error } : w)) })),
      setUnits: (units) => set({ units }),
      setRestSeconds: (restSeconds) => set({ restSeconds }),
      startRest: (seconds) => set({ restEndsAt: Date.now() + (seconds ?? get().restSeconds) * 1000 }),
      stopRest: () => set({ restEndsAt: null }),
      setPrevious: (previous) => set((s) => ({ previous: { ...previous, ...s.previous } })),
    }),
    { name: 'blwb-session-v1', storage: createJSONStorage(() => window.localStorage) },
  ),
)
