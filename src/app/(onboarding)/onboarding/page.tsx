import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { getSession } from '@/lib/auth'
import { SetupNotice } from '@/components/app/SetupNotice'
import { OnboardingWizard, type WizardInitial } from './OnboardingWizard'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('onboarding')
  return { title: t('title'), robots: { index: false } }
}

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ step?: string }> }) {
  if (!isSupabaseConfigured()) return <SetupNotice />
  const s = await getSession()
  if (!s) redirect('/login?next=/onboarding')
  const { step } = await searchParams
  const [{ data: prefs }, { data: goals }] = await Promise.all([
    s.supabase.from('preferences').select('*').eq('user_id', s.user.id).maybeSingle(),
    s.supabase.from('goals').select('goal').order('priority'),
  ])
  const p = s.profile
  const initial: WizardInitial = {
    displayName: p?.display_name ?? '',
    birthDate: p?.birth_date ?? '',
    sex: p?.sex ?? undefined,
    heightCm: p?.height_cm?.toString() ?? '',
    weightKg: p?.weight_kg?.toString() ?? '',
    adultConfirmed: p?.birth_date ? true : undefined,
    goals: (goals ?? []).map((g) => g.goal),
    sports: (prefs?.sports ?? []) as WizardInitial['sports'],
    experience: p?.experience ?? undefined,
    trainingDays: prefs?.training_days?.toString() ?? '3',
    sessionMinutes: prefs?.session_minutes?.toString() ?? '60',
    equipment: (prefs?.equipment ?? []) as WizardInitial['equipment'],
    dietType: prefs?.diet_type ?? undefined,
    allergies: (prefs?.allergies ?? []).filter((a) => !a.includes(' ')) as WizardInitial['allergies'],
    allergiesOther: '',
    dislikes: (prefs?.dislikes ?? []).join(', '),
    budget: prefs?.budget ?? undefined,
    painAreas: (prefs?.pain_areas ?? []) as WizardInitial['painAreas'],
    medications: prefs?.medications ?? '',
    sleepHours: prefs?.sleep_hours?.toString() ?? '7',
    workPattern: prefs?.work_pattern ?? undefined,
    healthData: s.healthConsent || undefined,
    terms: s.healthConsent || undefined,
  }
  return <OnboardingWizard initial={initial} startAtConsent={step === 'consent' && !!p?.onboarded_at} />
}
