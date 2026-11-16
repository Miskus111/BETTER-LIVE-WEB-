import { getTranslations } from 'next-intl/server'
import { ComingSoon } from '@/components/app/ComingSoon'

export default async function StorePage() {
  const t = await getTranslations('nav')
  return (
    <ComingSoon
      title={t('store')}
      related={[
        { href: '/doplnky', label: t('supplements') },
        { href: '/jak-doporucujeme', label: 'Jak doporučujeme' },
      ]}
    />
  )
}
