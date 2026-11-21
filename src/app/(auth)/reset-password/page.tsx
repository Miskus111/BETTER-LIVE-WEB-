import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import { SetupNotice } from '@/components/app/SetupNotice'
import { NewPasswordForm } from './NewPasswordForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth')
  return { title: t('newPasswordTitle'), robots: { index: false } }
}

/** Landing page of the reset e-mail: /auth/callback has already turned the link into a session. */
export default async function ResetPasswordPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />
  const t = await getTranslations('auth')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return (
      <div className="mx-auto max-w-md px-5 pt-16 pb-16">
        <h1 className="display text-[40px]">{t('resetTitle')}</h1>
        <p className="mt-4 text-[16px]">{t('resetExpired')}</p>
        <Link href="/login" className="btn btn-primary mt-6">
          {t('backToLogin')}
        </Link>
      </div>
    )
  return <NewPasswordForm />
}
