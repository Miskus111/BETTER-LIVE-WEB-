/**
 * Checks that the production database has the functions the app expects from migrations that must be
 * run by hand in the Supabase SQL editor.  Reads .env.local (URL + service key), never prints secrets.
 *
 *   npm run check:db
 */
import { readFileSync } from 'node:fs'

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
  if (missing.length) {
    const files = [...new Set(missing.map((m) => m.migration))]
    console.log(`\nRun in Supabase → SQL Editor:\n${files.map((f) => `  ${f}`).join('\n')}`)
    process.exit(1)
  }
  console.log('\nAll expected database functions are present.')
}

main()
