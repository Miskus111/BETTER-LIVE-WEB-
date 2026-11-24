'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Scale, Search, X } from 'lucide-react'
import { FOOD_CATEGORIES, FOODS } from '@/data/foods'
import { NUTRIENTS } from '@/data/nutrients'
import type { Food } from '@/data/types'
import { STATE_CS } from '@/lib/foods/categories'
import {
  ALLERGEN_CS,
  EMPTY_QUERY,
  MEASURES,
  measureOf,
  portionText,
  queryFoods,
  foodTypoFix,
  type FoodQuery,
  type Measure,
  queryFromParams,
  queryToParams,
} from '@/lib/foods/query'
import { fmtAmount, notRecommendedReason } from '@/lib/nutrition'
import { Thumb } from '@/components/ui/Thumb'
import { topNutrient } from '@/lib/foods/summary'
import { Rhp } from '@/components/ui/Rhp'
import { cx } from '@/lib/format'
import { FoodDetail } from './FoodDetail'
import { FoodCompare } from './FoodCompare'
import { BarcodeLookup } from './BarcodeLookup'
import { scrollBehavior } from '@/lib/motion'

const PAGE = 24
const STATES = [...new Set(FOODS.map((f) => f.state))].sort((a, b) =>
  (STATE_CS[a] ?? a).localeCompare(STATE_CS[b] ?? b, 'cs'),
)
const HIGH_IN = Object.values(NUTRIENTS).filter((n) => n.ref && !n.qualitative)

