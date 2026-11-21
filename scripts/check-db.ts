/**
 * Checks that the production database has the functions the app expects from migrations that must be
 * run by hand in the Supabase SQL editor, and every exercise the app offers (workouts with a missing
 * exercise can never sync).  Reads .env.local (URL + service key), never prints secrets.
 *
 *   npm run check:db
 */
import { readFileSync } from 'node:fs'
import { EXERCISES } from '../src/data/exercises'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
)
const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('✗ NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local')
  process.exit(1)
}

const EXPECTED: { fn: string; migration: string }[] = [
  { fn: 'reserve_ai_call', migration: 'supabase/migrations/20261119000000_ai_usage_atomic.sql' },
  { fn: 'add_ai_tokens', migration: 'supabase/migrations/20261119000000_ai_usage_atomic.sql' },
]

async function main() {
  const res = await fetch(`${url}/rest/v1/`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  const paths = ((await res.json()) as { paths?: Record<string, unknown> }).paths ?? {}
  const missing = EXPECTED.filter((e) => !(`/rpc/${e.fn}` in paths))
  for (const e of EXPECTED) console.log(`${missing.includes(e) ? '✗' : '✓'} ${e.fn}`)
  const ex = await fetch(`${url}/rest/v1/exercises?select=slug&owner_id=is.null`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  const inDb = new Set(((await ex.json()) as { slug: string }[]).map((r) => r.slug))
  const notSeeded = EXERCISES.filter((e) => !inDb.has(e.slug)).map((e) => e.slug)
  console.log(
    `${notSeeded.length ? '✗' : '✓'} exercise library (${EXERCISES.length - notSeeded.length}/${EXERCISES.length})`,
  )
  if (notSeeded.length) console.log(`  missing: ${notSeeded.join(', ')}\n  Run: npm run seed:reference`)

  if (missing.length) {
    const files = [...new Set(missing.map((m) => m.migration))]
    console.log(`\nRun in Supabase → SQL Editor:\n${files.map((f) => `  ${f}`).join('\n')}`)
  }
  if (missing.length || notSeeded.length) process.exit(1)
  console.log('\nDatabase matches what the app expects.')
}

main()
