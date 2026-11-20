import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle, ArrowUpRight, ChevronLeft, Database } from 'lucide-react'
import { FOOD_BY_ID, FOODS } from '@/data/foods'
import { FOOD_DETAILS } from '@/data/food-details'
import { STATE_CS } from '@/lib/foods/categories'
import { rawCookedPair, variantsOf } from '@/lib/foods/variants'
import { shopLinksForFood } from '@/lib/foods/shop'
import { affiliateUrl } from '@/data/affiliate'
import { RETAILERS } from '@/data/retailers'
import { FoodDetail } from '@/components/food/FoodDetail'
import { FoodNutritionPanel } from '@/components/food/FoodNutritionPanel'
import { RawCookedCompare } from '@/components/food/RawCookedCompare'
import { JsonLd } from '@/components/seo/JsonLd'
import { RelatedGuides } from '@/components/guides/RelatedGuides'
import { guidesForFood } from '@/lib/foods/guides'
import { upperLimitHits } from '@/lib/foods/upper-limits'
import { portionText } from '@/lib/foods/query'
import { fmtAmount } from '@/lib/nutrition'
import { SITE } from '@/lib/site'

type Params = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return FOODS.map((f) => ({ id: f.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const f = FOOD_BY_ID[id]
  if (!f) return {}
  const title = `${f.name} — nutriční hodnoty na 100 g`
  const description = `${f.name} (${f.basis}): ${f.kcal} kcal, ${String(f.macros.protein).replace('.', ',')} g bílkovin na 100 g. Vitamíny, minerály, porce a orgány, které podporují. ${f.recipe ? 'Vypočteno z receptu (suroviny z USDA FoodData Central).' : 'Zdroj: USDA FoodData Central.'}`
  return {
    title,
    description,
    alternates: { canonical: `/food/${f.id}` },
    openGraph: { title, description, url: `/food/${f.id}` },
  }
}

export default async function FoodPage({ params }: Params) {
  const { id } = await params
  const food = FOOD_BY_ID[id]
  const details = FOOD_DETAILS[id]
  if (!food || !details) notFound()
  const i = FOODS.indexOf(food)
  const prev = FOODS[(i - 1 + FOODS.length) % FOODS.length]
  const next = FOODS[(i + 1) % FOODS.length]
  const variants = variantsOf(food, FOODS)
  const pair = rawCookedPair(food, FOODS)
  const shop = shopLinksForFood(food)
  const p = details.provenance
  const limits = upperLimitHits(details.nutrients, food.portion.grams)

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 md:px-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Domů', item: SITE.url },
            { '@type': 'ListItem', position: 2, name: food.name, item: `${SITE.url}/food/${food.id}` },
          ],
        }}
      />
      <Link href="/#foods" className="link inline-flex items-center gap-1 text-[14px]">
        <ChevronLeft size={15} aria-hidden /> Průvodce potravinami
      </Link>

      {variants.length > 0 && (
        <nav aria-label="Jiná úprava" className="mt-4 flex flex-wrap items-center gap-2 text-[13.5px]">
          <span className="text-subtle">Úprava:</span>
          <span className="chip" aria-current="page">
            {food.basis}
          </span>
          {variants.map((v) => (
            <Link key={v.id} href={`/food/${v.id}`} className="chip">
              {v.basis}
              <span className="text-subtle">· {v.name}</span>
            </Link>
          ))}
        </nav>
      )}

      <div className="card mt-4 p-5 md:p-8">
        <FoodDetail food={food} headingLevel="h1" />
      </div>

      {limits.length > 0 && (
        <section
          className="border-warn/40 bg-warn/5 mt-6 rounded-xl border p-4 text-[14.5px]"
          aria-labelledby="upper-limits"
          data-testid="upper-limits"
        >
          <h2 id="upper-limits" className="text-warn flex items-center gap-2 font-medium">
            <AlertTriangle size={16} aria-hidden /> Pozor na horní bezpečný limit
          </h2>
          <ul className="mt-2 grid gap-1.5">
            {limits.map((l) => (
              <li key={l.name}>
                Jedna porce ({portionText(food.portion)}) obsahuje {fmtAmount(l.amount, l.unit)} {l.name} —{' '}
                <strong>{l.pct} %</strong> horního limitu EFSA pro dospělé ({fmtAmount(l.ul, l.unit)} denně ze
                všech zdrojů). {l.note}
              </li>
            ))}
          </ul>
          <p className="text-muted mt-2 text-[13px]">
            Občas nevadí — limit platí pro dlouhodobý denní příjem. Jezte spíš příležitostně a nekombinujte s
            doplňky se stejnou látkou.
          </p>
        </section>
      )}

      <div className="mt-6">
        <FoodNutritionPanel food={details} />
      </div>

      {pair && <RawCookedCompare before={pair.before} after={pair.after} current={food.id} />}

      {details.recipe && (
        <section className="card mt-6 p-5" aria-labelledby="recipe">
          <h2 id="recipe" className="text-[18px] font-medium">
            Složení receptu
          </h2>
          <p className="text-muted mt-1 text-[14px]">{details.recipe.note}</p>
          <ul className="mt-3 grid gap-1.5 text-[14px] sm:grid-cols-2">
            {details.recipe.ingredients.map((x) => (
              <li key={x.id} className="flex justify-between gap-3">
                <Link href={`/food/${x.id}`} className="link">
                  {FOOD_BY_ID[x.id]?.name ?? x.id}
                </Link>
                <span className="text-subtle font-mono">{x.grams} g</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {shop.length > 0 && (
        <section className="mt-6" aria-labelledby="shop">
          <h2 id="shop" className="eyebrow">
            Kde koupit
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {shop.map((s) => (
              <li key={s.url}>
                <a
                  href={affiliateUrl(s.url, s.retailer)}
                  target="_blank"
                  rel="sponsored noopener"
                  className="chip"
                >
                  {s.label} <ArrowUpRight size={13} aria-hidden />
                  <span className="sr-only">({RETAILERS[s.retailer].name}, partnerský odkaz)</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-subtle mt-2 text-[12px]">Partnerské odkazy — cenu pro vás nemění.</p>
        </section>
      )}

      <section
        className="border-line text-subtle mt-6 rounded-xl border p-4 text-[13px]"
        aria-label="Zdroj dat"
      >
        <p className="flex items-start gap-2">
          <Database size={15} className="text-cyan mt-0.5 shrink-0" aria-hidden />
          <span>
            {p.source === 'USDA FoodData Central' ? (
              <>
                Zdroj:{' '}
                <a
                  className="link"
                  href={`https://fdc.nal.usda.gov/food-details/${p.sourceId}/nutrients`}
                  target="_blank"
                  rel="noopener"
                >
                  USDA FoodData Central, FDC {p.sourceId}
                </a>
                , {p.sourceVersion} — „{p.sourceDescription}“ ({STATE_CS[details.state] ?? details.state}).
                Staženo {new Date(p.retrievedAt).toLocaleDateString('cs-CZ')}. Licence: veřejné vlastnictví
                (CC0).
              </>
            ) : (
              <>Vypočtený recept ze surovin z USDA FoodData Central — hodnoty nejsou laboratorně ověřené.</>
            )}
          </span>
        </p>
        {p.notes.length > 0 && (
          <ul className="mt-2 list-disc pl-8">
            {p.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </section>

      <RelatedGuides href={`/food/${food.id}`} extra={guidesForFood(food)} limit={4} className="mt-8" />

      <nav className="mt-6 flex justify-between gap-4 text-[14.5px]" aria-label="Další potraviny">
        <Link href={`/food/${prev.id}`} className="link">
          ← {prev.name}
        </Link>
        <Link href={`/food/${next.id}`} className="link">
          {next.name} →
        </Link>
      </nav>
    </div>
  )
}
