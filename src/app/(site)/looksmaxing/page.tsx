import { BreadcrumbLd } from '@/components/seo/BreadcrumbLd'
import type { Metadata } from 'next'
import { AlertTriangle, CheckCircle2, HeartHandshake, XCircle } from 'lucide-react'
import { NUTRIENTS } from '@/data/nutrients'
import { MYTHS, PILLARS } from '@/data/looksmaxing'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { OrganLink } from '@/components/ui/OrganLink'
import { WhereToBuy } from '@/components/ui/WhereToBuy'
import { cx } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Looksmaxing bez mýtů',
  description:
    'Co na vzhled opravdu funguje — spánek, ochrana před sluncem, trénink, bílkoviny a živiny pro pleť a vlasy — a které trendy jsou mýtus nebo nebezpečí.',
  alternates: { canonical: '/looksmaxing' },
}

export default function LooksmaxingPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-12 md:px-8">
      <BreadcrumbLd items={[['Looksmaxing', '/looksmaxing']]} />
      <header className="border-line relative overflow-hidden rounded-[2rem] border p-8 md:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_85%_10%,rgba(94,231,255,0.16),transparent_60%),radial-gradient(ellipse_60%_70%_at_0%_100%,rgba(255,159,138,0.12),transparent_60%)]"
        />
        <p className="eyebrow relative">Looksmaxing · podle důkazů</p>
        <h1 className="display relative mt-4 max-w-3xl text-[48px] md:text-[76px]">
          Lepší vzhled <em className="text-cyan">bez mýtů.</em>
        </h1>
        <p className="text-muted relative mt-5 max-w-2xl text-[16.5px]">
          Šest věcí, které na vzhled prokazatelně působí — a šest trendů, které jsou zbytečné nebo nebezpečné.
          Bez slibů, s úrovní důkazů u každého bodu.
        </p>
        <nav aria-label="Obsah stránky" className="relative mt-8 flex flex-wrap gap-2">
          {PILLARS.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="chip">
              {p.title}
            </a>
          ))}
          <a href="#myty" className="chip !border-warn/40 !text-warn">
            Mýty a rizika
          </a>
        </nav>
      </header>

      <section aria-labelledby="co-funguje" className="mt-16">
        <h2 id="co-funguje" className="display text-[38px] md:text-[52px]">
          Co funguje
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {PILLARS.map((p, i) => (
            <li key={p.id} id={p.id} className="card flex scroll-mt-24 flex-col p-6 md:p-7">
              <div className="flex items-start justify-between gap-3">
                <span className="text-cyan font-mono text-[13px]">0{i + 1}</span>
                <EvidenceBadge level={p.level} />
              </div>
              <h3 className="display mt-3 text-[32px]">{p.title}</h3>
              <p className="text-fg/90 mt-1 text-[15.5px]">{p.lead}</p>
              <ul className="mt-4 space-y-2.5">
                {p.facts.map((f) => (
                  <li key={f} className="text-muted border-cyan/40 border-l-2 pl-3 text-[14.5px]">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-2xl bg-white/[0.03] p-4">
                <p className="text-subtle mb-2 font-mono text-[12px] tracking-wider uppercase">Jak na to</p>
                <ul className="space-y-1.5">
                  {p.howTo.map((h) => (
                    <li key={h} className="flex gap-2 text-[14.5px]">
                      <CheckCircle2 size={16} className="text-bio mt-0.5 shrink-0" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {p.organs.map((o) => (
                  <OrganLink key={o} id={o} />
                ))}
                {p.nutrients?.map((n) => (
                  <a key={n} href={`/#nutrient-${n}`} className="chip">
                    {NUTRIENTS[n].name}
                  </a>
                ))}
              </div>
              {p.shop && <WhereToBuy links={p.shop} compact className="border-line mt-5 border-t pt-5" />}
              <ul className="mt-auto pt-5">
                {p.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer noopener" className="link text-[12.5px]">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section id="myty" aria-labelledby="myty-h" className="mt-20 scroll-mt-24">
        <p className="eyebrow !text-warn">Mýty a rizika</p>
        <h2 id="myty-h" className="display mt-3 text-[38px] md:text-[52px]">
          Co nefunguje — nebo škodí
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {MYTHS.map((m) => (
            <li
              key={m.myth}
              className={cx(
                'rounded-[1.25rem] border p-5',
                m.danger ? 'border-[#ff8b8b]/30 bg-[#ff8b8b]/[0.05]' : 'border-line bg-white/[0.02]',
              )}
            >
              <p className="flex gap-2 text-[15.5px] font-medium">
                {m.danger ? (
                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-[#ff9b9b]"
                    aria-label="Nebezpečné"
                  />
                ) : (
                  <XCircle size={18} className="text-warn mt-0.5 shrink-0" aria-label="Mýtus" />
                )}
                {m.myth}
              </p>
              <p className="text-muted mt-2 pl-[26px] text-[14.5px]">{m.fact}</p>
            </li>
          ))}
        </ul>
      </section>

      <aside
        className="card mt-16 flex flex-col gap-4 p-6 md:flex-row md:items-center md:p-8"
        aria-label="Podpora"
      >
        <HeartHandshake size={30} className="text-cyan shrink-0" aria-hidden />
        <div>
          <p className="text-[17px] font-medium">Vzhled není všechno.</p>
          <p className="text-muted mt-1 text-[14.5px]">
            Pokud vás myšlenky na vlastní vzhled trápí, berou vám spánek nebo radost, promluvte si s někým.
            Linka první psychické pomoci <strong className="text-fg">116 123</strong> (nonstop), pro mladé do
            26 let Linka bezpečí <strong className="text-fg">116 111</strong>.
          </p>
        </div>
      </aside>

      <p className="text-subtle mt-8 text-[13px]">
        Vzdělávací obsah, ne lékařská rada. Odkazy na obchody jsou partnerské (affiliate); doplňky stravy
        nenahrazují spánek, pohyb ani pestrou stravu.
      </p>
    </div>
  )
}
