import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createAdmin } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env'

/** Request-scoped client acting as the signed-in user (RLS applies). */
export async function createClient() {
  const store = await cookies()
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          // called from a Server Component — middleware refreshes the session instead
        }
      },
    },
  })
}

/** Service-role client (bypasses RLS). Server-only: account deletion and seeding. */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createAdmin<Database>(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
