import type { Metadata } from 'next'
import Link from 'next/link'
import { BadgeCheck, FlaskConical, Gauge, HandCoins, ScanSearch, ShieldAlert } from 'lucide-react'
import { AFFILIATE_DISCLOSURE } from '@/data/affiliate'
import { RETAILERS } from '@/data/retailers'

export const metadata: Metadata = {
  title: 'Jak doporučujeme produkty',
  description:
    'Podle čeho vybíráme doplňky stravy, které doporučujeme, a jak fungují partnerské (affiliate) odkazy.',
  alternates: { canonical: '/jak-doporucujeme' },
}

const CRITERIA = [
  {
    icon: FlaskConical,
    t: 'Nejlépe vstřebatelná forma',
    d: 'Doporučujeme formy s nejlepšími důkazy — např. vitamín D3 místo D2, bisglycinát hořčíku místo oxidu, zinek v citrátu nebo bisglycinátu.',
  },
  {
    icon: Gauge,
    t: 'Rozumná dávka pod horním limitem',
    d: 'Dávka musí dávat smysl vzhledem k doporučení EFSA a nesmí sama o sobě přesáhnout bezpečný horní limit. Vysoké dávky výslovně označujeme.',
  },
  {
    icon: ScanSearch,
    t: 'Transparentní složení',
    d: 'Výrobce uvádí přesnou formu a množství účinné látky; u rybích olejů ideálně i hodnoty oxidace.',
  },
  {
    icon: ShieldAlert,
    t: 'Žádné zázračné sliby',
    d: 'Nedoporučujeme produkty, které slibují léčbu, detox nebo „boost“ — a u probiotik upozorňujeme, že účinek je vázaný na konkrétní kmen.',
  },
]

export default function HowWeRecommendPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 md:px-8">
      <p className="eyebrow">Transparentnost</p>
      <h1 className="display mt-3 text-[48px] md:text-[64px]">Jak doporučujeme produkty.</h1>
      <p className="text-muted mt-4 text-[16px]">
        BLWB je vzdělávací web o lidském těle a výživě. Neprodáváme žádné produkty. Web financujeme
        partnerskými (affiliate) odkazy do obchodů{' '}
        {Object.values(RETAILERS)
          .map((r) => r.name)
          .join(' a ')}
        .
      </p>

      <section className="card mt-10 flex gap-4 p-6" aria-labelledby="affiliate-h">
        <HandCoins size={26} className="text-cyan shrink-0" aria-hidden />
        <div>
          <h2 id="affiliate-h" className="text-[18px] font-medium">
            Jak fungují partnerské odkazy
          </h2>
          <p className="text-muted mt-2 text-[15px]">{AFFILIATE_DISCLOSURE}</p>
          <p className="text-muted mt-2 text-[15px]">
            Partnerské odkazy jsou na webu vždy u bloku „Kde koupit“ nebo „Doporučené produkty“ a jsou
            technicky označené jako sponzorované (
            <code className="font-mono text-[13px]">rel=&quot;sponsored&quot;</code>).
          </p>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="criteria-h">
        <h2 id="criteria-h" className="display text-[34px]">
          Podle čeho vybíráme
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {CRITERIA.map(({ icon: Icon, t, d }) => (
            <li key={t} className="card p-5">
              <Icon size={20} className="text-bio" aria-hidden />
              <h3 className="mt-4 text-[17px] font-medium">{t}</h3>
              <p className="text-muted mt-1.5 text-[14.5px]">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-line mt-12 border-t pt-8">
        <p className="flex gap-2 text-[15px]">
          <BadgeCheck size={18} className="text-cyan mt-0.5 shrink-0" aria-hidden />
          Obsah o těle, živinách a potravinách je na provizích nezávislý: zdravotní tvrzení používají znění
          schválené EU a propojení potravin s orgány se počítá z dat USDA.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/doplnky" className="btn btn-primary">
            Přehled doplňků
          </Link>
          <Link href="/science" className="btn btn-ghost">
            Metodika
          </Link>
        </div>
      </section>
    </div>
  )
}
