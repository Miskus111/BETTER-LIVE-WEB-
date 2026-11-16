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

    // progress photos: private files in the owner's folder only
    const path = `${a.id}/00000000-0000-4000-8000-000000000001.jpg`
    const jpeg = new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], { type: 'image/jpeg' })
    const up = await a.client.storage
      .from('progress-photos')
      .upload(path, jpeg, { contentType: 'image/jpeg' })
    check(!up.error, 'A can upload into own photo folder')
    await a.client.from('progress_photos').insert({ storage_path: path, pose: 'front' })
    const bDown = await b.client.storage.from('progress-photos').download(path)
    check(!!bDown.error, "B cannot download A's photo")
    const bList = await b.client.storage.from('progress-photos').list(a.id)
    check((bList.data ?? []).length === 0, "B cannot list A's photos")
    const bSign = await b.client.storage.from('progress-photos').createSignedUrl(path, 60)
    check(!!bSign.error, "B cannot create a link to A's photo")
    const bRow = await b.client.from('progress_photos').select('*')
    check(
      !(bRow.data ?? []).some((r: { user_id: string }) => r.user_id === a.id),
      "B cannot read A's photo rows",
    )
    const bUp = await b.client.storage
      .from('progress-photos')
      .upload(`${a.id}/00000000-0000-4000-8000-000000000002.jpg`, jpeg, { contentType: 'image/jpeg' })
    check(!!bUp.error, "B cannot upload into A's folder")
    await b.client.storage.from('progress-photos').remove([path])
    const still = await a.client.storage.from('progress-photos').download(path)
    check(!still.error, "B cannot delete A's photo")
    const pub = await anon().storage.from('progress-photos').download(path)
    check(!!pub.error, 'anonymous cannot download photos')
    await a.client.storage.from('progress-photos').remove([path])
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
