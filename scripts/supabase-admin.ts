import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

export const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export function admin() {
  if (!URL || !SERVICE) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  return createClient(URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function anon() {
  return createClient(URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } })
}
