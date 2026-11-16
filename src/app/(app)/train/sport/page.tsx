import { getTranslations } from 'next-intl/server'
import { SportForm } from '@/components/train/SportForm'

export default async function SportPage() {
  const t = await getTranslations('train')
  return (
    <div>
      <h1 className="display mb-6 text-[40px]">{t('sportTitle')}</h1>
      <SportForm />
    </div>
  )
}