export function FoodExplorer() {
  const [q, setQ] = useState<FoodQuery>(EMPTY_QUERY)
  const [shown, setShown] = useState(PAGE)
  const [selectedId, setSelectedId] = useState('salmon')
  const [compare, setCompare] = useState<string[]>([])
  const detail = useRef<HTMLDivElement>(null)

  // filters live in the URL (?q=…&diet=vegan…) so a search can be shared or bookmarked; read after hydration
  // (the page is static), then write back without adding history entries
  const urlRead = useRef(false)
  useEffect(() => {
    const fromUrl = queryFromParams(new URLSearchParams(window.location.search))
    // syncing from an external source (the URL) once after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (queryToParams(fromUrl).toString()) setQ(fromUrl)
    urlRead.current = true
  }, [])
  useEffect(() => {
    if (!urlRead.current) return
    const url = new URL(window.location.href)
    for (const k of [...url.searchParams.keys()]) url.searchParams.delete(k)
    queryToParams(q).forEach((v, k) => url.searchParams.set(k, v))
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url)
  }, [q])

  const foods = useMemo(() => queryFoods(FOODS, q), [q])
  // a search with no results gets a typo fix to try ("jogrt" → jogurt)
  const typoFix = useMemo(
    () => (foods.length || !q.q.trim() ? undefined : foodTypoFix(FOODS, q.q)),
    [foods, q.q],
  )
  const counts = useMemo(() => {
    const base = queryFoods(FOODS, { ...q, category: '' })
    return Object.fromEntries(FOOD_CATEGORIES.map((c) => [c, base.filter((f) => f.category === c).length]))
  }, [q])
  const shownId = foods.some((f) => f.id === selectedId) ? selectedId : foods[0]?.id
  const selected = FOODS.find((f) => f.id === shownId)
  const sortMeasure = MEASURES.find((m) => m.id === q.sort)

  // changing the query starts again from the first page
  const update = (patch: Partial<FoodQuery>) => {
    setQ((x) => ({ ...x, ...patch }))
    setShown(PAGE)
  }

  const pick = (id: string) => {
    setSelectedId(id)
    if (window.matchMedia('(max-width: 1023px)').matches)
      requestAnimationFrame(() =>
        detail.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }),
      )
  }
  const toggleCompare = (id: string) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c))

  return (
    <div>
      <div className="grid gap-3">
        <label className="relative block">
          <span className="sr-only">Hledat potravinu</span>
          <Search size={16} className="text-subtle absolute top-1/2 left-3 -translate-y-1/2" aria-hidden />
          <input
            type="search"
            value={q.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder={`Hledat mezi ${FOODS.length} potravinami — např. cocka, losos, tvaroh…`}
            className="field !pl-9"
            data-testid="food-search"
          />
        </label>

        <div
          role="tablist"
          aria-label="Kategorie potravin"
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
        >
          {(['', ...FOOD_CATEGORIES] as const).map((c) => (
            <button
              key={c || 'all'}
              type="button"
              role="tab"
              aria-selected={q.category === c}
              onClick={() => update({ category: c })}
              className="chip shrink-0"
            >
              {c || 'Vše'}
              <span className="font-mono text-[12px] opacity-70">
                {c ? counts[c] : Object.values(counts).reduce((s, n) => s + n, 0)}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <Select label="Stav" value={q.state} onChange={(v) => update({ state: v })}>
            <option value="">Jakýkoli stav</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {STATE_CS[s] ?? s}
              </option>
            ))}
          </Select>
          <Select label="Strava" value={q.diet} onChange={(v) => update({ diet: v as FoodQuery['diet'] })}>
            <option value="">Jakákoli strava</option>
            <option value="vegan">Veganské</option>
            <option value="vegetarian">Vegetariánské</option>
            <option value="glutenFree">Bez lepku</option>
          </Select>
          <Select label="Bez alergenu" value={q.without} onChange={(v) => update({ without: v })}>
            <option value="">Bez filtru alergenů</option>
            {Object.entries(ALLERGEN_CS).map(([k, v]) => (
              <option key={k} value={k}>
                Bez: {v}
              </option>
            ))}
          </Select>
          <Select
            label="Zdroj živiny (≥ 15 % RHP na 100 g)"
            value={q.highIn}
            onChange={(v) => update({ highIn: v as FoodQuery['highIn'] })}
          >
            <option value="">Zdroj živiny: cokoli</option>
            {HIGH_IN.map((n) => (
              <option key={n.id} value={n.id}>
                Zdroj: {n.name}
              </option>
            ))}
          </Select>
          <Select label="Řadit podle" value={q.sort} onChange={(v) => update({ sort: v as Measure | '' })}>
            <option value="">Řadit: podle kategorií</option>
            {MEASURES.map((m) => (
              <option key={m.id} value={m.id}>
                Nejvíc: {m.label}
              </option>
            ))}
          </Select>
          <Select label="Hodnoty na" value={q.per} onChange={(v) => update({ per: v as FoodQuery['per'] })}>
            <option value="100g">Hodnoty na 100 g</option>
            <option value="portion">Hodnoty na porci</option>
          </Select>
        </div>
      </div>

      <p className="text-subtle mt-3 text-[13px]" data-testid="food-count" aria-live="polite">
        {foods.length === FOODS.length
          ? `${foods.length} potravin`
          : `${foods.length} z ${FOODS.length} potravin`}
        {compare.length > 0 && ` · k porovnání vybráno ${compare.length}/3`}
      </p>

      {foods.length === 0 ? (
        <div className="card mt-4 p-6 text-center">
          <p className="text-muted">Žádná potravina neodpovídá filtrům.</p>
          {typoFix && (
            <button
              type="button"
              className="link mt-2 block w-full text-[14px]"
              data-testid="food-typo-fix"
              onClick={() => update({ ...q, q: typoFix })}
            >
              Mysleli jste „{typoFix}“?
            </button>
          )}
          <button type="button" className="link mt-2 text-[14px]" onClick={() => update(EMPTY_QUERY)}>
            Zrušit filtry
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <ul className="grid grid-cols-1 content-start gap-2 sm:grid-cols-2" aria-label="Potraviny">
              {foods.slice(0, shown).map((f) => (
                <li key={f.id} className="relative">
                  <button
                    type="button"
                    onClick={() => pick(f.id)}
                    aria-pressed={f.id === shownId}
                    data-testid={`food-${f.id}`}
                    className={cx(
                      'card group flex w-full items-center gap-3 overflow-hidden p-2 pr-10 text-left transition',
                      f.id === shownId
                        ? '!border-cyan/60 shadow-[0_0_30px_-12px_rgba(94,231,255,0.6)]'
                        : 'hover:border-line-strong',
                    )}
                  >
                    <Thumb src={f.image} alt="" ratio="aspect-square" className="w-14 shrink-0 rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-medium">{f.name}</span>
                      <span className="text-subtle block truncate text-[12px]">{f.basis}</span>
                      <span className="text-subtle block truncate font-mono text-[12px]">
                        {summary(f, q, sortMeasure)}
                      </span>
                      {(() => {
                        // no praise on the card for foods whose page says they aren't a good source
                        const top = notRecommendedReason(f) ? null : topNutrient(f)
                        return top ? (
                          <span className="text-cyan/90 block truncate text-[12px]">
                            Vysoký obsah: {top.name} ({top.pct} % <Rhp />)
                          </span>
                        ) : null
                      })()}
                    </span>
                  </button>
                  <label
                    className="text-subtle hover:text-fg absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg"
                    title="Přidat k porovnání"
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={compare.includes(f.id)}
                      disabled={!compare.includes(f.id) && compare.length >= 3}
                      onChange={() => toggleCompare(f.id)}
                      aria-label={`Porovnat: ${f.name}`}
                    />
                    <Scale size={15} aria-hidden className="peer-checked:text-cyan" />
                  </label>
                </li>
              ))}
            </ul>
            {shown < foods.length && (
              <button
                type="button"
                className="btn btn-ghost mt-3 w-full"
                onClick={() => setShown((n) => n + PAGE)}
                data-testid="food-more"
              >
                Zobrazit další ({foods.length - shown})
              </button>
            )}
          </div>
          {selected && (
            <div ref={detail} className="scroll-mt-20 lg:sticky lg:top-20 lg:self-start">
              <div
                className="card p-5 md:p-6 lg:max-h-[calc(100svh-6rem)] lg:overflow-y-auto lg:overscroll-contain"
                key={selected.id}
              >
                <div className="fade-up">
                  <FoodDetail food={selected} showPageLink headingLevel="h2" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {compare.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[17px] font-medium">
              Porovnání ({q.per === 'portion' ? 'na porci' : 'na 100 g'})
            </h2>
            <button
              type="button"
              className="link inline-flex items-center gap-1 text-[13.5px]"
              onClick={() => setCompare([])}
            >
              <X size={13} aria-hidden /> Zrušit porovnání
            </button>
          </div>
          <FoodCompare foods={compare.map((id) => FOODS.find((f) => f.id === id)!)} per={q.per} />
        </div>
      )}
      <BarcodeLookup />
    </div>
  )
}

function summary(f: Food, q: FoodQuery, m?: { id: Measure; label: string; unit: string }) {
  const per = q.per === 'portion' ? f.portion.grams / 100 : 1
  const unit = q.per === 'portion' ? ` · ${portionText(f.portion)}` : ''
  if (m && !['kcal', 'protein'].includes(m.id)) {
    const v = measureOf(f, m.id)
    return v === undefined ? `${m.label}: bez údajů` : `${m.label}: ${fmtAmount(v * per, m.unit)}${unit}`
  }
  return `${Math.round(f.kcal * per)} kcal · ${fmtAmount(f.macros.protein * per, 'g')} bílkovin${unit}`
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field !py-2 text-[13.5px]">
        {children}
      </select>
    </label>
  )
}
