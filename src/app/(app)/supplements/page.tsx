import { getTranslations } from 'next-intl/server'
import { ComingSoon } from '@/components/app/ComingSoon'

export default async function SupplementsPage() {
  const t = await getTranslations('nav')
  return <ComingSoon title={t('supplements')} related={[{ href: '/doplnky', label: t('supplements') }]} />
}
