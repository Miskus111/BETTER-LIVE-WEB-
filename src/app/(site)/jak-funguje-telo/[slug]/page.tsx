import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ChevronRight, Clock, HelpCircle, Lightbulb, Target } from 'lucide-react'
import {
  BODY_GUIDES,
  BODY_GUIDE_BY_SLUG,
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY,
  type BodyGuide,
} from '@/data/body-guides'
import { GuideIcon } from '@/components/guides/GuideIcon'
import { ShareButton } from '@/components/guides/ShareButton'
import { Rich } from '@/components/glossary/Rich'
import { GUIDE_TOOLS } from '@/components/guides/tools'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { AppCta } from '@/components/home/AppCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'
import { PUBLISHED, modifiedAfter } from '@/data/published'

const UPDATED = '2026-11-18'

/** ~200 words per minute for Czech non-fiction on a phone */
function readingMinutes(g: BodyGuide) {
  const text = [
    g.hook,
    ...g.tldr,
    ...g.numbers.map((n) => n.label),
    ...g.how.flatMap((h) => [h.title, h.text]),
    ...g.today,
    ...g.helps.map((h) => h.text),
    ...g.myths.flatMap((m) => [m.myth, m.fact]),
  ].join(' ')
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200))
}

const TOC = [
  { id: 'how', label: 'Jak to funguje' },
  { id: 'today', label: 'Dnešní svět' },
  { id: 'helps', label: 'Co pomáhá' },
  { id: 'myths', label: 'Mýty' },
  { id: 'sources', label: 'Zdroje' },
]

