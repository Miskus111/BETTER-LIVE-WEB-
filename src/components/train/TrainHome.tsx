'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { BookOpen, CheckCircle2, CloudOff, History, Play, Trophy } from 'lucide-react'
import { useSession } from '@/lib/train/session-store'
import { syncQueue } from '@/lib/train/sync'
import { useHydrated } from '@/lib/useHydrated'
import { EXERCISES } from '@/data/exercises'
import { TEMPLATES } from '@/data/exercises/templates'

export function TrainHome({ finished, base = '/train' }: { finished: boolean; base?: string }) {
  const t = useTranslations('train')
  const locale = useLocale() === 'en' ? 'en' : 'cs'
  const router = useRouter()
  const hydrated = useHydrated()
  const { active, queue, start } = useSession()
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

  // retry pending uploads on load and whenever the device comes back online
  useEffect(() => {
    const run = () =>
      syncQueue().then((r) => {
        if (r.failed) setSyncMsg(t('syncError'))
      })
    run()
    window.addEventListener('online', run)
    return () => window.removeEventListener('online', run)
  }, [t])

  const pending = hydrated ? queue.filter((w) => !w.synced) : []

  return (
    <div>
      <h1 className="display text-[44px] md:text-[56px]">{t('title')}</h1>
      {finished && (
        <p
          className="border-bio/30 bg-bio/[0.06] mt-4 flex gap-2 rounded-xl border p-3 text-[14.5px]"
          role="status"
        >
          <CheckCircle2 size={17} className="text-bio mt-0.5 shrink-0" aria-hidden /> {t('saved')}
        </p>
      )}
      {pending.length > 0 && (
        <p
          className="border-warn/30 bg-warn/[0.06] mt-4 flex gap-2 rounded-xl border p-3 text-[14.5px]"
          role="status"
        >
          <CloudOff size={17} className="text-warn mt-0.5 shrink-0" aria-hidden />
          {t('pending')}: {pending.length} {syncMsg && `· ${syncMsg} (${pending[0].error ?? ''})`}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {hydrated && active ? (
          <Link href={`${base}/session`} className="btn btn-primary !py-3" data-testid="resume-workout">
            <Play size={17} aria-hidden /> {t('resume')}
          </Link>
        ) : (
          <button
            type="button"
            className="btn btn-primary !py-3"
            data-testid="start-workout"
            onClick={() => {
              start()
              router.push(`${base}/session`)
            }}
          >
            <Play size={17} aria-hidden /> {t('start')}
          </button>
        )}
        <Link href="/train/sport" className="btn btn-ghost !py-3">
          {t('sport')}
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="eyebrow mb-3">{t('templates')}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((tpl) => (
            <li key={tpl.id}>
              <button
                type="button"
                disabled={hydrated && !!active}
                onClick={() => {
                  start(tpl.name[locale], tpl.exercises)
                  router.push(`${base}/session`)
                }}
                className="card hover:border-cyan/40 h-full w-full p-4 text-left transition disabled:opacity-50"
              >
                <span className="block text-[15.5px] font-medium">{tpl.name[locale]}</span>
                <span className="text-subtle mt-1 block text-[13px]">{tpl.description[locale]}</span>
                <span className="text-cyan mt-2 block font-mono text-[12px]">
                  {tpl.exercises.length} {t('exercises')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <nav className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link href="/train/exercises" className="card hover:border-cyan/40 flex items-center gap-3 p-4">
          <BookOpen size={19} className="text-cyan" aria-hidden />
          <span>
            {t('library')} <span className="text-subtle font-mono text-[12px]">({EXERCISES.length})</span>
          </span>
        </Link>
        <Link href="/train/history" className="card hover:border-cyan/40 flex items-center gap-3 p-4">
          <History size={19} className="text-cyan" aria-hidden /> {t('history')}
        </Link>
        <Link href="/train/history#prs" className="card hover:border-cyan/40 flex items-center gap-3 p-4">
          <Trophy size={19} className="text-cyan" aria-hidden /> {t('prs')}
        </Link>
      </nav>
    </div>
  )
}
