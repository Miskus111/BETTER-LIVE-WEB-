import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
const { runCoachTool } = await import('./tools')

/** Minimal Supabase stand-in: any chain of query methods resolves to the table's rows. */
function fakeDb(tables: Record<string, unknown[]>) {
  return {
    from(table: string) {
      const rows = tables[table] ?? []
      const builder: Record<string, unknown> = {
        then: (ok: (v: unknown) => unknown) => Promise.resolve({ data: rows, error: null }).then(ok),
        maybeSingle: () => Promise.resolve({ data: rows[0] ?? null, error: null }),
        single: () => Promise.resolve({ data: rows[0] ?? null, error: null }),
      }
      for (const m of ['select', 'eq', 'gte', 'lte', 'order', 'limit', 'in', 'is']) builder[m] = () => builder
      return builder
    },
  }
}

const today = new Date().toISOString().slice(0, 10)

describe('coach tools', () => {
  it('never sends the free-text medication list to the model, only interaction categories', async () => {
    const db = fakeDb({
      profiles: [{ birth_date: '1990-01-01', sex: 'male', height_cm: 180, weight_kg: 80 }],
      goals: [{ goal: 'health' }],
      preferences: [{ training_days: 3, medications: 'Warfarin 5 mg, Euthyrox 50 — tajná poznámka' }],
    })
    const out = await runCoachTool(db, 'u1', 'get_profile', {})
    expect(out).not.toMatch(/Warfarin|Euthyrox|tajná/)
    expect(JSON.parse(out).medication_interaction_categories.length).toBeGreaterThan(0)
  })
  it('adds up the food diary per day', async () => {
    const db = fakeDb({
      food_logs: [
        { logged_on: today, kcal: 300, protein_g: 20, carbs_g: 30, fat_g: 10, fiber_g: 4 },
        { logged_on: today, kcal: 200.4, protein_g: 10, carbs_g: 20, fat_g: 5, fiber_g: 2 },
      ],
    })
    const out = JSON.parse(await runCoachTool(db, 'u1', 'get_nutrition', { days: 7 }))
    expect(out.daily).toEqual([{ date: today, kcal: 500, protein_g: 30, carbs_g: 50, fat_g: 15, fiber_g: 6 }])
  })
})
