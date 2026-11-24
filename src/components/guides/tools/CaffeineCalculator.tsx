'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cx } from '@/lib/format'

/** Typical caffeine per serving — EFSA (2015) "Caffeine: EFSA explains risk assessment". */
const DRINKS = [
  { id: 'espresso', label: 'Espresso', serving: '60 ml', mg: 80 },
  { id: 'filter', label: 'Překapávaná káva', serving: '200 ml', mg: 90 },
  { id: 'energy', label: 'Energetický nápoj', serving: '250 ml', mg: 80 },
  { id: 'tea', label: 'Černý čaj', serving: '220 ml', mg: 50 },
  { id: 'cola', label: 'Cola', serving: '355 ml', mg: 40 },
] as const
type DrinkId = (typeof DRINKS)[number]['id']
const BY_ID = Object.fromEntries(DRINKS.map((d) => [d.id, d])) as Record<DrinkId, (typeof DRINKS)[number]>

const HALF_LIVES = [
  { h: 3, label: 'rychle' },
  { h: 5, label: 'průměr' },
  { h: 7, label: 'pomalu' },
]

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}
const fmtTime = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
}

/** One-compartment first-order elimination: amount(t) = dose · 0.5^(Δt / half-life). Absorption ignored. */
function amountAt(min: number, intakes: { min: number; mg: number }[], halfLifeH: number) {
  return intakes.reduce(
    (s, i) => (min >= i.min ? s + i.mg * Math.pow(0.5, (min - i.min) / (halfLifeH * 60)) : s),
    0,
  )
}

