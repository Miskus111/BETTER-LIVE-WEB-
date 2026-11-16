'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { setLocale } from '@/i18n/actions'
import { LOCALES } from '@/i18n/config'
import { cx } from '@/lib/format'

export function LanguageSwitch({ className }: { className?: string }) {
  const locale = useLocale()
  const t = useTranslations('common')
  const router = useRouter()
  const [pending, start] = useTransition()
  return (
    <div
      role="group"
      aria-label={t('language')}
      className={cx('border-line inline-flex rounded-full border p-0.5', className)}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={locale === l}
          disabled={pending}
          onClick={() =>
            start(async () => {
              await setLocale(l)
              router.refresh()
            })
          }
          className={cx(
            'rounded-full px-2.5 py-1 font-mono text-[12px] uppercase transition',
            locale === l ? 'bg-cyan text-ink' : 'text-muted hover:text-fg',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
