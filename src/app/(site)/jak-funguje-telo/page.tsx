import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, HelpCircle } from 'lucide-react'
import { BODY_GUIDES } from '@/data/body-guides'
import { Suspense } from 'react'
import { GuideIcon } from '@/components/guides/GuideIcon'
import { GuidesBrowser } from '@/components/guides/GuidesBrowser'
import { EvidenceLegend } from '@/components/ui/EvidenceBadge'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Jak funguje tělo — spánek, stres, dopamin, svaly a střeva srozumitelně',
  description:
    'Krátcí průvodci o tom, jak tělo funguje v dnešním světě obrazovek, kofeinu a sezení. Co se děje uvnitř, co reálně pomáhá a které mýty pustit z hlavy.',
  alternates: { canonical: '/jak-funguje-telo' },
}

export default function BodyGuidesHub() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-16 md:px-8 md:pt-14">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Jak funguje tělo',
          itemListElement: BODY_GUIDES.map((g, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE.url}/jak-funguje-telo/${g.slug}`,
            name: g.title,
          })),
        }}
      />
      <header className="max-w-3xl">
        <p className="eyebrow">Jak funguje tělo</p>
        <h1 className="display mt-3 text-[48px] md:text-[72px]">
          Manuál k tělu, <em className="text-cyan">který ve škole nedali.</em>
        </h1>
        <p className="text-muted mt-4 text-[16.5px]">
          Proč po kávě přijde propad, co dělá mobil s mozkem, kolik kroků je dost a proč spánek nejde dohnat o
          víkendu. Krátce, bez strašení a se zdroji — u každé rady vidíte, jak silné jsou důkazy.
        </p>
        <Link
          href="/jak-funguje-telo/kviz"
          className="border-cyan/30 bg-cyan/[0.05] hover:border-cyan/60 mt-6 inline-flex items-center gap-3 rounded-2xl border px-4 py-3 transition"
          data-testid="quiz-link"
        >
          <HelpCircle size={20} className="text-cyan shrink-0" aria-hidden />
          <span>
            <span className="block text-[15px] font-medium">Mýtus, nebo fakt?</span>
            <span className="text-muted block text-[13.5px]">Otestujte se v kvízu na 10 otázek</span>
          </span>
          <ArrowRight size={16} className="text-cyan" aria-hidden />
        </Link>
      </header>

      {/* the full list is rendered on the server inside Suspense fallback, so search engines see every guide */}
      <Suspense fallback={<StaticList />}>
        <GuidesBrowser />
      </Suspense>

      <section className="card mt-12 p-5 md:p-6" aria-labelledby="levels">
        <h2 id="levels" className="text-[18px] font-medium">
          Jak čtete hodnocení důkazů
        </h2>
        <div className="mt-4">
          <EvidenceLegend />
        </div>
      </section>
    </div>
  )
}

function StaticList() {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {BODY_GUIDES.map((g) => (
        <li key={g.slug}>
          <Link
            href={`/jak-funguje-telo/${g.slug}`}
            className="card hover:border-cyan/40 flex h-full flex-col p-5 transition"
          >
            <span className="bg-cyan/10 text-cyan grid h-10 w-10 place-items-center rounded-xl">
              <GuideIcon icon={g.icon} />
            </span>
            <span className="mt-4 text-[17px] leading-snug font-medium">{g.title}</span>
            <span className="text-muted mt-2 text-[14px]">{g.hook}</span>
            <span className="text-cyan mt-auto inline-flex items-center gap-1 pt-4 text-[13.5px]">
              Číst <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