export function CaffeineCalculator() {
  const [items, setItems] = useState<{ key: number; drink: DrinkId; time: string }[]>([
    { key: 1, drink: 'filter', time: '08:00' },
    { key: 2, drink: 'energy', time: '15:30' },
  ])
  const [bed, setBed] = useState('23:00')
  const [half, setHalf] = useState(5)

  // the day runs up to bedtime: anything clocked after bedtime belongs to the day before
  // (works for night owls who drink after midnight and for day sleepers after a night shift)
  const bedMin = toMin(bed) + 1440
  const start = bedMin - 18 * 60
  const end = bedMin + 120
  const intakes = items.map((i) => {
    const m = toMin(i.time) + 1440
    return { min: m > bedMin ? m - 1440 : m, mg: BY_ID[i.drink].mg }
  })
  const total = intakes.reduce((s, i) => s + i.mg, 0)
  const atBed = Math.round(amountAt(bedMin, intakes, half))
  const espressos = atBed / 80

  const curve: [number, number][] = []
  for (let m = start; m <= end; m += 10) curve.push([m, amountAt(m, intakes, half)])

  const W = 380
  const H = 170
  // y axis rounded up to a multiple of 50 mg
  const top = Math.max(100, Math.ceil(Math.max(...curve.map((p) => p[1])) / 50) * 50)
  const maxY = top * 1.08
  const x = (m: number) => 40 + ((m - start) / (end - start)) * (W - 50)
  const y = (v: number) => H - 22 - (v / maxY) * (H - 40)
  const path = curve.map(([m, v], i) => `${i ? 'L' : 'M'}${x(m).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  return (
    <div className="card p-5" data-testid="caffeine-calc">
      <h3 className="text-[18px] font-medium">Kolik kofeinu vám zbude do spánku?</h3>
      <p className="text-muted mt-1 text-[14.5px]">
        Přidejte, co dnes pijete. Graf ukazuje, kolik kofeinu je v těle v každou hodinu.
      </p>

      <ul className="mt-4 grid gap-2">
        {items.map((it) => (
          <li key={it.key} className="flex min-w-0 flex-wrap items-center gap-2">
            <select
              value={it.drink}
              onChange={(e) =>
                setItems((a) =>
                  a.map((x) => (x.key === it.key ? { ...x, drink: e.target.value as DrinkId } : x)),
                )
              }
              className="field !w-auto max-w-full min-w-0 flex-1 basis-full !py-2 text-[14.5px] sm:basis-0"
              aria-label="Nápoj"
            >
              {DRINKS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} ({d.serving}) · {d.mg} mg
                </option>
              ))}
            </select>
            <input
              type="time"
              value={it.time}
              onChange={(e) =>
                setItems((a) =>
                  a.map((x) => (x.key === it.key ? { ...x, time: e.target.value || x.time } : x)),
                )
              }
              className="field !w-[120px] !py-2 text-[14.5px]"
              aria-label="Čas"
            />
            <button
              type="button"
              onClick={() => setItems((a) => a.filter((x) => x.key !== it.key))}
              className="text-subtle hover:text-fg p-2"
              aria-label="Odebrat nápoj"
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="text-cyan mt-2 inline-flex items-center gap-1 text-[14px]"
        onClick={() => setItems((a) => [...a, { key: Date.now(), drink: 'espresso', time: '13:00' }])}
      >
        <Plus size={15} /> Přidat nápoj
      </button>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="text-[14px]">
          <span className="text-muted block text-[13px]">Jdu spát v</span>
          <input
            type="time"
            value={bed}
            onChange={(e) => setBed(e.target.value || bed)}
            className="field mt-1 !w-[120px] !py-2"
          />
        </label>
        <div>
          <span className="text-muted block text-[13px]">Jak rychle odbourávám kofein</span>
          <div className="mt-1 flex flex-wrap gap-1" role="group" aria-label="Poločas kofeinu">
            {HALF_LIVES.map((h) => (
              <button
                key={h.h}
                type="button"
                aria-pressed={half === h.h}
                onClick={() => setHalf(h.h)}
                className={cx(
                  'rounded-full border px-3 py-1.5 text-[13px] whitespace-nowrap',
                  half === h.h ? 'border-cyan bg-cyan/10' : 'border-line text-muted',
                )}
              >
                {h.label} <span className="text-subtle font-mono">{h.h} h</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-5 w-full"
        role="img"
        aria-label={`Křivka kofeinu během dne; v ${fmtTime(bedMin)} zbývá asi ${atBed} mg`}
      >
        {[0, 0.5, 1].map((f) => {
          const v = Math.round(top * f)
          return (
            <g key={f}>
              <line x1={40} x2={W - 10} y1={y(v)} y2={y(v)} stroke="#9fdcff" strokeOpacity={0.08} />
              <text x={0} y={y(v) + 3} fontSize={11} fill="#7f8b96" fontFamily="var(--font-geist-mono)">
                {v} mg
              </text>
            </g>
          )
        })}
        {Array.from(
          { length: Math.floor((end - start) / 240) + 1 },
          (_, i) => Math.ceil(start / 60) * 60 + i * 240,
        )
          .filter((m) => m <= end)
          .map((m) => (
            <text
              key={m}
              x={x(m)}
              y={H - 6}
              fontSize={10}
              fill="#7f8b96"
              textAnchor="middle"
              fontFamily="var(--font-geist-mono)"
            >
              {fmtTime(m)}
            </text>
          ))}
        <path d={`${path} L${x(end)},${y(0)} L${x(start)},${y(0)} Z`} fill="#f5c46a" fillOpacity={0.12} />
        <path d={path} fill="none" stroke="#f5c46a" strokeWidth={2} strokeLinejoin="round" />
        <line x1={x(bedMin)} x2={x(bedMin)} y1={12} y2={y(0)} stroke="#9fb6ff" strokeDasharray="3 3" />
        <circle cx={x(bedMin)} cy={y(atBed)} r={4} fill="#9fb6ff" />
        <text
          x={x(bedMin) + (x(bedMin) > W - 90 ? -6 : 6)}
          y={20}
          fontSize={11}
          textAnchor={x(bedMin) > W - 90 ? 'end' : 'start'}
          fill="#c9d4ff"
          fontFamily="var(--font-geist-mono)"
        >
          spánek {fmtTime(bedMin)}
        </text>
      </svg>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p
          className="rounded-xl border border-[#9fb6ff]/30 bg-[#9fb6ff]/[0.06] p-3 text-[15px]"
          data-testid="caffeine-at-bed"
        >
          V {fmtTime(bedMin)} budete mít v těle zhruba <strong className="font-medium">{atBed} mg</strong>{' '}
          kofeinu
          {espressos >= 0.3 && (
            <> — asi jako {espressos.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} espressa</>
          )}
          .
        </p>
        <p
          className={cx(
            'rounded-xl border p-3 text-[15px]',
            total > 400 ? 'border-warn/40 bg-warn/[0.06]' : 'border-line',
          )}
        >
          Dnes celkem <strong className="font-medium">{total} mg</strong>.{' '}
          {total > 400
            ? 'To je nad 400 mg, které EFSA považuje za bezpečné pro dospělé.'
            : 'Bezpečná denní dávka pro dospělé je podle EFSA do 400 mg.'}
        </p>
      </div>
      <p className="text-subtle mt-3 text-[12.5px] leading-relaxed">
        Zjednodušený model: kofein ubývá rovnoměrně o polovinu za každý poločas; vstřebávání (asi 45 minut)
        nepočítá. Poločas se u dospělých liší zhruba mezi 2 a 8 hodinami — kouření ho zkracuje, hormonální
        antikoncepce a těhotenství prodlužují. Ve studii zkrátilo 400 mg kofeinu i 6 hodin před spaním spánek
        o víc než hodinu.
      </p>
    </div>
  )
}
