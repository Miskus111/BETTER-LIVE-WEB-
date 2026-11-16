import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '@/data/products'
import { AnatomyExplorer } from '@/components/anatomy/AnatomyExplorer'
import { Section } from '@/components/home/Section'
import { NutrientIndex } from '@/components/home/NutrientIndex'
import { StorePreview } from '@/components/home/StorePreview'
import { ScienceTeaser } from '@/components/home/ScienceTeaser'
import { StandardTeaser } from '@/components/home/StandardTeaser'
import { LooksmaxingTeaser } from '@/components/home/LooksmaxingTeaser'
import { FoodExplorer } from '@/components/food/FoodExplorer'
import { ProductCard } from '@/components/shop/ProductCard'
import { SampleDataLabel } from '@/components/layout/SampleDataLabel'

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4)
  return (
    <>
      <section id="body" aria-label="Interaktivní lidské tělo" className="relative scroll-mt-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(58,168,255,0.09),transparent_70%)]"
          aria-hidden
        />
        <div className="mx-auto max-w-[1440px] px-4 pt-6 md:px-8 lg:hidden">
          <p className="eyebrow">FLX · Tělo × výživa</p>
          <h1 className="display mt-2 text-[44px]">
            Tvoje tělo, <em className="text-cyan">rozluštěné.</em>
          </h1>
          <p className="text-muted mt-2 text-[15px]">Klepněte na orgán a uvidíte, co potřebuje — a proč.</p>
        </div>
        <AnatomyExplorer />
      </section>

      <Section
        id="featured"
        eyebrow="Doporučujeme"
        title="Jídlo vybrané jako důkaz."
        intro="Malý výběr certifikovaných bio a poctivě označených potravin — každá propojená s orgány, které její živiny podporují."
        aside={
          <div className="flex items-center gap-3">
            <SampleDataLabel />
            <Link href="/shop" className="btn btn-ghost">
              Všechny produkty <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        }
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="nutrients"
        eyebrow="Přehled živin"
        title="25 živin, jedna poctivá mapa."
        intro="Referenční hodnoty, tvrzení schválená EU, orgány v našem modelu a nejbohatší potraviny — na 100 g."
      >
        <NutrientIndex />
      </Section>

      <Section
        id="foods"
        eyebrow="Průvodce potravinami"
        title="Co doopravdy obsahuje 100 gramů."
        intro="Makroživiny, podíl energie a vitamíny a minerály v % referenční hodnoty EU — a pro které orgány je potravina relevantní."
      >
        <FoodExplorer />
      </Section>

      <Section
        id="looksmaxing"
        eyebrow="Looksmaxing"
        title="Lepší vzhled bez mýtů."
        intro="Spánek, slunce, trénink a živiny pro pleť a vlasy — podle důkazů. A proč na bone smashing, solárium a SARMs zapomenout."
      >
        <LooksmaxingTeaser />
      </Section>

      <Section
        id="store"
        eyebrow="Obchod"
        title="Nakupujte podle toho, co tělo potřebuje."
        intro="Procházejte podle soustav. Každý produkt ukazuje certifikaci, kontrolní subjekt, původ a zpracování."
      >
        <StorePreview />
      </Section>

      <Section id="science" eyebrow="Věda" title="Čtyři pravidla, která neporušujeme.">
        <ScienceTeaser />
      </Section>

      <Section id="standard" eyebrow="Náš standard" title="Nejdřív bio. Vždy poctivě.">
        <StandardTeaser />
      </Section>
    </>
  )
}
