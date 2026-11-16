'use server'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'
import { CONSENT_VERSION } from '@/lib/onboarding/options'

/** Withdrawing health-data consent appends a log entry; the app then stops personalising until re-granted. */
export async function withdrawHealthConsent() {
  const s = await getSession()
  if (!s) redirect('/login')
  await s.supabase.from('consents').insert({ kind: 'health_data', granted: false, version: CONSENT_VERSION })
  redirect('/onboarding?step=consent')
}

/** GDPR Art. 17: deletes the auth user; every user table cascades (ON DELETE CASCADE) and files are removed. */
export async function deleteAccount(formData: FormData) {
  const s = await getSession()
  if (!s) redirect('/login')
  if (formData.get('confirm') !== 'DELETE') redirect('/settings?delete=confirm')
  const admin = createServiceClient()
  for (const bucket of ['progress-photos', 'lab-reports']) {
    const { data } = await admin.storage.from(bucket).list(s.user.id, { limit: 1000 })
    if (data?.length) await admin.storage.from(bucket).remove(data.map((f) => `${s.user.id}/${f.name}`))
  }
  const { error } = await admin.auth.admin.deleteUser(s.user.id)
  if (error) redirect('/settings?delete=error')
  await s.supabase.auth.signOut()
  redirect('/?deleted=1')
}
