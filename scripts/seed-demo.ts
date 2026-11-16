/**
 * Creates (or refreshes) the demo user with a realistic onboarded profile.
 * Run after applying migrations + seed.sql:  npm run seed:demo
 * Needs SUPABASE_SERVICE_ROLE_KEY, DEMO_USER_EMAIL and DEMO_USER_PASSWORD in .env.local.
 */
import { admin } from './supabase-admin'
import { CONSENT_VERSION } from '../src/lib/onboarding/options'
import { estimate1RM } from '../src/lib/train/strength'

async function main() {
  const email = process.env.DEMO_USER_EMAIL ?? 'demo@blwb.app'
  const password = process.env.DEMO_USER_PASSWORD
  if (!password || password.length < 12) throw new Error('Set DEMO_USER_PASSWORD (12+ chars) in .env.local')
  const db = admin()

  const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 })
  let user = list.users.find((u) => u.email === email)
  if (!user) {
    const created = await db.auth.admin.createUser({ email, password, email_confirm: true })
    if (created.error) throw created.error
    user = created.data.user
  }
  const id = user.id

  const steps = [
    db
      .from('profiles')
      .update({
        display_name: 'Demo',
        birth_date: '1994-04-12',
        sex: 'male',
        height_cm: 181,
        weight_kg: 82,
        experience: 'intermediate',
        onboarded_at: new Date().toISOString(),
      })
      .eq('id', id),
    db.from('preferences').upsert({
      user_id: id,
      sports: ['gym', 'running'],
      training_days: 4,
      session_minutes: 60,
      equipment: ['full_gym'],
      diet_type: 'omnivore',
      allergies: ['lactose'],
      dislikes: ['olivy'],
      budget: 'medium',
      pain_areas: ['lower_back'],
      medications: null,
      sleep_hours: 7,
      work_pattern: 'desk',
    }),
    db.from('goals').delete().eq('user_id', id),
  ]
  for (const s of steps) {
    const { error } = await s
    if (error) throw error
  }
  const inserts = [
    db
      .from('goals')
      .insert(
        ['muscle', 'performance', 'pain_relief'].map((goal, i) => ({ user_id: id, goal, priority: i + 1 })),
      ),
    db.from('consents').insert([
      { user_id: id, kind: 'health_data', granted: true, version: CONSENT_VERSION },
      { user_id: id, kind: 'terms', granted: true, version: CONSENT_VERSION },
    ]),
  ]
  for (const s of inserts) {
    const { error } = await s
    if (error) throw error
  }
  await seedTraining(db, id)
  console.log(`✓ demo user ready: ${email}`)
}

/**
 * Ten weeks of plausible full-body training (3×/week, slow progressive overload) so the
 * progress charts and records have something to show. Replaces earlier demo workouts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedTraining(db: any, userId: string) {
  const plan: Record<string, { start: number; step: number; reps: number }> = {
    'back-squat': { start: 80, step: 2.5, reps: 5 },
    'barbell-bench-press': { start: 62.5, step: 1.25, reps: 6 },
    'barbell-row': { start: 55, step: 1.25, reps: 8 },
    'romanian-deadlift': { start: 70, step: 2.5, reps: 8 },
    'overhead-press': { start: 40, step: 1.25, reps: 6 },
    deadlift: { start: 110, step: 2.5, reps: 5 },
  }
  const days = [
    { name: 'Celé tělo A', ex: ['back-squat', 'barbell-bench-press', 'barbell-row', 'romanian-deadlift'] },
    { name: 'Celé tělo B', ex: ['deadlift', 'overhead-press', 'barbell-row'] },
    { name: 'Celé tělo A', ex: ['back-squat', 'barbell-bench-press', 'romanian-deadlift'] },
  ]
  const { data: exRows, error: exErr } = await db
    .from('exercises')
    .select('id, slug')
    .in('slug', Object.keys(plan))
    .is('owner_id', null)
  if (exErr) throw exErr
  const idBySlug: Record<string, string> = Object.fromEntries(
    exRows.map((r: { id: string; slug: string }) => [r.slug, r.id]),
  )

  await db.from('personal_records').delete().eq('user_id', userId)
  const del = await db.from('workouts').delete().eq('user_id', userId)
  if (del.error) throw del.error

  const DAY = 864e5
  const today = new Date()
  today.setUTCHours(17, 30, 0, 0)
  const best: Record<string, { e1rm: number; max_weight: number; max_reps: number; at: string }> = {}
  let session = 0
  for (let week = 9; week >= 0; week--) {
    for (const [i, offset] of [0, 2, 4].entries()) {
      // Monday / Wednesday / Friday of that week; skip days still in the future and one missed session
      const monday = new Date(today.getTime() - ((today.getUTCDay() + 6) % 7) * DAY - week * 7 * DAY)
      const start = new Date(monday.getTime() + offset * DAY)
      if (start > today || (week === 6 && i === 2)) continue
      const day = days[i]
      const { data: w, error } = await db
        .from('workouts')
        .insert({
          user_id: userId,
          name: day.name,
          started_at: start.toISOString(),
          finished_at: new Date(start.getTime() + 62 * 60e3).toISOString(),
        })
        .select('id')
        .single()
      if (error) throw error
      const rows = []
      for (const [pos, slug] of day.ex.entries()) {
        const p = plan[slug]
        const progressWeeks = 9 - week
        // a deload in week 5 keeps the line honest
        const weight = p.start + p.step * progressWeeks - (week === 4 ? p.step * 2 : 0)
        rows.push({
          user_id: userId,
          workout_id: w.id,
          exercise_id: idBySlug[slug],
          position: pos,
          set_index: 0,
          set_type: 'warmup',
          reps: 8,
          weight_kg: Math.round(weight * 0.5 * 4) / 4,
          created_at: start.toISOString(),
        })
        for (let set = 1; set <= 3; set++) {
          const reps = p.reps - (set === 3 && session % 2 ? 1 : 0)
          rows.push({
            user_id: userId,
            workout_id: w.id,
            exercise_id: idBySlug[slug],
            position: pos,
            set_index: set,
            set_type: 'normal',
            reps,
            weight_kg: weight,
            rpe: 7 + set * 0.5,
            created_at: new Date(start.getTime() + (pos * 12 + set * 3) * 60e3).toISOString(),
          })
          const e = estimate1RM(weight, reps).value
          const b = best[slug] ?? { e1rm: 0, max_weight: 0, max_reps: 0, at: start.toISOString() }
          if (e > b.e1rm) Object.assign(b, { e1rm: e, at: start.toISOString() })
          b.max_weight = Math.max(b.max_weight, weight)
          b.max_reps = Math.max(b.max_reps, reps)
          best[slug] = b
        }
      }
      const ins = await db.from('workout_sets').insert(rows)
      if (ins.error) throw ins.error
      session++
    }
  }
  const prs = Object.entries(best).flatMap(([slug, b]) =>
    (['e1rm', 'max_weight', 'max_reps'] as const).map((kind) => ({
      user_id: userId,
      exercise_id: idBySlug[slug],
      kind,
      value: b[kind],
      achieved_at: b.at,
    })),
  )
  const pr = await db.from('personal_records').insert(prs)
  if (pr.error) throw pr.error
  console.log(`✓ demo training: ${session} workouts over 10 weeks`)
}

main().catch((e) => {
  console.error('✗', e.message ?? e)
  process.exit(1)
})
