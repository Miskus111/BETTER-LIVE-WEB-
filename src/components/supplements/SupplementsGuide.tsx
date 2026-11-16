import Link from 'next/link'
import { AlertTriangle, Salad } from 'lucide-react'
import { NUTRIENTS } from '@/data/nutrients'
import { REF_SRC, REFERENCE } from '@/data/reference'
import { WHERE_TO_BUY } from '@/data/retailers'
import { SUPPLEMENT_NUTRIENTS } from '@/data/supplements'
import { AbsorptionCard } from '@/components/ui/AbsorptionCard'
import { ReferenceValues } from '@/components/ui/ReferenceValues'
import { WhereToBuy } from '@/components/ui/WhereToBuy'
import { organsForNutrient, topFoodsFor, fmtAmount } from '@/lib/nutrition'

/** Shared by the public /doplnky page and the in-app Supplements module. */
export function SupplementsGuide({ inApp }: { inApp?: boolean }) {
  return (
    <div className={inApp ? '' : 'mx-auto max-w-[1200px] px-4 pt-12 md:px-8'}>
      <header className="max-w-3xl">
        <p className="eyebrow">Doplňky stravy</p>
        <h1 className="display mt-3 text-[48px] md:text-[68px]">Správná forma, správná dávka.</h1>
        <p className="text-muted mt-4 text-[16px]">
          Stejná živina se z různých forem vstřebává různě dobře — a „víc“ neznamená „lépe“. U každé živiny
          najdete, kdy má doplněk smysl, kterou formu tělo využije nejlépe, kolik doporučuje EFSA a kde je
          bezpečný horní limit.
        </p>
        <p className="border-bio/25 bg-bio/[0.05] mt-5 flex gap-2 rounded-xl border p-3.5 text-[14.5px]">
          <Salad size={17} className="text-bio mt-0.5 shrink-0" aria-hidden />
          <span>
            <strong className="font-medium">Nejdřív strava.</strong> Doplněk má smysl tam, kde strava nestačí
            — u většiny lidí v ČR typicky vitamín D v zimě, B12 u veganů, omega-3 u těch, kdo nejedí ryby, a
            železo jen při prokázaném nedostatku.
          </span>
        </p>
      </header>

      <section aria-labelledby="tabulka" className="mt-14">
        <h2 id="tabulka" className="display text-[34px] md:text-[42px]">
          Referenční hodnoty pro dospělé
        </h2>
        <p className="text-muted mt-2 max-w-3xl text-[14.5px]">
          <strong className="text-fg font-medium">RHP</strong> je číslo z etiket („% RHP“).{' '}
          <strong className="text-fg font-medium">EFSA</strong> je skutečné doporučení — často vyšší a jiné
          pro muže a ženy. <strong className="text-fg font-medium">UL</strong> je horní limit ze všech zdrojů
          dohromady.
        </p>
        <div className="border-line mt-5 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[720px] text-left text-[14px]">
            <caption className="sr-only">Referenční hodnoty: RHP, doporučení EFSA a horní limity</caption>
            <thead className="text-subtle bg-white/[0.03] font-mono text-[12px]">
              <tr>
                <th className="px-4 py-3 font-normal">Živina</th>
                <th className="px-4 py-3 font-normal">RHP (etiketa)</th>
                <th className="px-4 py-3 font-normal">Doporučení EFSA</th>
                <th className="px-4 py-3 font-normal">Horní limit (UL)</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {SUPPLEMENT_NUTRIENTS.map((id) => {
                const n = NUTRIENTS[id]
                const r = REFERENCE[id]
                return (
                  <tr key={id}>
                    <td className="px-4 py-2.5">
                      <a href={`#${id}`} className="hover:text-cyan">
                        {n.name}
                      </a>
                    </td>
                    <td className="text-muted px-4 py-2.5 font-mono text-[13px]">
                      {n.ref?.kind === 'RHP' ? `${n.ref.value.toLocaleString('cs-CZ')} ${n.unit}` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-[13.5px]">
                      {r?.efsa ? (
                        <>
                          {r.efsa.text}{' '}
                          <span className="text-subtle font-mono text-[12px]">{r.efsa.kind}</span>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-[13.5px]">{r?.ul?.text ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <ul className="mt-3 space-y-1">
          {Object.values(REF_SRC).map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer noopener" className="link text-[12.5px]">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Živiny" className="mt-14 flex flex-wrap gap-2">
        {SUPPLEMENT_NUTRIENTS.map((id) => (
          <a key={id} href={`#${id}`} className="chip">
            {NUTRIENTS[id].name}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-6">
        {SUPPLEMENT_NUTRIENTS.map((id) => {
          const n = NUTRIENTS[id]
          const foods = topFoodsFor(id, 4)
          const organs = organsForNutrient(id)
          return (
            <section key={id} id={id} aria-labelledby={`${id}-h`} className="card scroll-mt-24 p-5 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="eyebrow">{n.kind}</p>
                  <h2 id={`${id}-h`} className="display mt-2 text-[36px] md:text-[44px]">
                    {n.name}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {organs.map((o) => (
                    <Link key={o.id} href={`/organ/${o.id}`} className="chip !py-1 !text-[12.5px]">
                      <span className="h-2 w-2 rounded-full" style={{ background: o.accent }} aria-hidden />
                      {o.shortName}
                    </Link>
                  ))}
                </div>
              </div>
              <p className="text-muted mt-2 max-w-3xl text-[15px]">{n.blurb}</p>

              <ReferenceValues id={id} className="mt-5" />

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <AbsorptionCard id={id} />
                <div className="space-y-6">
                  {!n.qualitative && foods.length > 0 && (
                    <div>
                      <p className="eyebrow mb-2.5">Nejlepší zdroje v jídle · na 100 g</p>
                      <ul className="divide-line divide-y">
                        {foods.map(({ food, v }) => (
                          <li key={food.id}>
                            <Link
                              href={`/food/${food.id}`}
                              className="hover:text-cyan flex justify-between gap-3 py-1.5 text-[14px]"
                            >
                              {food.name}
                              <span className="text-muted font-mono text-[13px]">{fmtAmount(v, n.unit)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <WhereToBuy links={WHERE_TO_BUY[id]} title="Doporučené produkty" compact />
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <aside className="border-warn/25 bg-warn/[0.04] mt-10 flex gap-3 rounded-2xl border p-5 text-[14px]">
        <AlertTriangle size={18} className="text-warn mt-0.5 shrink-0" aria-hidden />
        <p>
          Vzdělávací obsah, ne lékařská rada. Při užívání léků, v těhotenství, při kojení nebo chronickém
          onemocnění probírejte doplňky s lékařem nebo lékárníkem. Horní limity platí pro dospělé a pro součet
          ze stravy i doplňků.
        </p>
      </aside>
    </div>
  )
}
