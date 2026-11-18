import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { GLOSSARY, type GlossaryTerm } from '@/data/glossary'
import { BODY_GUIDE_BY_SLUG } from '@/data/body-guides'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Slovník pojmů — tělo, výživa a věda srozumitelně',
  description:
    'Adenosin, kortizol, inzulinová rezistence, metaanalýza… Krátká a přesná vysvětlení odborných slov, se kterými se setkáte v průvodcích o těle.',
  alternates: { canonical: '/jak-funguje-telo/slovnik' },
}

const GROUPS: { id: GlossaryTerm['group']; label: string; intro: string }[] = [
  { id: 'telo', label: 'Tělo a mozek', intro: 'Co se děje uvnitř: hormony, orgány, imunita, učení.' },
  {
    id: 'organy',
    label: 'Orgány a buňky',
    intro: 'Stavební kameny těla — slova, která potkáte u jednotlivých orgánů.',
  },
  { id: 'jidlo', label: 'Jídlo', intro: 'Pojmy, které potkáte na obalech i v diskuzích o stravě.' },
  { id: 'pohyb', label: 'Pohyb', intro: 'Jak svaly a klouby reagují na zátěž.' },
  {
    id: 'veda',
    label: 'Jak číst výzkum',
    intro: 'Díky těmhle slovům poznáte, jak silný je důkaz za tvrzením — a kdy jde jen o marketing.',
  },
]

const sortCs = (a: GlossaryTerm, b: GlossaryTerm) => a.term.localeCompare(b.term, 'cs')

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 pt-8 pb-16 md:px-8 md:pt-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTermSet',
          name: 'Slovník pojmů — BLWB',
          url: `${SITE.url}/jak-funguje-telo/slovnik`,
          inLanguage: 'cs',
          hasDefinedTerm: GLOSSARY.map((t) => ({
            '@type': 'DefinedTerm',
            name: t.term,
            description: t.def,
            url: `${SITE.url}/jak-funguje-telo/slovnik#${t.id}`,
          })),
        }}
      />
      <nav
        aria-label="Drobečková navigace"
        className="text-subtle flex flex-wrap items-center gap-1 text-[13.5px]"
      >
        <Link href="/" className="hover:text-fg">
          Domů
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link href="/jak-funguje-telo" className="hover:text-fg">
          Jak funguje tělo
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page" className="text-muted">
          Slovník
        </span>
      </nav>
      <header className="mt-5 max-w-2xl">
        <p className="eyebrow">Slovník pojmů</p>
        <h1 className="display mt-3 text-[44px] leading-[1.05] md:text-[64px]">
          Odborná slova, <em className="text-cyan">lidsky.</em>
        </h1>
        <p className="text-muted mt-3 text-[16.5px]">
          {GLOSSARY.length} pojmů, každý ve dvou větách. V průvodcích jsou podtržené tečkovaně — klepněte na
          ně a vysvětlení se ukáže přímo v textu.
        </p>
      </header>

      <nav aria-label="Skupiny pojmů" className="mt-8 flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <a key={g.id} href={`#${g.id}`} className="chip">
            {g.label}
          </a>
        ))}
      </nav>

      {GROUPS.map((g) => (
        <section key={g.id} className="mt-12" aria-labelledby={g.id}>
          <h2 id={g.id} className="display text-[30px] md:text-[38px]">
            {g.label}
          </h2>
          <p className="text-muted mt-1 text-[15px]">{g.intro}</p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {GLOSSARY.filter((t) => t.group === g.id)
              .sort(sortCs)
              .map((t) => {
                const guide = t.guide ? BODY_GUIDE_BY_SLUG[t.guide] : undefined
                return (
                  <div key={t.id} id={t.id} className="card scroll-mt-24 p-4" data-testid="glossary-term">
                    <dt className="text-[16px] font-medium">{t.term}</dt>
                    <dd className="text-muted mt-1.5 text-[14.5px] leading-relaxed">{t.def}</dd>
                    {guide && (
                      <dd className="mt-3">
                        <Link
                          href={`/jak-funguje-telo/${guide.slug}`}
                          className="text-cyan inline-flex items-center gap-1 text-[13.5px]"
                        >
                          {guide.short} <ArrowRight size={13} aria-hidden />
                        </Link>
                      </dd>
                    )}
                  </div>
                )
              })}
          </dl>
        </section>
      ))}
    </div>
  )
}
