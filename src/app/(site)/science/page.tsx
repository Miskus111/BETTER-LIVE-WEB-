import { BreadcrumbLd } from '@/components/seo/BreadcrumbLd'
import type { Metadata } from 'next'
import Link from '@/components/ui/Link'
import { NUTRIENT_LIST } from '@/data/nutrients'
import { ORGANS } from '@/data/organs'
import { ALL_SOURCES } from '@/data/sources'
import { EvidenceBadge, EvidenceLegend } from '@/components/ui/EvidenceBadge'
import { FermentationExplainer } from '@/components/organ/FermentationExplainer'
import { thresholdBasis, thresholdOf } from '@/lib/nutrition'

export const metadata: Metadata = {
  title: 'Věda a metodika',
  description:
    'Jak BLWB hodnotí důkazy, jak počítá propojení potravin s orgány z dat USDA a proč používá znění zdravotních tvrzení schválených EU.',
  alternates: { canonical: '/science' },
}

export default function SciencePage() {
  const counts = ORGANS.flatMap((o) => o.nutrients).reduce<Record<string, number>>((acc, n) => {
    acc[n.level] = (acc[n.level] ?? 0) + 1
    return acc
  }, {})
  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 md:px-8">
      <BreadcrumbLd items={[['Věda a metodika', '/science']]} />
      <p className="eyebrow">Věda a metodika</p>
      <h1 className="display mt-3 text-[48px] md:text-[68px]">Jak víme, co tvrdíme.</h1>
      <p className="text-muted mt-4 max-w-3xl text-[16px]">
        BLWB je vzdělávací nástroj. Popisuje normální fyziologii a to, co výzkum výživy podporuje — a otevřeně
        říká, co nepodporuje. Není to lékařská rada.
      </p>

      <Block title="1 · Úrovně důkazů">
        <EvidenceLegend />
        <p className="text-muted mt-4 text-[14px]">
          U {ORGANS.length} orgánů v modelu je {counts.established ?? 0} prokázaných, {counts.plausible ?? 0}{' '}
          pravděpodobných a {counts.preliminary ?? 0} předběžných propojení živin. Živinu, kterou orgán jen
          vstřebává, ukládá nebo aktivuje (např. vitamín D v ledvinách), ukazujeme jako fyziologii, ale nikdy
          ji nepoužíváme k propojení s potravinami.
        </p>
      </Block>

      <Block title="2 · Kdy je potravina pro orgán relevantní?">
        <p className="text-fg/90 text-[15px]">
          Potravina je s orgánem propojená, jen pokud 100 g dodá alespoň úroveň „zdroj“ podle EU u živiny, na
          které orgán závisí — u vitamínů a minerálů 15 % referenční hodnoty příjmu (nař. 1924/2006).
          Propojení, která stojí jen na předběžných důkazech, vyřazujeme. Vše se počítá z dat při sestavení
          webu; nic se nevybírá ručně.
        </p>
        <div className="border-line mt-5 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <caption className="sr-only">Referenční hodnoty a prahy „zdroj“</caption>
            <thead className="text-subtle bg-white/[0.03] font-mono text-[12px]">
              <tr>
                <th className="px-4 py-3 font-normal">Živina</th>
                <th className="px-4 py-3 font-normal">Reference / den</th>
                <th className="px-4 py-3 font-normal">Práh / 100 g</th>
                <th className="px-4 py-3 font-normal">Pravidlo</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {NUTRIENT_LIST.map((n) => {
                const t = thresholdOf(n.id)
                return (
                  <tr key={n.id}>
                    <td className="px-4 py-2.5">
                      <Link href={`/#nutrient-${n.id}`} className="hover:text-cyan">
                        {n.name}
                      </Link>
                    </td>
                    <td className="text-muted px-4 py-2.5 font-mono text-[13px]">
                      {n.ref ? `${n.ref.value} ${n.unit} (${n.ref.kind})` : '—'}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[13px]">
                      {n.qualitative ? 'kvalitativně' : t !== undefined ? `${+t.toFixed(3)} ${n.unit}` : '—'}
                    </td>
                    <td className="text-muted px-4 py-2.5 text-[13px]">{thresholdBasis(n.id)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Block>

      <Block title="3 · Znění zdravotních tvrzení">
        <p className="text-fg/90 text-[15px]">
          Kde EU schválila zdravotní tvrzení (nař. 432/2012), používáme jeho znění — např. „Vitamín C přispívá
          k normální tvorbě kolagenu pro normální funkci kůže“. Kde žádné neexistuje, píšeme to. Příklad:
          lutein. Jeho role v makulárním pigmentu je skutečná fyziologie, ale přínos doplňku byl prokázán jen
          u lidí se středně pokročilou věkem podmíněnou makulární degenerací (AREDS2).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <EvidenceBadge level="established" />
          <EvidenceBadge level="plausible" />
          <EvidenceBadge level="preliminary" />
        </div>
      </Block>

      <Block title="4 · Fermentované potraviny, živé kultury, probiotika">
        <FermentationExplainer />
      </Block>

      <Block title="5 · Nutriční data a doplňky">
        <p className="text-fg/90 text-[15px]">
          Hodnoty na 100 g jedlého podílu pocházejí z USDA FoodData Central (SR Legacy / Foundation Foods) a
          jsou zaokrouhlené. Sledujeme jen živiny relevantní pro model orgánů; chybějící hodnota znamená
          „nesledováno“, ne nulu. Jód v mléce a rybách silně kolísá podle krmiva, sezóny a zpracování.
        </p>
        <p className="text-fg/90 mt-3 text-[15px]">
          Doporučené produkty vybíráme podle vstřebatelnosti formy, dávky vůči doporučení EFSA a horního
          limitu (viz{' '}
          <Link href="/jak-doporucujeme" className="link">
            Jak doporučujeme
          </Link>
          ); odkazy jsou partnerské. Doplněk stravy má smysl hlavně tam, kde strava nestačí — typicky vitamín
          D v zimě, B12 při veganské stravě nebo omega-3, když nejíte ryby.
        </p>
      </Block>

      <Block title="Zdroje">
        <ul className="space-y-2">
          {ALL_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer noopener" className="link text-[15px]">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </Block>
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line mt-14 border-t pt-8">
      <h2 className="display mb-5 text-[30px] md:text-[36px]">{title}</h2>
      {children}
    </section>
  )
}
