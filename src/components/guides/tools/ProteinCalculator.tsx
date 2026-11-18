'use client'

import { useState } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { FOOD_BY_ID } from '@/data/foods'
import { cx } from '@/lib/format'

/**
 * Daily protein: EFSA population reference intake 0.83 g/kg (healthy adults) and ~1.6 g/kg for
 * people strength training (Morton et al. 2018 meta-analysis — little extra gain above that).
 * Portions use the site's USDA FoodData Central values per 100 g.
 */
const PORTIONS: { food: string; label: string; grams: number }[] = [
  { food: 'chicken', label: 'Kuřecí prsa', grams: 150 },
  { food: 'salmon', label: 'Losos', grams: 150 },
  { food: 'egg', label: 'Vejce (2 ks)', grams: 100 },
  { food: 'greek-yogurt', label: 'Řecký jogurt', grams: 200 },
  { food: 'lentils', label: 'Čočka vařená', grams: 200 },
  { food: 'oats', label: 'Ovesné vločky', grams: 60 },
  { food: 'emmental', label: 'Ementál', grams: 30 },
  { food: 'almonds', label: 'Mandle', grams: 30 },
]

const protein = (p: (typeof PORTIONS)[number]) =>
  Math.round(((FOOD_BY_ID[p.food]?.macros.protein ?? 0) * p.grams) / 100)

export function ProteinCalculator() {
  const [kg, setKg] = useState(70)
  const [count, setCount] = useState<Record<string, number>>({ 'greek-yogurt': 1, chicken: 1, egg: 1 })
  const health = Math.round(kg * 0.83)
  const muscle = Math.round(kg * 1.6)
  const total = PORTIONS.reduce((s, p) => s + protein(p) * (count[p.food] ?? 0), 0)
  const pct = Math.min(100, (total / muscle) * 100)

  const change = (food: string, d: number) =>
    setCount((c) => ({ ...c, [food]: Math.max(0, Math.min(6, (c[food] ?? 0) + d)) }))

  return (
    <div className="card p-5" data-testid="protein-calc">
      <h3 className="text-[18px] font-medium">Kolik bílkovin potřebujete — a co to je na talíři?</h3>

      <label className="mt-4 block">
        <span className="flex items-baseline justify-between text-[14px]">
          <span className="text-muted">Vaše hmotnost</span>
          <span className="font-mono text-[20px]">{kg} kg</span>
        </span>
        <input
          type="range"
          min={40}
          max={140}
          value={kg}
          onChange={(e) => setKg(Number(e.target.value))}
          className="mt-2 w-full accent-[#5ee7ff]"
          aria-label="Hmotnost v kilogramech"
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="border-line rounded-xl border p-3">
          <p className="text-subtle text-[12.5px]">Minimum pro zdraví (EFSA)</p>
          <p className="mt-0.5 font-mono text-[22px]" data-testid="protein-health">
            {health} g
          </p>
        </div>
        <div className="border-cyan/40 rounded-xl border p-3">
          <p className="text-subtle text-[12.5px]">Při posilování</p>
          <p className="mt-0.5 font-mono text-[22px]" data-testid="protein-muscle">
            {muscle} g
          </p>
        </div>
      </div>

      <p className="text-muted mt-5 text-[14.5px]">Poskládejte si den — klepnutím přidáte porci:</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {PORTIONS.map((p) => {
          const n = count[p.food] ?? 0
          return (
            <li
              key={p.food}
              className={cx(
                'flex items-center justify-between gap-2 rounded-xl border px-3 py-2',
                n ? 'border-cyan/40 bg-cyan/[0.04]' : 'border-line',
              )}
            >
              <span className="min-w-0">
                <span className="block truncate text-[14px]">{p.label}</span>
                <span className="text-subtle font-mono text-[12px]">
                  {p.grams} g · {protein(p)} g bílk.
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => change(p.food, -1)}
                  disabled={!n}
                  className="text-subtle hover:text-fg rounded-full p-1.5 disabled:opacity-30"
                  aria-label={`Ubrat porci: ${p.label}`}
                >
                  <Minus size={14} />
                </button>
                <span className="w-4 text-center font-mono text-[14px]">{n}</span>
                <button
                  type="button"
                  onClick={() => change(p.food, 1)}
                  className="text-cyan rounded-full p-1.5"
                  aria-label={`Přidat porci: ${p.label}`}
                >
                  <Plus size={14} />
                </button>
              </span>
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-[14px]">
          <span>
            Na talíři:{' '}
            <strong className="font-medium" data-testid="protein-total">
              {total} g
            </strong>
          </span>
          <span className="text-subtle font-mono text-[13px]">cíl {muscle} g</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-white/[0.06]">
          <div
            className={cx('h-full rounded-full transition-all', total >= muscle ? 'bg-bio' : 'bg-cyan')}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-muted mt-2 text-[14px]">
          {total >= muscle
            ? 'Máte to. Víc už svalům podle výzkumu skoro nepřidá.'
            : total >= health
              ? `Na zdraví stačí, pro růst svalů chybí ještě ${muscle - total} g.`
              : `Do minima chybí ještě ${health - total} g.`}
        </p>
        <button
          type="button"
          onClick={() => setCount({})}
          className="text-subtle hover:text-fg mt-1 inline-flex items-center gap-1 text-[13px]"
        >
          <RotateCcw size={13} /> Vyprázdnit talíř
        </button>
      </div>

      <p className="text-subtle mt-3 text-[12.5px] leading-relaxed">
        EFSA doporučuje dospělým 0,83 g bílkovin na kg denně. Při posilování přestává nárůst svalů přibývat
        zhruba u 1,6 g/kg (horní hranice odhadu 2,2 g/kg). Hodnoty porcí jsou z databáze USDA. Při onemocnění
        ledvin se o bílkovinách poraďte s lékařem.
      </p>
    </div>
  )
}
