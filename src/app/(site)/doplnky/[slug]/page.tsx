import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle, ChevronRight, Salad } from 'lucide-react'
import { ABSORPTION } from '@/data/absorption'
import { NUTRIENTS } from '@/data/nutrients'
import { REFERENCE } from '@/data/reference'
import { SUPPLEMENT_NUTRIENTS, SUPPLEMENT_SLUGS, nutrientBySlug, supplementHref } from '@/data/supplements'
import type { NutrientId } from '@/data/types'
import { NutrientGuide } from '@/components/supplements/NutrientGuide'
import { AppCta } from '@/components/home/AppCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'
import { RelatedGuides } from '@/components/guides/RelatedGuides'
import { Rich } from '@/components/glossary/Rich'
import { COMPOUNDS, COMPOUND_BY_SLUG } from '@/data/compounds'
import { CompoundArticle, compoundTitle } from '@/components/supplements/CompoundArticle'

const UPDATED = '2026-11-16'

export function generateStaticParams() {
  return [
    ...SUPPLEMENT_NUTRIENTS.filter((id) => SUPPLEMENT_SLUGS[id]).map((id) => ({
      slug: SUPPLEMENT_SLUGS[id]!,
    })),
    ...COMPOUNDS.map((c) => ({ slug: c.slug })),
  ]
}