export function generateStaticParams() {
  return BODY_GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = BODY_GUIDE_BY_SLUG[(await params).slug]
  if (!g) return {}
  const url = `/jak-funguje-telo/${g.slug}`
  return {
    title: g.title,
    description: g.hook,
    alternates: { canonical: url },
    openGraph: { title: g.title, description: g.hook, url, type: 'article' },
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = BODY_GUIDE_BY_SLUG[(await params).slug]
  if (!g) notFound()
  const url = `${SITE.url}/jak-funguje-telo/${g.slug}`
  const i = BODY_GUIDES.indexOf(g)
  const next = BODY_GUIDES[(i + 1) % BODY_GUIDES.length]
  const prev = BODY_GUIDES[(i - 1 + BODY_GUIDES.length) % BODY_GUIDES.length]
  const minutes = readingMinutes(g)
  // each glossary term is explained at its first appearance on the page
  const seen = new Set<string>()
  // one concrete, best-supported step to take this week
  const Tool = GUIDE_TOOLS[g.slug]
  const firstStep = g.helps.find((h) => h.level === 'established') ?? g.helps[0]
  const category = GUIDE_CATEGORIES.find((c) => c.id === GUIDE_CATEGORY[g.slug])

  return (
    <article className="mx-auto max-w-[900px] px-4 pt-8 pb-10 md:px-8 md:pt-12">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: g.title,
            description: g.hook,
            inLanguage: 'cs',
            datePublished: PUBLISHED[`/jak-funguje-telo/${g.slug}`],
            dateModified: modifiedAfter(PUBLISHED[`/jak-funguje-telo/${g.slug}`], UPDATED),
            author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            timeRequired: `PT${minutes}M`,
            mainEntityOfPage: url,
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            citation: g.sources.map((s) => s.url),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Domů', item: SITE.url },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Jak funguje tělo',
                item: `${SITE.url}/jak-funguje-telo`,
              },
              { '@type': 'ListItem', position: 3, name: g.short, item: url },
            ],
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
        <Link href="/jak-funguje-telo" className="hover:text-fg">
          Jak funguje tělo
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page" className="text-muted">
          {g.short}
        </span>
      </nav>

      <header className="mt-5">
        <span className="bg-cyan/10 text-cyan grid h-12 w-12 place-items-center rounded-2xl">
          <GuideIcon icon={g.icon} size={24} />
        </span>
        <h1 className="display mt-4 text-[40px] leading-[1.05] md:text-[60px]">{g.title}</h1>
        <p className="text-muted mt-3 text-[17px]">{g.hook}</p>
        <div className="text-subtle mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px]">
          <span className="inline-flex items-center gap-1.5" data-testid="reading-time">
            <Clock size={14} aria-hidden /> {minutes} min čtení
          </span>
          {category && (
            <Link href={`/jak-funguje-telo?k=${category.id}`} className="hover:text-fg">
              {category.label}
            </Link>
          )}
          <span>
            {g.sources.length} {g.sources.length === 1 ? 'zdroj' : g.sources.length < 5 ? 'zdroje' : 'zdrojů'}
          </span>
          <ShareButton
            title={g.title}
            text={g.hook}
            className="hover:text-fg inline-flex items-center gap-1.5"
          />
        </div>
      </header>

      <nav
        aria-label="Na této stránce"
        className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0"
        data-testid="toc"
      >
        {(Tool ? [{ id: 'try', label: 'Vyzkoušejte si' }, ...TOC] : TOC).map((t) => (
          <a key={t.id} href={`#${t.id}`} className="chip shrink-0">
            {t.label}
          </a>
        ))}
      </nav>

      <section className="card border-cyan/30 mt-8 p-5" aria-labelledby="tldr" data-testid="tldr">
        <h2 id="tldr" className="eyebrow">
          Ve zkratce
        </h2>
        <ul className="mt-3 grid gap-2 text-[15.5px]">
          {g.tldr.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="bg-cyan mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />{' '}
              <span>
                <Rich text={t} seen={seen} here={g.slug} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {firstStep && (
        <aside
          className="border-warn/30 bg-warn/[0.05] mt-4 flex gap-3 rounded-2xl border p-4"
          aria-label="Začněte tímhle"
          data-testid="first-step"
        >
          <Target size={20} className="text-warn mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="text-[13px] font-medium tracking-wide text-[#ffd27a] uppercase">Začněte tímhle</p>
            <p className="mt-1 text-[15.5px]">{firstStep.text}</p>
          </div>
        </aside>
      )}

      {g.numbers.length > 0 && (
        <dl
          className={`mt-6 grid gap-3 ${g.numbers.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}
        >
          {g.numbers.map((n) => (
            <div key={n.label} className="card p-3 sm:p-4">
              <dd className="font-mono text-[19px] sm:text-[24px]">{n.value}</dd>
              <dt className="text-subtle mt-1 text-[13px]">{n.label}</dt>
            </div>
          ))}
        </dl>
      )}

      <section className="mt-12" aria-labelledby="how">
        <h2 id="how" className="display text-[32px] md:text-[40px]">
          Jak to funguje
        </h2>
        <ol className="mt-5 grid gap-4">
          {g.how.map((h, n) => (
            <li key={h.title} className="flex gap-4">
              <span className="border-line text-cyan grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-[13px]">
                {n + 1}
              </span>
              <div>
                <h3 className="text-[17px] font-medium">{h.title}</h3>
                <p className="text-muted mt-1 text-[15px]">
                  <Rich text={h.text} seen={seen} here={g.slug} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {Tool && (
        <section className="mt-12" aria-labelledby="try">
          <h2 id="try" className="display text-[32px] md:text-[40px]">
            Vyzkoušejte si
          </h2>
          <div className="mt-4">
            <Tool />
          </div>
        </section>
      )}

      <section className="mt-12" aria-labelledby="today">
        <h2 id="today" className="display text-[32px] md:text-[40px]">
          Co s tím dělá dnešní svět
        </h2>
        <ul className="mt-4 grid gap-3">
          {g.today.map((t) => (
            <li key={t} className="flex gap-3 text-[15px]">
              <Lightbulb size={18} className="text-warn mt-0.5 shrink-0" aria-hidden />{' '}
              <span>
                <Rich text={t} seen={seen} here={g.slug} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="helps">
        <h2 id="helps" className="display text-[32px] md:text-[40px]">
          Co reálně pomáhá
        </h2>
        <ul className="mt-4 grid gap-3">
          {g.helps.map((h) => (
            <li key={h.text} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4">
              <EvidenceBadge level={h.level} className="self-start" />
              <span className="text-[15px]">
                <Rich text={h.text} seen={seen} here={g.slug} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="myths">
        <h2 id="myths" className="display text-[32px] md:text-[40px]">
          Mýty
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {g.myths.map((m) => (
            <li key={m.myth} className="card p-4">
              <p className="text-[15px] font-medium line-through decoration-[#ff9b9b]/60">„{m.myth}“</p>
              <p className="text-muted mt-1.5 text-[14.5px]">
                <Rich text={m.fact} seen={seen} here={g.slug} />
              </p>
            </li>
          ))}
        </ul>
      </section>

      {g.related.length > 0 && (
        <section className="mt-12" aria-labelledby="related">
          <h2 id="related" className="eyebrow mb-3">
            Souvisí
          </h2>
          <div className="flex flex-wrap gap-2">
            {g.related.map((r) => (
              <Link key={r.href} href={r.href} className="chip">
                {r.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12" aria-labelledby="sources">
        <h2 id="sources" className="eyebrow mb-2">
          Zdroje
        </h2>
        <ul className="space-y-1">
          {g.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer noopener" className="link text-[13.5px]">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-subtle mt-3 text-[13px]">
          Vzdělávací obsah, ne lékařská rada. Aktualizováno {new Date(UPDATED).toLocaleDateString('cs-CZ')}.
        </p>
      </section>

      <Link
        href="/jak-funguje-telo/kviz"
        className="border-cyan/30 bg-cyan/[0.05] hover:border-cyan/60 mt-10 flex items-center gap-3 rounded-2xl border p-4 transition"
      >
        <HelpCircle size={20} className="text-cyan shrink-0" aria-hidden />
        <span className="flex-1 text-[15px]">
          <strong className="font-medium">Mýtus, nebo fakt?</strong>{' '}
          <span className="text-muted">Vyzkoušejte, co si z průvodců pamatujete.</span>
        </span>
        <ArrowRight size={16} className="text-cyan shrink-0" aria-hidden />
      </Link>

      <nav aria-label="Další průvodci" className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link
          href={`/jak-funguje-telo/${prev.slug}`}
          className="card hover:border-cyan/40 flex items-center gap-3 p-4 transition"
          rel="prev"
        >
          <ArrowLeft size={18} className="text-cyan shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="text-subtle block text-[12.5px]">Předchozí</span>
            <span className="block truncate text-[15px] font-medium">{prev.short}</span>
          </span>
        </Link>
        <Link
          href={`/jak-funguje-telo/${next.slug}`}
          className="card hover:border-cyan/40 flex items-center gap-3 p-4 text-right transition"
          rel="next"
        >
          <span className="min-w-0 flex-1">
            <span className="text-subtle block text-[12.5px]">Další průvodce</span>
            <span className="block truncate text-[15px] font-medium">{next.short}</span>
          </span>
          <ArrowRight size={18} className="text-cyan shrink-0" aria-hidden />
        </Link>
      </nav>

      <div className="-mx-4 md:-mx-8">
        <AppCta />
      </div>
    </article>
  )
}
