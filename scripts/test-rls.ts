/**
 * RLS isolation test against the real Supabase project: two throwaway users;
 * B must never read or modify A's rows. Run: npm run test:rls  (deletes its users afterwards)
 */
import { randomBytes, randomUUID } from 'node:crypto'
import { admin, anon } from './supabase-admin'

const db = admin()
let failures = 0
const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`)
  if (!ok) failures++
}

async function makeUser(tag: string) {
  const email = `rls-${tag}-${randomUUID().slice(0, 8)}@example.com`
  const password = randomBytes(18).toString('base64url')
  const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true })
  if (error) throw error
  const client = anon()
  const s = await client.auth.signInWithPassword({ email, password })
  if (s.error) throw s.error
  return { id: data.user.id, client }
}

async function main() {
  const a = await makeUser('a')
  const b = await makeUser('b')
  try {
    // A writes health data
    await a.client
      .from('preferences')
      .upsert({ user_id: a.id, medications: 'test-secret', pain_areas: ['knee'] })
    const wo = await a.client.from('workouts').insert({ name: 'A workout' }).select('id').single()
    await a.client.from('pain_reports').insert({ region: 'knee', score: 6 })
    await a.client.from('consents').insert({ kind: 'health_data', granted: true, version: 'test' })

    // B tries to read everything A has
    for (const t of ['profiles', 'preferences', 'workouts', 'pain_reports', 'consents', 'subscriptions']) {
      const r = await b.client.from(t).select('*')
      const leaked = (r.data ?? []).some(
        (row: Record<string, unknown>) => row.user_id === a.id || row.id === a.id,
      )
      check(!leaked, `B cannot read A's ${t}`)
    }
    // B tries to write as A
    const forged = await b.client.from('workouts').insert({ user_id: a.id, name: 'forged' })
    check(!!forged.error, 'B cannot insert rows owned by A')
    const upd = await b.client.from('workouts').update({ name: 'hacked' }).eq('id', wo.data!.id).select()
    check((upd.data ?? []).length === 0, "B cannot update A's workout")
    const del = await b.client.from('workouts').delete().eq('id', wo.data!.id).select()
    check((del.data ?? []).length === 0, "B cannot delete A's workout")
    const prof = await b.client.from('profiles').update({ display_name: 'x' }).eq('id', a.id).select()
    check((prof.data ?? []).length === 0, "B cannot update A's profile")
    // consents are append-only for the owner too
    const cupd = await a.client.from('consents').update({ granted: false }).eq('user_id', a.id).select()
    check((cupd.data ?? []).length === 0, 'consent log cannot be rewritten by its owner')
    // anonymous visitors see nothing personal
    const an = await anon().from('preferences').select('*')
    check((an.data ?? []).length === 0, 'anonymous cannot read preferences')
    // A still sees own data
    const own = await a.client.from('preferences').select('medications').single()
    check(own.data?.medications === 'test-secret', 'A can read own preferences')
    // minors are rejected server-side
    const minor = await a.client
      .from('profiles')
      .update({ birth_date: `${new Date().getFullYear() - 16}-01-01` })
      .eq('id', a.id)
    check(!!minor.error, 'database rejects birth dates under 18')
  } finally {
    await db.auth.admin.deleteUser(a.id)
    await db.auth.admin.deleteUser(b.id)
  }
  if (failures) {
    console.error(`\n✗ ${failures} RLS check(s) failed`)
    process.exit(1)
  }
  console.log('\n✓ RLS isolation verified')
}

main().catch((e) => {
  console.error('✗', e.message ?? e)
  process.exit(1)
})