const clip = (s: string, n = 155) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(' ', n - 1))}…`)

function describe(id: NutrientId) {
  const n = NUTRIENTS[id]
  const a = ABSORPTION[id]
  const best = a?.forms.find((f) => f.rating === 'nejlepší')?.name
  const r = REFERENCE[id]
  return clip(
    [
      best ? `Nejlépe vstřebatelná forma: ${best}.` : n.blurb,
      r?.efsa ? `Doporučení EFSA: ${r.efsa.text}.` : '',
      r?.ul ? `Horní limit: ${r.ul.text}.` : '',
    ]
      .filter(Boolean)
      .join(' '),
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug
  const c = COMPOUND_BY_SLUG[slug]
  if (c) {
    const title = compoundTitle(c)
    const description = c.verdict.length > 155 ? `${c.verdict.slice(0, 152)}…` : c.verdict
    return {
      title,
      description,
      alternates: { canonical: `/doplnky/${c.slug}` },
      openGraph: { title, description, url: `/doplnky/${c.slug}`, type: 'article' },
    }
  }
  const id = nutrientBySlug(slug)
  if (!id) return {}
  const n = NUTRIENTS[id]
  const title = `${n.name} — nejlepší forma, dávka a referenční hodnoty`
  const description = describe(id)
  const url = supplementHref(id)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
  }
}

export default async function SupplementPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  if (COMPOUND_BY_SLUG[slug]) return <CompoundArticle c={COMPOUND_BY_SLUG[slug]} />
  const id = nutrientBySlug(slug)
  if (!id) notFound()
  const n = NUTRIENTS[id]
  const a = ABSORPTION[id]
  const seen = new Set<string>()
  const r = REFERENCE[id]
  const url = `${SITE.url}${supplementHref(id)}`
  const best = a?.forms.filter((f) => f.rating === 'nejlepší') ?? []

  // questions people actually search for, answered from the same data the page shows
  const faq = [
    r?.efsa && {
      q: `${n.name}: kolik denně potřebuji?`,
      a: `Doporučení EFSA pro dospělé: ${r.efsa.text}.${r.efsa.note ? ` ${r.efsa.note}` : ''}`,
    },
    best.length > 0 && {
      q: `${n.name}: která forma se vstřebává nejlépe?`,
      a: best.map((f) => `${f.name}: ${f.note}`).join(' '),
    },
    a?.when && { q: `${n.name}: kdy má smysl doplněk užívat?`, a: a.when },
    r?.ul && {
      q: `${n.name}: jaký je horní bezpečný limit?`,
      a: `${r.ul.text}.${r.ul.note ? ` ${r.ul.note}` : ''}`,
    },
  ].filter(Boolean) as { q: string; a: string }[]

  const idx = SUPPLEMENT_NUTRIENTS.indexOf(id)
  const related = SUPPLEMENT_NUTRIENTS.filter((x) => x !== id && SUPPLEMENT_SLUGS[x]).slice(0, 40)
  const neighbours = [SUPPLEMENT_NUTRIENTS[idx - 1], SUPPLEMENT_NUTRIENTS[idx + 1]].filter(Boolean)

  return (
    <article className="mx-auto max-w-[1100px] px-4 pt-8 pb-10 md:px-8 md:pt-12">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${n.name} — nejlepší forma, dávka a referenční hodnoty`,
            description: describe(id),
            inLanguage: 'cs',
            dateModified: UPDATED,
            mainEntityOfPage: url,
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            about: { '@type': 'DietarySupplement', name: n.name },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Domů', item: SITE.url },
              { '@type': 'ListItem', position: 2, name: 'Doplňky stravy', item: `${SITE.url}/doplnky` },
              { '@type': 'ListItem', position: 3, name: n.name, item: url },
            ],
          },
          ...(faq.length
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faq.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                  })),
                },
              ]
            : []),
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
        <Link href="/doplnky" className="hover:text-fg">
          Doplňky stravy
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page" className="text-muted">
          {n.name}
        </span>
      </nav>

      <header className="mt-5 max-w-3xl">
        <p className="eyebrow">{n.kind}</p>
        <h1 className="display mt-3 text-[44px] md:text-[64px]">{n.name}</h1>
        <p className="text-muted mt-3 text-[16.5px]">
          <Rich text={n.blurb} seen={seen} />
        </p>
        {a?.when && (
          <p className="border-bio/25 bg-bio/[0.05] mt-5 flex gap-2 rounded-xl border p-3.5 text-[14.5px]">
            <Salad size={17} className="text-bio mt-0.5 shrink-0" aria-hidden />
            <span>
              <strong className="font-medium">Kdy má doplněk smysl: </strong>
              <Rich text={a.when} seen={seen} />
            </span>
          </p>
        )}
      </header>

      <div className="mt-10">
        <NutrientGuide id={id} standalone />
      </div>

      {n.functions && n.functions.length > 0 && (
        <section className="mt-12 max-w-3xl" aria-labelledby="claims">
          <h2 id="claims" className="display text-[30px] md:text-[38px]">
            Funkce v těle
          </h2>
          <p className="text-subtle mt-1 text-[13.5px]">
            Schválená zdravotní tvrzení EU (nařízení 432/2012).
          </p>
          <ul className="mt-4 grid gap-2 text-[15px]">
            {n.functions.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="bg-cyan mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden /> {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {faq.length > 0 && (
        <section className="mt-12 max-w-3xl" aria-labelledby="faq">
          <h2 id="faq" className="display text-[30px] md:text-[38px]">
            Časté otázky
          </h2>
          <div className="mt-4 grid gap-3">
            {faq.map((f) => (
              <details key={f.q} className="card p-4">
                <summary className="cursor-pointer text-[15.5px] font-medium">{f.q}</summary>
                <p className="text-muted mt-2 text-[14.5px]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <aside className="border-warn/25 bg-warn/[0.04] mt-12 flex gap-3 rounded-2xl border p-5 text-[14px]">
        <AlertTriangle size={18} className="text-warn mt-0.5 shrink-0" aria-hidden />
        <p>
          Vzdělávací obsah, ne lékařská rada. Při užívání léků, v těhotenství, při kojení nebo chronickém
          onemocnění probírejte doplňky s lékařem nebo lékárníkem. Aktualizováno{' '}
          {new Date(UPDATED).toLocaleDateString('cs-CZ')}.
        </p>
      </aside>

      {neighbours.length > 0 && (
        <nav aria-label="Další živiny" className="mt-10 grid gap-3 sm:grid-cols-2">
          {neighbours.map((x, i) => (
            <Link
              key={x}
              href={supplementHref(x)}
              className="card hover:border-cyan/40 p-4 transition"
              rel={i === 0 && idx > 0 ? 'prev' : 'next'}
            >
              <span className="text-subtle block text-[12.5px]">
                {i === 0 && idx > 0 ? '← Předchozí' : 'Další →'}
              </span>
              <span className="mt-0.5 block text-[15.5px] font-medium">{NUTRIENTS[x].name}</span>
            </Link>
          ))}
        </nav>
      )}

      <RelatedGuides href={supplementHref(id)} className="mt-10" />

      <section className="mt-10" aria-labelledby="all">
        <h2 id="all" className="eyebrow mb-3">
          Všechny průvodce doplňky
        </h2>
        <div className="flex flex-wrap gap-2">
          {related.map((x) => (
            <Link key={x} href={supplementHref(x)} className="chip">
              {NUTRIENTS[x].name}
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
