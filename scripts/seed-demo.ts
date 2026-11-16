/**
 * Creates (or refreshes) the demo user with a realistic onboarded profile.
 * Run after applying migrations + seed.sql:  npm run seed:demo
 * Needs SUPABASE_SERVICE_ROLE_KEY, DEMO_USER_EMAIL and DEMO_USER_PASSWORD in .env.local.
 */
import { admin } from './supabase-admin'
import { CONSENT_VERSION } from '../src/lib/onboarding/options'

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
    db.from('profiles').update({
      display_name: 'Demo',
      birth_date: '1994-04-12',
      sex: 'male',
      height_cm: 181,
      weight_kg: 82,
      experience: 'intermediate',
      onboarded_at: new Date().toISOString(),
    }).eq('id', id),
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
    db.from('goals').insert(['muscle', 'performance', 'pain_relief'].map((goal, i) => ({ user_id: id, goal, priority: i + 1 }))),
    db.from('consents').insert([
      { user_id: id, kind: 'health_data', granted: true, version: CONSENT_VERSION },
      { user_id: id, kind: 'terms', granted: true, version: CONSENT_VERSION },
    ]),
  ]
  for (const s of inserts) {
    const { error } = await s
    if (error) throw error
  }
  console.log(`✓ demo user ready: ${email}`)
}

main().catch((e) => {
  console.error('✗', e.message ?? e)
  process.exit(1)
})
