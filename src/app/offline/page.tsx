import { getTranslations } from 'next-intl/server'
import { WifiOff } from 'lucide-react'

export const dynamic = 'force-static'

export default async function OfflinePage() {
  const t = await getTranslations({ locale: 'cs', namespace: 'common' })
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-6 text-center">
      <div>
        <WifiOff className="text-warn mx-auto" size={32} aria-hidden />
        <h1 className="display mt-4 text-[36px]">{t('offlineTitle')}</h1>
        <p className="text-muted mt-2 text-[15px]">{t('offlineBody')}</p>
        <a href="/train" className="btn btn-primary mt-6">
          {t('offlineTrain')}
        </a>
      </div>
    </main>
  )
}
