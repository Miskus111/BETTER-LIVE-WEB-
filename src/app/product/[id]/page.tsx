import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Factory, MapPin, ShieldCheck } from 'lucide-react'
import { NUTRIENTS } from '@/data/nutrients'
import { PRODUCT_BY_ID, PRODUCTS } from '@/data/products'
import type { NutrientId } from '@/data/types'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { BuyBox } from '@/components/shop/BuyBox'
import { CertBadge, ExtraBadges } from '@/components/shop/CertBadge'
import { ProductCard } from '@/components/shop/ProductCard'
import { SampleDataLabel } from '@/components/layout/SampleDataLabel'
import { OrganLink } from '@/components/ui/OrganLink'
import { NrvBar } from '@/components/ui/NrvBar'
import { MacroSplitBar } from '@/components/food/MacroSplitBar'
import { isVerifiedOrganic, pctRef, productFoods, productNutrition, productOrgans } from '@/lib/nutrition'

type Params = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const p = PRODUCT_BY_ID[id]
  if (!p) return {}
  return {
    title: p.name,
    description: `${p.description} ${p.origin}.`.slice(0, 158),
    alternates: { canonical: `/product/${p.id}` },
    openGraph: {
      title: p.name,
      description: p.shortDescription,
      url: `/product/${p.id}`,
      images: [p.images[0]],
    },
  }
}

/** Render ingredient list with organic ingredients (marked *) emphasised. */
function Ingredients({ text }: { text: string }) {
  const parts = text.split(/(\b[^,.*]+\*)/g)
  return (
    <p className="text-fg/90 text-[14.5px]">
      {parts.map((part, i) =>
        part.endsWith('*') ? (
          <strong key={i} className="text-bio font-medium">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  )
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params
  const p = PRODUCT_BY_ID[id]
  if (!p) notFound()
  const n = productNutrition(p)!
  const organs = productOrgans(p)
  const foods = productFoods(p)
  const verified = isVerifiedOrganic(p)
  const micros = (Object.entries(n.micros) as [NutrientId, number][]).sort(
    (a, b) => (pctRef(b[0], b[1]) ?? 0) - (pctRef(a[0], a[1]) ?? 0),
  )
  const related = PRODUCTS.filter(
    (x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c)),
  ).slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.images,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-6 md:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb">
        <ol className="text-subtle flex flex-wrap items-center gap-1 font-mono text-[12px]">
          <li>
            <Link href="/shop" className="hover:text-fg">
              Shop
            </Link>
          </li>
          <ChevronRight size={12} aria-hidden />
          <li>
            <Link href={`/shop?category=${encodeURIComponent(p.categories[0])}`} className="hover:text-fg">
              {p.categories[0]}
            </Link>
          </li>
          <ChevronRight size={12} aria-hidden />
          <li aria-current="page" className="text-muted">
            {p.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <ProductGallery images={p.images} name={p.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CertBadge product={p} size="md" />
            <ExtraBadges product={p} />
          </div>
          <h1 className="display mt-4 text-[42px] md:text-[54px]">{p.name}</h1>
          <p className="text-muted mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px]">
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} aria-hidden /> {p.origin}
            </span>
            <span>{p.size}</span>
          </p>
          <p className="text-fg/90 mt-4 text-[15.5px]">{p.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.highlights.map((h) => (
              <li key={h} className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[13px]">
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <BuyBox id={p.id} price={p.price} />
          </div>

          <section className="card mt-6 p-5" aria-labelledby="cert-h">
            <div className="flex items-center justify-between gap-2">
              <h2 id="cert-h" className="eyebrow flex items-center gap-2">
                <ShieldCheck size={14} aria-hidden /> Certification
              </h2>
              <SampleDataLabel />
            </div>
            <dl className="mt-4 grid grid-cols-[130px_1fr] gap-x-4 gap-y-2.5 text-[14.5px]">
              <dt className="text-subtle">Status</dt>
              <dd>
                {verified
                  ? 'Certified organic (EU)'
                  : p.certification.status === 'wild'
                    ? 'Wild-caught · not eligible for organic certification'
                    : 'Conventional — not organic certified'}
              </dd>
              <dt className="text-subtle">Control body</dt>
              <dd className="font-mono">{verified ? p.certification.controlBody : '—'}</dd>
              <dt className="text-subtle">Origin</dt>
              <dd>{p.origin}</dd>
              <dt className="text-subtle">Processing</dt>
              <dd className="flex items-start gap-1.5">
                <Factory size={14} className="text-subtle mt-1 shrink-0" aria-hidden />
                {p.processing}
              </dd>
              {p.pasture === 'verified' && (
                <>
                  <dt className="text-subtle">Pasture</dt>
                  <dd>Pasture access verified at inspection</dd>
                </>
              )}
            </dl>
            {p.certification.note && <p className="text-muted mt-3 text-[13.5px]">{p.certification.note}</p>}
          </section>

          <section className="mt-6">
            <h2 className="eyebrow mb-2.5">Ingredients</h2>
            <Ingredients text={p.ingredients} />
          </section>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="card p-5 md:p-6" aria-labelledby="nutri-h">
          <h2 id="nutri-h" className="eyebrow">
            Nutrition per 100 g
          </h2>
          <dl className="mt-4 grid grid-cols-5 gap-2">
            {[
              ['kcal', n.kcal],
              ['Protein', n.protein.toFixed(1)],
              ['Fat', n.fat.toFixed(1)],
              ['Carbs', n.carbs.toFixed(1)],
              ['Fibre', n.fiber.toFixed(1)],
            ].map(([k, v]) => (
              <div key={k} className="border-line rounded-xl border p-2.5 text-center">
                <dt className="text-subtle font-mono text-[12px]">{k}</dt>
                <dd className="mt-0.5 text-[15px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <MacroSplitBar macros={n} />
          </div>
          {micros.length > 0 && (
            <div className="mt-5 grid gap-3.5 sm:grid-cols-2 sm:gap-x-6">
              {micros.map(([nid, v]) => (
                <NrvBar key={nid} id={nid} value={v} />
              ))}
            </div>
          )}
          <p className="text-subtle mt-4 text-[12.5px]">{n.basis}</p>
        </section>

        <div className="space-y-6">
          <section className="card p-5 md:p-6">
            <h2 className="eyebrow mb-3">Relevant organs</h2>
            <ul className="flex flex-wrap gap-2">
              {organs.map((o) => (
                <li key={o}>
                  <OrganLink id={o} />
                </li>
              ))}
            </ul>
            <p className="text-subtle mt-3 text-[12.5px]">
              Computed from nutrition: at least one nutrient the organ depends on reaches the EU &ldquo;source
              of&rdquo; level per 100 g.
            </p>
          </section>
          {foods.length > 0 && (
            <section className="card p-5 md:p-6">
              <h2 className="eyebrow mb-3">Reference foods</h2>
              <ul className="flex flex-wrap gap-2">
                {foods.map((f) => (
                  <li key={f.id}>
                    <Link href={`/food/${f.id}`} className="chip">
                      {f.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-subtle mt-3 text-[12.5px]">
                {NUTRIENTS.cultures.name}: {p.liveCultures ? 'yes — keep refrigerated' : 'no'}
              </p>
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="rel-h">
          <h2 id="rel-h" className="display text-[34px]">
            Related products
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.id}>
                <ProductCard product={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
