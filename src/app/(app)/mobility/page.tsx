import { getTranslations } from 'next-intl/server'
import { ComingSoon } from '@/components/app/ComingSoon'

export default async function MobilityPage() {
  const t = await getTranslations('nav')
  return <ComingSoon title={t('mobility')} related={[{ href: '/organ/bones', label: t('body') }]} />
}
