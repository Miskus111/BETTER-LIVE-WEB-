import { getTranslations } from 'next-intl/server'
import { ComingSoon } from '@/components/app/ComingSoon'

export default async function TrainPage() {
  const t = await getTranslations('nav')
  return <ComingSoon title={t('train')} related={[{ href: '/organ/muscles', label: t('body') }]} />
}
