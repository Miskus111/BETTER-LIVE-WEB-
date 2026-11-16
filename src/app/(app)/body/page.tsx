import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Scale } from 'lucide-react'
import { AnatomyExplorer } from '@/components/anatomy/AnatomyExplorer'

/** Body tab: the interactive anatomy (muscle heat-map and InBody overlays arrive in later phases). */
export default async function BodyPage() {
  const t = await getTranslations('nav')
  const w = await getTranslations('weight')
  return (
    <div className="-mx-4 md:-mx-8">
      <h1 className="sr-only">{t('body')}</h1>
      <div className="px-4 pt-1 pb-3 md:px-8">
        <Link
          href="/body/weight"
          className="card hover:border-cyan/40 flex items-center gap-3 p-4 transition"
          data-testid="weight-link"
        >
          <Scale size={20} className="text-cyan shrink-0" aria-hidden />
          <span className="flex-1">
            <span className="block text-[15px] font-medium">{w('bodyLink')}</span>
            <span className="text-subtle block text-[13px]">{w('bodyLinkHint')}</span>
          </span>
          <ArrowRight size={17} className="text-cyan" aria-hidden />
        </Link>
      </div>
      <AnatomyExplorer mobilePanel="inline" />
    </div>
  )
}
