import { getTranslations } from 'next-intl/server'
import { ComingSoon } from '@/components/app/ComingSoon'

export default async function CoachPage() {
  const t = await getTranslations('nav')
  return <ComingSoon title={t('coach')} />
}
