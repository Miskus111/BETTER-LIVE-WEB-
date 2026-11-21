import Link from '@/components/ui/Link'
import { ORGANS } from '@/data/organs'
import { NUTRIENTS } from '@/data/nutrients'
import { SUPPLEMENT_NUTRIENTS, supplementHref } from '@/data/supplements'
import { OPERATOR } from '@/lib/site'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-line bg-ink-2 mt-24 border-t">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div className="max-w-sm">
          <Logo gradientId="logo-g-footer" />
          <p className="text-muted mt-4 text-[14.5px]">
            Interaktivní mapa lidského těla: co jednotlivé orgány potřebují, z jakých potravin to získat a
            které formy doplňků tělo opravdu využije.
          </p>
        </div>
        <FooterCol title="Tělo">
          {ORGANS.map((o) => (
            <Link key={o.id} href={`/organ/${o.id}`} className="hover:text-fg">
              {o.shortName}
            </Link>
          ))}
        </FooterCol>
        <FooterCol title="Doplňky">
          <Link href="/doplnky" className="hover:text-fg">
            Přehled doplňků
          </Link>
          {SUPPLEMENT_NUTRIENTS.map((id) => (
            <Link key={id} href={supplementHref(id)} className="hover:text-fg">
              {NUTRIENTS[id].name}
            </Link>
          ))}
        </FooterCol>
        <FooterCol title="O webu">
          <Link href="/nastroje" className="hover:text-fg">
            Kalkulačky
          </Link>
          <Link href="/jak-funguje-telo" className="hover:text-fg">
            Jak funguje tělo
          </Link>
          <Link href="/science" className="hover:text-fg">
            Věda a důkazy
          </Link>
          <Link href="/jak-doporucujeme" className="hover:text-fg">
            Jak doporučujeme
          </Link>
          <Link href="/looksmaxing" className="hover:text-fg">
            Looksmaxing
          </Link>
          <Link href="/#foods" className="hover:text-fg">
            Průvodce potravinami
          </Link>
          <Link href="/#nutrients" className="hover:text-fg">
            Přehled živin
          </Link>
        </FooterCol>
      </div>
      <div className="border-line border-t">
        <div className="text-subtle mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-[13px] md:flex-row md:items-center md:justify-between md:px-8">
          <p className="max-w-3xl">
            <strong className="text-muted font-medium">Vzdělávací obsah, ne lékařská rada.</strong> BLWB
            vysvětluje obecnou fyziologii a výživovou vědu. Nediagnostikuje, neléčí ani nepředchází nemocem. O
            svém zdraví se poraďte s lékařem nebo nutričním terapeutem. Nutriční hodnoty: USDA FoodData
            Central; znění zdravotních tvrzení: nař. EU 432/2012. Odkazy na obchody jsou partnerské
            (affiliate) —{' '}
            <Link href="/jak-doporucujeme" className="hover:text-fg underline underline-offset-2">
              jak doporučujeme
            </Link>
            .
          </p>
          <div className="flex shrink-0 flex-col gap-2 md:items-end">
            <nav aria-label="Právní informace" className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/privacy" className="hover:text-fg">
                Ochrana osobních údajů
              </Link>
              <Link href="/terms" className="hover:text-fg">
                Podmínky
              </Link>
              {OPERATOR.email && (
                <a href={`mailto:${OPERATOR.email}`} className="hover:text-fg">
                  Kontakt
                </a>
              )}
            </nav>
            <p className="font-mono text-[12px]">© {new Date().getFullYear()} Better Live with Biohacking</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow !text-subtle mb-4">{title}</h2>
      <div className="text-muted flex flex-col gap-2 text-[14.5px]">{children}</div>
    </div>
  )
}
