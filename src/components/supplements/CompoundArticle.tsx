import Link from 'next/link'
import { AlertTriangle, BadgeCheck, ChevronRight, Clock, Pill, Scale, Users } from 'lucide-react'
import { COMPOUNDS, GOALS, type Compound } from '@/data/compounds'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { AppCta } from '@/components/home/AppCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'
import { RelatedGuides } from '@/components/guides/RelatedGuides'

const UPDATED = '2026-11-16'

export const compoundTitle = (c: Compound) => `${c.name} — co opravdu umí, dávka a bezpečnost`

/** Full guide for a non-vitamin supplement (creatine, caffeine, L-theanine…). */
export function CompoundArticle({ c }: { c: Compound }) {
  const url = `${SITE.url}/doplnky/${c.slug}`
  const faq = [
    { q: `${c.name}: funguje to?`, a: `${c.verdict} ${c.effects.map((e) => e.text).join(' ')}` },
    { q: `${c.name}: kolik a kdy užívat?`, a: `${c.dose} ${c.timing}` },
    { q: `${c.name}: je to bezpečné?`, a: c.caution.join(' ') },
  ]
  const sameGoal = COMPOUNDS.filter((x) => x.goal === c.goal && x.id !== c.id)
  const others = COMPOUNDS.filter((x) => x.goal !== c.goal)

  return (
    <article className="mx-auto max-w-[1000px] px-4 pt-8 pb-10 md:px-8 md:pt-12">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: compoundTitle(c),
            description: c.verdict,
            inLanguage: 'cs',
            dateModified: UPDATED,
            mainEntityOfPage: url,
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            about: { '@type': 'DietarySupplement', name: c.name },
            citation: c.sources.map((s) => s.url),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Domů', item: SITE.url },
              { '@type': 'ListItem', position: 2, name: 'Doplňky stravy', item: `${SITE.url}/doplnky` },
              { '@type': 'ListItem', position: 3, name: c.name, item: url },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]}
      />

      <nav
        aria-label="Drobečková navigace"
        className="text-subtle flex flex-wrap items-center gap-1 text-[13.5px]"
      >
        <Link href="/" className="hover:text-fg">
          Domů
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link href="/doplnky#latky" className="hover:text-fg">
          Doplňky stravy
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page" className="text-muted">
          {c.name}
        </span>
      </nav>

      <header className="mt-5 max-w-3xl">
        <p className="eyebrow">{GOALS[c.goal].label}</p>
        <h1 className="display mt-3 text-[44px] md:text-[64px]">{c.name}</h1>
        {c.aka && <p className="text-subtle mt-1 font-mono text-[13px]">{c.aka}</p>}
        <p
          className="border-cyan/30 bg-cyan/[0.05] mt-5 rounded-xl border p-4 text-[16px]"
          data-testid="verdict"
        >
          <strong className="font-medium">Verdikt: </strong>
          {c.verdict}
        </p>
        <p className="text-muted mt-4 text-[15.5px]">{c.what}</p>
      </header>

      <section className="mt-10" aria-labelledby="effects">
        <h2 id="effects" className="display text-[30px] md:text-[38px]">
          Co říká výzkum
        </h2>
        <ul className="mt-4 grid gap-3">
          {c.effects.map((e) => (
            <li key={e.text} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4">
              <EvidenceBadge level={e.level} className="self-start" />
              <span className="text-[15px]">{e.text}</span>
            </li>
          ))}
        </ul>
        {c.euClaim && (
          <p className="text-muted mt-4 flex gap-2 text-[14.5px]">
            <BadgeCheck size={18} className="text-cyan mt-0.5 shrink-0" aria-hidden />
            <span>
              <strong className="text-fg font-medium">Schválené tvrzení EU: </strong>
              {c.euClaim}
            </span>
          </p>
        )}
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-3" aria-label="Jak užívat">
        {[
          { icon: Pill, title: 'Dávka', text: c.dose },
          { icon: Clock, title: 'Kdy', text: c.timing },
          { icon: Users, title: 'Pro koho', text: c.forWhom },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-4">
            <p className="eyebrow flex items-center gap-1.5">
              <Icon size={14} aria-hidden /> {title}
            </p>
            <p className="mt-2 text-[14.5px]">{text}</p>
          </div>
        ))}
      </section>

      <section
        className="border-warn/25 bg-warn/[0.04] mt-10 rounded-2xl border p-5"
        aria-labelledby="caution"
      >
        <h2 id="caution" className="flex items-center gap-2 text-[18px] font-medium">
          <AlertTriangle size={18} className="text-warn" aria-hidden /> Bezpečnost a na co si dát pozor
        </h2>
        <ul className="mt-3 grid gap-2 text-[14.5px]">
          {c.caution.map((x) => (
            <li key={x} className="flex gap-2">
              <span className="bg-warn mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden /> {x}
            </li>
          ))}
        </ul>
        {c.regulation && (
          <p className="text-muted mt-4 flex gap-2 text-[14px]">
            <Scale size={16} className="mt-0.5 shrink-0" aria-hidden /> {c.regulation}
          </p>
        )}
      </section>

      {c.myths && c.myths.length > 0 && (
        <section className="mt-10" aria-labelledby="myths">
          <h2 id="myths" className="display text-[30px] md:text-[38px]">
            Mýty
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {c.myths.map((m) => (
              <li key={m.myth} className="card p-4">
                <p className="text-[15px] font-medium line-through decoration-[#ff9b9b]/60">„{m.myth}“</p>
                <p className="text-muted mt-1.5 text-[14.5px]">{m.fact}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="sources">
        <h2 id="sources" className="eyebrow mb-2">
          Zdroje
        </h2>
        <ul className="space-y-1">
          {c.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer noopener" className="link text-[13.5px]">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-subtle mt-3 text-[13px]">
          Vzdělávací obsah, ne lékařská rada. Při užívání léků, v těhotenství, při kojení nebo nemoci se
          poraďte s lékařem či lékárníkem. Aktualizováno {new Date(UPDATED).toLocaleDateString('cs-CZ')}.
        </p>
      </section>

      <RelatedGuides href={`/doplnky/${c.slug}`} className="mt-10" />

      <section className="mt-10" aria-labelledby="more">
        <h2 id="more" className="eyebrow mb-3">
          {sameGoal.length ? `Další v kategorii ${GOALS[c.goal].label.toLowerCase()}` : 'Další doplňky'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {[...sameGoal, ...others].map((x) => (
            <Link key={x.id} href={`/doplnky/${x.slug}`} className="chip">
              {x.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="-mx-4 md:-mx-8">
        <AppCta />
      </div>
    </article>
  )
}
