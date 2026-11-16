import Link from 'next/link'
import { Factory, Fish, Leaf, Sprout } from 'lucide-react'

const POINTS = [
  {
    icon: Leaf,
    t: 'Certified EU organic first',
    d: 'Dairy, eggs, meat, vegetables and fruit carry the EU organic logo — with the control-body code on every product.',
  },
  {
    icon: Sprout,
    t: 'Pasture — only when verified',
    d: 'We say “pasture-raised” or “grass-fed” only where it is checked at inspection.',
  },
  {
    icon: Factory,
    t: 'Minimal processing',
    d: 'Natural fermentation, traditional preparation; no artificial colours, sweeteners or unnecessary additives.',
  },
  {
    icon: Fish,
    t: 'Honest labels',
    d: 'Wild fish cannot be organic, so we say exactly that. Anything not certified is labelled “Conventional”.',
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
        <p className="text-muted text-[14px]">Read how we choose — and what we refuse to claim.</p>
        <Link href="/our-standard" className="btn btn-ghost">
          Our standard
        </Link>
      </div>
    </div>
  )
}
