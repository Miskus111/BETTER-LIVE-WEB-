import Link from 'next/link'
import { EvidenceLegend } from '@/components/ui/EvidenceBadge'

const RULES = [
  {
    k: '01',
    t: 'Žádné zázraky',
    d: 'Žádná potravina orgán neléčí, nedetoxikuje ani neopravuje. Nikdy to netvrdíme.',
  },
  {
    k: '02',
    t: 'Hodnocené důkazy',
    d: 'Každé propojení živiny s orgánem má úroveň důkazů a tam, kde existuje, používá znění schválené EU.',
  },
  {
    k: '03',
    t: 'Vypočteno, ne vybráno',
    d: 'Potravina je s orgánem propojená, jen pokud 100 g dodá ≥ 15 % referenční hodnoty — spočítáno z dat USDA.',
  },
  {
    k: '04',
    t: 'Sdílené živiny',
    d: 'Žádná živina neslouží jen jednomu orgánu. Mapa těla ukazuje příklady, ne výlučné potřeby.',
  },
]

export function ScienceTeaser() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
      <ol className="grid gap-3 sm:grid-cols-2">
        {RULES.map((r) => (
          <li key={r.k} className="card p-5">
            <span className="text-cyan font-mono text-[12px]">{r.k}</span>
            <h3 className="mt-3 text-[18px] font-medium">{r.t}</h3>
            <p className="text-muted mt-1.5 text-[14.5px]">{r.d}</p>
          </li>
        ))}
      </ol>
      <div className="card flex flex-col p-6">
        <h3 className="eyebrow mb-4">Úrovně důkazů</h3>
        <EvidenceLegend />
        <Link href="/science" className="btn btn-ghost mt-auto self-start">
          Metodika a zdroje
        </Link>
      </div>
    </div>
  )
}
