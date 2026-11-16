import { getTranslations } from 'next-intl/server'
import { AnatomyExplorer } from '@/components/anatomy/AnatomyExplorer'

/** Body tab: the interactive anatomy (muscle heat-map and InBody overlays arrive in later phases). */
export default async function BodyPage() {
  const t = await getTranslations('nav')
  return (
    <div className="-mx-4 md:-mx-8">
      <h1 className="sr-only">{t('body')}</h1>
      <AnatomyExplorer mobilePanel="inline" />
    </div>
  )
}
