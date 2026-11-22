import { BreadcrumbLd } from '@/components/seo/BreadcrumbLd'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ToolCards } from '@/components/guides/ToolCards'
import { TOOLS } from '@/data/tools'

export const metadata: Metadata = {
  title: 'Kalkulačky zdraví — kofein, tlak, bílkoviny, voda, hlasitost',
  description:
    'Interaktivní kalkulačky podle WHO, EFSA a lékařských doporučení: kolik kofeinu zbude do spánku, co znamená váš tlak, kolik bílkovin a vody potřebujete a jak dlouho je hlasitost bezpečná.',
  alternates: { canonical: '/nastroje' },
}

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-8 pb-16 md:px-8 md:pt-12">
      <BreadcrumbLd items={[['Kalkulačky', '/nastroje']]} />
      <nav
        aria-label="Drobečková navigace"
        className="text-subtle flex flex-wrap items-center gap-1 text-[13.5px]"
      >
        <Link href="/" className="hover:text-fg">
          Domů
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page" className="text-muted">
          Kalkulačky
        </span>
      </nav>
      <header className="mt-5 max-w-3xl">
        <p className="eyebrow">Kalkulačky</p>
        <h1 className="display mt-3 text-[44px] leading-[1.05] md:text-[64px]">
          Spočítejte si to <em className="text-cyan">na sobě.</em>
        </h1>
        <p className="text-muted mt-3 text-[16.5px]">
          {TOOLS.length} jednoduchých nástrojů, každý postavený na ověřeném zdroji. Výpočet proběhne jen ve
          vašem prohlížeči — nic se neukládá ani neodesílá.
        </p>
      </header>
      <div className="mt-8">
        <ToolCards />
      </div>
      <p className="text-subtle mt-8 max-w-3xl text-[13px]">
        Kalkulačky slouží ke vzdělávání a orientaci, nenahrazují vyšetření ani radu lékaře.
      </p>
    </div>
  )
}
