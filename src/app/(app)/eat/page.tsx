import { getTranslations } from 'next-intl/server'
import { ComingSoon } from '@/components/app/ComingSoon'

export default async function EatPage() {
  const t = await getTranslations('nav')
  return (
    <ComingSoon
      title={t('eat')}
      related={[
        { href: '/#foods', label: 'Food explorer' },
        { href: '/#nutrients', label: 'Nutrients' },
      ]}
    />
  )
}
