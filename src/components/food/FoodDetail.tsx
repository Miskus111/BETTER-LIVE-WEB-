import Link from 'next/link'
import { ArrowUpRight, Info, Microscope, Waves } from 'lucide-react'
import { NUTRIENTS } from '@/data/nutrients'
import type { Food, NutrientId } from '@/data/types'
import { Thumb } from '@/components/ui/Thumb'
import { NrvBar } from '@/components/ui/NrvBar'
import { OrganLink } from '@/components/ui/OrganLink'
import { CertBadge } from '@/components/shop/CertBadge'
import { organsForFood, pctRef, productsForFood } from '@/lib/nutrition'
import { eur } from '@/lib/format'
import { MacroSplitBar } from './MacroSplitBar'

/** Full food detail — used in the homepage explorer and on /food/[id]. */
export function FoodDetail({
  food,
  headingLevel = 'h3',
  showPageLink,
}: {
  food: Food
  headingLevel?: 'h1' | 'h3'
  showPageLink?: boolean
}) {
  const H = headingLevel
  const micros = (Object.entries(food.micros) as [NutrientId, number][])
    .filter(([id]) => NUTRIENTS[id])
    .sort((a, b) => (pctRef(b[0], b[1]) ?? 0) - (pctRef(a[0], a[1]) ?? 0))
  const organs = organsForFood(food)
  const products = productsForFood(food.id)

  return (
    <article className="grid grid-cols-1 gap-6" data-testid="food-detail">
      <div className="grid gap-5 sm:grid-cols-[200px_1fr] sm:items-start">
        <Thumb src={food.image} alt={`${food.name} (placeholder illustration)`} className="rounded-2xl" />
        <div>
          <p className="eyebrow">{food.category}</p>
          <H className="display mt-2 text-[36px] md:text-[42px]">{food.name}</H>
          <p className="text-muted mt-1 font-mono text-[13px]">Per 100 g · {food.basis}</p>
          {showPageLink && (
            <Link
              href={`/food/${food.id}`}
              className="link mt-2 inline-flex items-center gap-1 text-[13.5px]"
            >
              Open food page <ArrowUpRight size={13} aria-hidden />
            </Link>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-5 gap-2">
        {[
          ['kcal', food.kcal, ''],
          ['Protein', food.macros.protein, 'g'],
          ['Fat', food.macros.fat, 'g'],
          ['Carbs', food.macros.carbs, 'g'],
          ['Fibre', food.macros.fiber, 'g'],
        ].map(([k, v, u]) => (
          <div key={k as string} className="border-line rounded-xl border p-2.5 text-center">
            <dt className="text-subtle font-mono text-[12px]">{k}</dt>
            <dd className="mt-0.5 text-[16px] font-medium">
              {v}
              <span className="text-muted text-[12px]">{u && ` ${u}`}</span>
            </dd>
          </div>
        ))}
      </dl>

      <MacroSplitBar macros={food.macros} />

      {(food.liveCultures || food.sodiumMg || food.note) && (
        <ul className="grid grid-cols-1 gap-2">
          {food.liveCultures && (
            <Note icon={<Microscope size={15} />}>
              Contains live cultures when not heat-treated after fermentation. Pasteurised or shelf-stable
              versions do not.
            </Note>
          )}
          {food.sodiumMg !== undefined && (
            <Note icon={<Waves size={15} />} tone="warn">
              Sodium: {food.sodiumMg} mg per 100 g (≈ {((food.sodiumMg * 2.5) / 1000).toFixed(1)} g salt) —
              salt is part of the preservation; portion size matters.
            </Note>
          )}
          {food.note && <Note icon={<Info size={15} />}>{food.note}</Note>}
        </ul>
      )}

      {micros.length > 0 && (
        <section>
          <h4 className="eyebrow mb-3">Vitamins, minerals &amp; more · % of daily reference</h4>
          <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-x-6">
            {micros.map(([id, v]) => (
              <NrvBar key={id} id={id} value={v} />
            ))}
          </div>
          <p className="text-subtle mt-3 text-[12.5px]">
            Highlighted values reach the EU &ldquo;source of&rdquo; level (≥ 15 % NRV). Source: USDA FoodData
            Central — {food.fdc}.
          </p>
        </section>
      )}

      <section>
        <h4 className="eyebrow mb-3">Relevant organs</h4>
        {organs.length ? (
          <ul className="flex flex-wrap gap-2">
            {organs.map(({ organ, via }) => (
              <li key={organ.id}>
                <OrganLink
                  id={organ.id}
                  detail={via.map((v) => NUTRIENTS[v].name.split(' ')[0]).join(', ')}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-[14px]">
            100 g does not reach the &ldquo;source of&rdquo; level for any nutrient in the organ model. That
            says nothing about whether the food belongs in a varied diet.
          </p>
        )}
      </section>

      {products.length > 0 && (
        <section>
          <h4 className="eyebrow mb-3">In the store</h4>
          <ul className="grid grid-cols-1 gap-2">
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/product/${p.id}`}
                  className="border-line hover:border-line-strong flex items-center gap-3 rounded-xl border p-2.5 transition"
                >
                  <Thumb
                    src={p.images[0]}
                    alt=""
                    ratio="aspect-square"
                    className="w-12 shrink-0 rounded-lg"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px]">{p.name}</span>
                    <span className="mt-0.5 block">
                      <CertBadge product={p} />
                    </span>
                  </span>
                  <span className="font-mono text-[14px]">{eur(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

function Note({ icon, children, tone }: { icon: React.ReactNode; children: React.ReactNode; tone?: 'warn' }) {
  return (
    <li
      className={`flex gap-2.5 rounded-xl border p-3 text-[14px] ${tone === 'warn' ? 'border-warn/25 bg-warn/[0.05]' : 'border-line bg-white/[0.02]'}`}
    >
      <span className={`mt-0.5 shrink-0 ${tone === 'warn' ? 'text-warn' : 'text-cyan'}`} aria-hidden>
        {icon}
      </span>
      <span className="text-fg/90">{children}</span>
    </li>
  )
}
