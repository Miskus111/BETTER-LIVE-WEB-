import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Check, Minus, Sparkles } from 'lucide-react'
import { isFreeMode, PRICES, yearlySaving } from '@/lib/billing'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('billing')
  return {
    title: 'Ceník — tarify Zdarma a Pro',
    description: `${t('pricingIntro')} Pro za 199 Kč měsíčně: AI kouč, čtení laboratorních výsledků, grafy progresu a fotky pokroku.`,
    alternates: { canonical: '/pricing' },
  }
}

type Cell = boolean | string

export default async function PricingPage() {
  const t = await getTranslations('billing')
  const beta = isFreeMode()
  const nf = new Intl.NumberFormat('cs-CZ')

  const rows: [string, Cell, Cell][] = [
    [t('f_education'), true, true],
    [t('f_train'), true, true],
    [t('f_eat'), true, true],
    [t('f_supp'), true, true],
    [t('f_mobility'), true, true],
    [t('f_weight'), true, true],
    [t('f_labs_manual'), true, true],
    [t('f_export'), true, true],
    [t('f_coach'), t('f_coach_free'), t('f_coach_pro')],
    [t('f_labs_ai'), false, true],
    [t('f_progress'), false, true],
    [t('f_photos'), false, true],
  ]
  const cell = (c: Cell, label: string) =>
    typeof c === 'string' ? (
      <span className="text-[13.5px]">{c}</span>
    ) : c ? (
      <Check size={18} className="text-bio mx-auto" aria-label={label} />
    ) : (
      <Minus size={18} className="text-subtle mx-auto" aria-label={label} />
    )

  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-10 pb-20 md:px-8 md:pt-16">
      <header className="max-w-2xl">
        <p className="eyebrow">BLWB</p>
        <h1 className="display mt-3 text-[44px] md:text-[64px]">{t('pricingTitle')}</h1>
        <p className="text-muted mt-3 text-[16px]">{t('pricingIntro')}</p>
      </header>

      {beta && (
        <p
          className="card border-cyan/30 mt-8 flex items-start gap-3 p-4 text-[15px]"
          data-testid="beta-banner"
        >
          <Sparkles size={18} className="text-cyan mt-0.5 shrink-0" aria-hidden /> {t('betaBanner')}
        </p>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="card flex flex-col p-6" aria-labelledby="plan-free">
          <h2 id="plan-free" className="text-[20px] font-medium">
            {t('free')}
          </h2>
          <p className="mt-3 font-mono text-[34px]">{t('freePrice')}</p>
          <p className="text-subtle text-[14px]">{t('freeFor')}</p>
          <ul className="mt-5 grid gap-2 text-[14.5px]">
            {rows
              .filter(([, f]) => f === true)
              .slice(0, 6)
              .map(([label]) => (
                <li key={label} className="flex items-start gap-2">
                  <Check size={17} className="text-bio mt-0.5 shrink-0" aria-hidden /> {label}
                </li>
              ))}
          </ul>
          <div className="mt-auto pt-6">
            <Link href="/login?mode=signup" className="btn btn-ghost w-full">
              {t('startFree')}
            </Link>
          </div>
        </section>

        <section
          className="card border-cyan/40 relative flex flex-col p-6"
          aria-labelledby="plan-pro"
          data-testid="plan-pro"
        >
          <h2 id="plan-pro" className="flex items-center gap-2 text-[20px] font-medium">
            {t('pro')}
          </h2>
          <p className="mt-3 font-mono text-[34px]">
            {nf.format(PRICES.pro_month_czk)} <span className="text-muted text-[15px]">{t('perMonth')}</span>
          </p>
          <p className="text-subtle text-[14px]">
            {t('yearly')}: {nf.format(PRICES.pro_year_czk)} {t('perYear')} ·{' '}
            <span className="text-bio">{t('save', { pct: yearlySaving() })}</span>
          </p>
          <ul className="mt-5 grid gap-2 text-[14.5px]">
            {(['perk_coach', 'perk_labs', 'perk_progress', 'perk_photos'] as const).map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Check size={17} className="text-cyan mt-0.5 shrink-0" aria-hidden /> {t(p)}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            {beta ? (
              <Link href="/login?mode=signup" className="btn btn-primary w-full">
                {t('tryProBeta')}
              </Link>
            ) : (
              <button type="button" className="btn btn-primary w-full" disabled aria-disabled>
                {t('proSoon')}
              </button>
            )}
          </div>
        </section>
      </div>

      <section className="mt-14" aria-labelledby="compare-plans">
        <h2 id="compare-plans" className="text-[22px] font-medium">
          {t('compareTitle')}
        </h2>
        <div className="border-line relative mt-4 overflow-x-auto rounded-2xl border">
          <table className="w-full text-left text-[14.5px]">
            <thead className="text-subtle bg-white/[0.03] font-mono text-[12px] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal">{t('feature')}</th>
                <th className="w-24 px-2 py-3 text-center font-normal">{t('free')}</th>
                <th className="w-28 px-2 py-3 text-center font-normal">{t('pro')}</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {rows.map(([label, free, pro]) => (
                <tr key={label}>
                  <td className="px-4 py-3">{label}</td>
                  <td className="px-2 py-3 text-center">{cell(free, `${t('free')}: ${free ? '✓' : '—'}`)}</td>
                  <td className="px-2 py-3 text-center">{cell(pro, `${t('pro')}: ✓`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 max-w-3xl" aria-labelledby="faq">
        <h2 id="faq" className="text-[22px] font-medium">
          {t('faqTitle')}
        </h2>
        <div className="mt-4 grid gap-3">
          {(['1', '2', '3', '4'] as const).map((n) => (
            <details key={n} className="card group p-4">
              <summary className="cursor-pointer text-[15.5px] font-medium">{t(`q${n}`)}</summary>
              <p className="text-muted mt-2 text-[14.5px]">{t(`a${n}`)}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
