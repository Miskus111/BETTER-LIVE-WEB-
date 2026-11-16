import type { Metadata } from 'next'
import Link from 'next/link'
import { Fish, Leaf, Tag } from 'lucide-react'
import { PRODUCTS } from '@/data/products'
import { SRC } from '@/data/sources'
import { SampleDataLabel } from '@/components/layout/SampleDataLabel'
import { isVerifiedOrganic } from '@/lib/nutrition'

export const metadata: Metadata = {
  title: 'Náš standard — nejdřív bio',
  description:
    'Proč FLX upřednostňuje certifikované bio potraviny EU, kdy píšeme „z pastvy“ a jak označujeme každý produkt.',
  alternates: { canonical: '/our-standard' },
}

const PRINCIPLES = [
  {
    t: 'Certifikované bio EU všude, kde existuje',
    d: 'Mléčné výrobky, vejce, maso, zeleninu a ovoce nakupujeme certifikované podle nařízení (EU) 2018/848: bez syntetických pesticidů, bez rutinních antibiotik, s výběhem pro zvířata, bio krmivem a každoroční kontrolou.',
  },
  {
    t: '„Z pastvy“ a „krmeno trávou“ — jen když je to ověřené',
    d: 'Tyto pojmy nemají právní definici, a tak je používáme jen tam, kde se pastva kontroluje při každoroční inspekci a je zaznamenaná v datech produktu.',
  },
  {
    t: 'Přirozená fermentace, tradiční postupy',
    d: 'Fermentované potraviny vznikají fermentací — ne okyselením octem — a „živé kultury“ píšeme jen u výrobků, které po fermentaci nebyly pasterované.',
  },
  {
    t: 'Nic zbytečného',
    d: 'Žádná umělá barviva, sladidla ani zahušťovadla v mléčných výrobcích, žádné přehnané zpracování. U každého produktu uvádíme, jak byl zpracován.',
  },
]

export default function StandardPage() {
  const organic = PRODUCTS.filter(isVerifiedOrganic).length
  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 md:px-8">
      <p className="eyebrow">Náš standard</p>
      <h1 className="display mt-3 text-[48px] md:text-[68px]">Nejdřív bio. Vždy poctivě.</h1>
      <p className="text-muted mt-4 max-w-3xl text-[16px]">
        Certifikace bio není zdravotní tvrzení. Je to ověřitelný standard výroby — a ten nejspolehlivější,
        jaký Evropa má. Proto u něj začínáme a všechno ostatní označujeme bez přikrášlování.
      </p>
      <p className="text-subtle mt-4 font-mono text-[13px]">
        Certifikovaných bio EU je {organic} z {PRODUCTS.length} produktů v aktuální nabídce.
      </p>

      <ol className="mt-12 grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <li key={p.t} className="card p-6">
            <span className="text-bio font-mono text-[12px]">0{i + 1}</span>
            <h2 className="mt-3 text-[20px] font-medium">{p.t}</h2>
            <p className="text-muted mt-2 text-[15px]">{p.d}</p>
          </li>
        ))}
      </ol>

      <section className="border-line mt-16 border-t pt-8">
        <h2 className="display text-[34px]">Jak produkty označujeme</h2>
        <ul className="mt-6 grid gap-3">
          <Label icon={<Leaf size={18} className="text-bio" />} name="EU BIO">
            Jen pokud je certifikace ověřená a máme kód kontrolního subjektu (např. CZ-BIO-000). Bio suroviny
            jsou ve složení označené hvězdičkou *.
          </Label>
          <Label
            icon={<Fish size={18} className="text-[#9cc9ff]" />}
            name="Divoký úlovek · nelze certifikovat jako bio"
          >
            Pravidla EU povolují bio akvakulturu, divoké ryby ale certifikovat nelze. Píšeme to rovnou, místo
            abychom naznačovali opak.
          </Label>
          <Label icon={<Tag size={18} className="text-muted" />} name="Konvenční">
            Vše, co nemá certifikaci bio — včetně výrobků, které obsahují jen některé bio suroviny. Nikdy
            „přírodní“.
          </Label>
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <SampleDataLabel />
          <p className="text-subtle text-[13.5px]">
            Výrobci, ceny a kódy kontrolních subjektů jsou v tomto prototypu ukázkové. Automatická kontrola (
            <code className="font-mono">npm run check:data</code>) zablokuje každý produkt, který tvrdí bio
            bez ověřeného kódu.
          </p>
        </div>
      </section>

      <section className="border-line mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-8">
        <a href={SRC.organicReg.url} target="_blank" rel="noreferrer noopener" className="link text-[15px]">
          {SRC.organicReg.title}
        </a>
        <Link href="/shop?bio=1" className="btn btn-primary">
          Nakupovat EU BIO produkty
        </Link>
      </section>
    </div>
  )
}

function Label({ icon, name, children }: { icon: React.ReactNode; name: string; children: React.ReactNode }) {
  return (
    <li className="card flex gap-4 p-5">
      <span className="mt-0.5 shrink-0" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="font-mono text-[14px]">{name}</p>
        <p className="text-muted mt-1 text-[14.5px]">{children}</p>
      </div>
    </li>
  )
}
