import Link from 'next/link'
import { Factory, Fish, Leaf, Sprout } from 'lucide-react'

const POINTS = [
  {
    icon: Leaf,
    t: 'Nejdřív certifikované bio EU',
    d: 'Mléčné výrobky, vejce, maso, zelenina i ovoce nesou logo EU pro ekologické zemědělství — s kódem kontrolního subjektu u každého produktu.',
  },
  {
    icon: Sprout,
    t: 'Pastva — jen když je ověřená',
    d: '„Z pastvy“ nebo „krmeno trávou“ říkáme jen tam, kde se to kontroluje při inspekci.',
  },
  {
    icon: Factory,
    t: 'Minimální zpracování',
    d: 'Přirozená fermentace, tradiční postupy; bez umělých barviv, sladidel a zbytečných přísad.',
  },
  {
    icon: Fish,
    t: 'Poctivé označení',
    d: 'Divoká ryba nemůže být bio, a tak to i píšeme. Co nemá certifikaci, je označené „Konvenční“.',
  },
]

export function StandardTeaser() {
  return (
    <div className="card overflow-hidden">
      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        {POINTS.map(({ icon: Icon, t, d }) => (
          <div
            key={t}
            className="border-line border-b p-6 md:border-r lg:border-b-0 [&:last-child]:border-r-0"
          >
            <Icon size={22} className="text-bio" aria-hidden />
            <h3 className="mt-5 text-[17px] font-medium">{t}</h3>
            <p className="text-muted mt-1.5 text-[14.5px]">{d}</p>
          </div>
        ))}
      </div>
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t p-5">
        <p className="text-muted text-[14px]">Přečtěte si, jak vybíráme — a co odmítáme tvrdit.</p>
        <Link href="/our-standard" className="btn btn-ghost">
          Náš standard
        </Link>
      </div>
    </div>
  )
}
