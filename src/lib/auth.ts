import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

/** Signed-in user + profile + current health-data consent (cached per request). */
export const getSession = cache(async () => {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const [{ data: profile }, { data: consent }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase
      .from('current_consents')
      .select('granted')
      .eq('user_id', user.id)
      .eq('kind', 'health_data')
      .maybeSingle(),
  ])
  return { supabase, user, profile, healthConsent: consent?.granted === true }
})

/** For app pages: signed in, onboarded and health-data consent granted — otherwise redirect. */
export async function requireAppUser() {
  const s = await getSession()
  if (!s) redirect('/login')
  if (!s.profile?.onboarded_at) redirect('/onboarding')
  if (!s.healthConsent) redirect('/onboarding?step=consent')
  return s
}
