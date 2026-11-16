import { getTranslations } from 'next-intl/server'
import { ComingSoon } from '@/components/app/ComingSoon'

export default async function LooksPage() {
  const t = await getTranslations('nav')
  return <ComingSoon title={t('looks')} related={[{ href: '/looksmaxing', label: 'Looksmaxing' }]} />
}
