'use client'

import { useRef, useState } from 'react'
import { FOOD_CATEGORIES, FOODS } from '@/data/foods'
import type { FoodCategory } from '@/data/types'
import { Thumb } from '@/components/ui/Thumb'
import { cx } from '@/lib/format'
import { FoodDetail } from './FoodDetail'

export function FoodExplorer() {
  const [cat, setCat] = useState<FoodCategory | 'Vše'>('Vše')
  const [selectedId, setSelectedId] = useState(FOODS[0].id)
  const detail = useRef<HTMLDivElement>(null)
  const foods = cat === 'Vše' ? FOODS : FOODS.filter((f) => f.category === cat)
  // the selection always stays inside the visible category
  const shownId = foods.some((f) => f.id === selectedId) ? selectedId : foods[0].id
  const selected = FOODS.find((f) => f.id === shownId)!

  const pick = (id: string) => {
    setSelectedId(id)
    if (window.matchMedia('(max-width: 1023px)').matches)
      requestAnimationFrame(() => detail.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Kategorie potravin"
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
      >
        {(['Vše', ...FOOD_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className="chip shrink-0"
          >
            {c}
            <span className="font-mono text-[12px] opacity-70">
              {c === 'Vše' ? FOODS.length : FOODS.filter((f) => f.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <ul className="grid grid-cols-1 content-start gap-2 sm:grid-cols-2" aria-label="Potraviny">
          {foods.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => pick(f.id)}
                aria-pressed={f.id === shownId}
                data-testid={`food-${f.id}`}
                className={cx(
                  'card group flex w-full items-center gap-3 overflow-hidden p-2 text-left transition',
                  f.id === shownId
                    ? '!border-cyan/60 shadow-[0_0_30px_-12px_rgba(94,231,255,0.6)]'
                    : 'hover:border-line-strong',
                )}
              >
                <Thumb src={f.image} alt="" ratio="aspect-square" className="w-14 shrink-0 rounded-lg" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-medium">{f.name}</span>
                  <span className="text-subtle block truncate font-mono text-[12px]">
                    {f.kcal} kcal · {String(f.macros.protein).replace('.', ',')} g bílkovin
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div ref={detail} className="scroll-mt-20 lg:sticky lg:top-20 lg:self-start">
          <div
            className="card p-5 md:p-6 lg:max-h-[calc(100svh-6rem)] lg:overflow-y-auto lg:overscroll-contain"
            key={selected.id}
          >
            <div className="fade-up">
              <FoodDetail food={selected} showPageLink />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
