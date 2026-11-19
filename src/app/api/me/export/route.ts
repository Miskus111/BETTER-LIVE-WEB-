import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

/** Every user-owned table — GDPR Art. 15/20 data export (RLS limits each query to the caller's rows). */
const TABLES = [
  'profiles',
  'preferences',
  'goals',
  'consents',
  'routines',
  'routine_exercises',
  'workouts',
  'workout_sets',
  'sport_sessions',
  'personal_records',
  'body_measurements',
  'progress_photos',
  'food_logs',
  'meal_plans',
  'meal_plan_items',
  'user_supplements',
  'supplement_logs',
  'pain_reports',
  'sleep_logs',
  'recovery_logs',
  'lab_reports',
  'lab_values',
  'body_composition',
  'coach_conversations',
  'coach_messages',
  'ai_usage',
  'subscriptions',
] as const

export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  // untyped access: tables beyond the generated subset
  const db = s.supabase as unknown as {
    from: (t: string) => {
      select: (c: string) => { range: (a: number, b: number) => PromiseLike<{ data: unknown[] | null }> }
    }
  }
  // PostgREST returns at most 1000 rows per request — page through so the export is complete
  const PAGE = 1000
  const all = async (t: string) => {
    const rows: unknown[] = []
    for (let from = 0; ; from += PAGE) {
      const { data } = await db
        .from(t)
        .select('*')
        .range(from, from + PAGE - 1)
      rows.push(...(data ?? []))
      if (!data || data.length < PAGE) return rows
    }
  }
  const out: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
    user: { id: s.user.id, email: s.user.email },
  }
  const tables = await Promise.all(TABLES.map(async (t) => [t, await all(t)] as const))
  for (const [t, rows] of tables) out[t] = rows
  return new NextResponse(JSON.stringify(out, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="blwb-export-${new Date().toISOString().slice(0, 10)}.json"`,
      'cache-control': 'no-store',
    },
  })
}
