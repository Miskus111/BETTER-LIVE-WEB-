'use client'

import { useState } from 'react'
import { EU_REFERENCE, NRV_KEYS, PANEL, PANEL_GROUPS, type PanelKey } from '@/lib/foods/panel'
import type { GeneratedFood } from '@/lib/foods/types'
import { cx } from '@/lib/format'
import { Rhp } from '@/components/ui/Rhp'

const fmt = (v: number) =>
  new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: v >= 100 ? 0 : v >= 10 ? 1 : 2 }).format(v)

/**
 * Full nutrient table of one food with a portion selector that recalculates every value.
 * Values come straight from the dataset; a missing value is shown as "bez údajů", never as 0.
 */
export function FoodNutritionPanel({ food }: { food: GeneratedFood }) {
  const [grams, setGrams] = useState(food.portions[0].grams)
  const [custom, setCustom] = useState('')
  const factor = grams / 100
  const liquid = food.liquid
  const threshold = liquid ? 0.075 : 0.15

  return (
    <section aria-labelledby="nutrition" data-testid="nutrition-panel">
      <h2 id="nutrition" className="text-[20px] font-medium">
        Nutriční hodnoty
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Porce">
        {food.portions.map((p) => (
          <button
            key={`${p.label}-${p.grams}`}
            type="button"
            aria-pressed={grams === p.grams && !custom}
            onClick={() => {
              setGrams(p.grams)
              setCustom('')
            }}
            className="chip"
          >
            {p.label}
            {!/\d\s*(g|ml|l)\b/.test(p.label) && (
              <span className="font-mono text-[12px] opacity-70">{fmt(p.grams)} g</span>
            )}
          </button>
        ))}
        <label className="flex items-center gap-1.5 text-[13.5px]">
          <span className="text-subtle">vlastní:</span>
          <input
            inputMode="decimal"
            value={custom}
            placeholder="g"
            aria-label="Vlastní množství v gramech"
            onChange={(e) => {
              setCustom(e.target.value)
              const v = Number(e.target.value.replace(',', '.'))
              if (v > 0 && v <= 5000) setGrams(v)
            }}
            className="field !w-20 !py-1.5 text-center"
            data-testid="portion-grams"
          />
        </label>
      </div>
      <p className="text-subtle mt-2 text-[12.5px]">
        Hodnoty pro {fmt(grams)} g (
        {food.portions.find((p) => p.grams === grams)?.source === 'FDC'
          ? 'hmotnost porce podle USDA'
          : 'zvolené množství'}
        ). Procenta = podíl referenční hodnoty příjmu dospělého podle nařízení EU 1169/2011.
      </p>

      <div className="mt-4 grid gap-5">
        {PANEL_GROUPS.filter((g) => g.id !== 'energy').map((g) => {
          const rows = PANEL.filter((p) => p.group === g.id || (g.id === 'macro' && p.group === 'energy'))
          return (
            <div key={g.id} className="card overflow-hidden p-0">
              <h3 className="eyebrow border-line border-b px-4 py-2.5">{g.cs}</h3>
              <table className="w-full text-[14px]">
                <tbody>
                  {(g.id === 'macro'
                    ? [
                        ...rows.filter((r) => r.group === 'energy'),
                        ...rows.filter((r) => r.group !== 'energy'),
                      ]
                    : rows
                  ).map((p) => {
                    const v100 = food.nutrients[p.key as PanelKey]
                    const v = v100 === null ? null : v100 * factor
                    const ref = EU_REFERENCE[p.key as PanelKey]
                    const pct = v !== null && ref ? Math.round((v / ref) * 100) : null
                    const source =
                      v100 !== null && ref && NRV_KEYS.has(p.key as PanelKey) && v100 >= ref * threshold
                    const indent = [
                      'satFat',
                      'monoFat',
                      'polyFat',
                      'transFat',
                      'sugars',
                      'addedSugars',
                    ].includes(p.key)
                    return (
                      <tr
                        key={p.key}
                        className="border-line/60 border-b last:border-0"
                        data-testid={`row-${p.key}`}
                      >
                        <th
                          scope="row"
                          className={cx('text-muted px-4 py-2 text-left font-normal', indent && 'pl-8')}
                        >
                          {p.cs}
                          {'hint' in p && p.hint && (
                            <span className="text-subtle block text-[11.5px] font-normal">{p.hint}</span>
                          )}
                        </th>
                        <td className="px-2 py-2 text-right font-mono whitespace-nowrap">
                          {v === null ? (
                            <span className="text-subtle">bez údajů</span>
                          ) : (
                            `${fmt(v)} ${p.unit}`
                          )}
                        </td>
                        <td className="w-[38%] px-4 py-2">
                          {pct !== null && (
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 rounded-full bg-white/[0.06]" aria-hidden>
                                <div
                                  className={cx('h-full rounded-full', source ? 'bg-bio' : 'bg-cyan/70')}
                                  style={{ width: `${Math.min(100, pct)}%` }}
                                />
                              </div>
                              <span
                                className={cx(
                                  'w-12 text-right font-mono text-[12px]',
                                  source ? 'text-bio' : 'text-subtle',
                                )}
                              >
                                {pct} %
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
      <p className="text-subtle mt-3 text-[12.5px]">
        Zeleně: na 100 {liquid ? 'ml' : 'g'} dosahuje úrovně „zdroj“ podle EU (≥ {liquid ? '7,5' : '15'} %{' '}
        <Rhp />
        ). Sacharidy uvádíme dvakrát: využitelné (evropská konvence na etiketách) a celkem včetně vlákniny
        (USDA).
      </p>
    </section>
  )
}
