import type { Metadata } from 'next'
import { AnatomyExplorer } from '@/components/anatomy/AnatomyExplorer'
import { Section } from '@/components/home/Section'
import { NutrientIndex } from '@/components/home/NutrientIndex'
import { ScienceTeaser } from '@/components/home/ScienceTeaser'
import { LooksmaxingTeaser } from '@/components/home/LooksmaxingTeaser'
import { SupplementsTeaser } from '@/components/home/SupplementsTeaser'
import { FoodExplorer } from '@/components/food/FoodExplorer'
import { AppCta } from '@/components/home/AppCta'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <>
      <section id="body" aria-label="Interaktivní lidské tělo" className="relative scroll-mt-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(58,168,255,0.09),transparent_70%)]"
          aria-hidden
        />
        <div className="mx-auto max-w-[1440px] px-4 pt-6 md:px-8 lg:p-0">
          <p className="eyebrow lg:hidden">BLWB · Tělo × výživa</p>
          {/* the one h1 of the page: visible on phones, read by screen readers and search engines on desktop */}
          <h1 className="display mt-2 text-[44px] lg:sr-only">
            Tvoje tělo, <em className="text-cyan">rozluštěné.</em>
          </h1>
          <p className="text-muted mt-2 text-[15px] lg:hidden">
            Klepněte na orgán a uvidíte, co potřebuje — a proč.
          </p>
          <div className="lg:hidden">
            <AppCta compact />
          </div>
        </div>
        <AnatomyExplorer />
      </section>

      <AppCta />

      <Section
        id="nutrients"
        eyebrow="Přehled živin"
        title="25 živin, jedna poctivá mapa."
        intro="Referenční hodnoty, tvrzení schválená EU, orgány v našem modelu a nejbohatší potraviny — na 100 g."
      >
        <NutrientIndex />
      </Section>

      <Section
        id="doplnky"
        eyebrow="Doplňky stravy"
        title="Kterou formu tělo opravdu využije."
        intro="Stejná živina, různá vstřebatelnost. Doporučené denní hodnoty podle EFSA, bezpečné horní limity a formy seřazené podle důkazů."
      >
        <SupplementsTeaser />
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

      <Section id="science" eyebrow="Věda" title="Čtyři pravidla, která neporušujeme.">
        <ScienceTeaser />
      </Section>
    </>
  )
}
