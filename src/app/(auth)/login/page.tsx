import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { SetupNotice } from '@/components/app/SetupNotice'
import { LoginForm } from './LoginForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth')
  return { title: t('title'), robots: { index: false } }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; mode?: string }>
}) {
  if (!isSupabaseConfigured()) return <SetupNotice />
  const { next, mode } = await searchParams
  // only allow relative in-app redirects
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/today'
  return <LoginForm next={safeNext} initialMode={mode === 'signup' ? 'signup' : 'signin'} />
}
