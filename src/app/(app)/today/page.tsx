import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Apple, Bed, Bot, Droplets, Dumbbell, Footprints, Gauge, Activity, Pill } from 'lucide-react'
import { requireAppUser } from '@/lib/auth'

export default async function TodayPage() {
  const { profile } = await requireAppUser()
  const t = await getTranslations('today')
  const nav = await getTranslations('nav')
  const cards = [
    { href: '/train', icon: Dumbbell, label: t('workout') },
    { href: '/eat', icon: Apple, label: t('meals') },
    { href: '/supplements', icon: Pill, label: t('supplements') },
    { href: '/mobility', icon: Activity, label: t('mobility') },
    { href: '/eat', icon: Droplets, label: t('water') },
    { href: '/body', icon: Bed, label: t('sleep') },
    { href: '/body', icon: Footprints, label: t('steps') },
    { href: '/mobility', icon: Gauge, label: t('pain') },
  ]
  return (
    <div>
      <p className="eyebrow">{t('subtitle')}</p>
      <h1 className="display mt-2 text-[44px] md:text-[56px]">
        {t('greeting', { name: profile?.display_name ?? '' })}
      </h1>

      <section className="card mt-6 flex gap-4 p-5" aria-label={t('coach')}>
        <Bot size={22} className="text-cyan shrink-0" aria-hidden />
        <div>
          <p className="text-subtle font-mono text-[12px] uppercase">{t('coach')}</p>
          <p className="mt-1 text-[15px]">{t('coachDefault')}</p>
          <Link href="/coach" className="link mt-2 inline-block text-[14px]">
            {nav('coach')} →
          </Link>
        </div>
      </section>

      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              className="card hover:border-cyan/40 flex h-full flex-col gap-4 p-4 transition"
            >
              <c.icon size={20} className="text-cyan" aria-hidden />
              <span>
                <span className="block text-[15px] font-medium">{c.label}</span>
                <span className="text-subtle text-[13px]">{t('empty')}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
