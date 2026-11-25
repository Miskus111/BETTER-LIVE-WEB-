'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Apple,
  Atom,
  BookA,
  BookOpen,
  Calculator,
  CornerDownLeft,
  FileText,
  HeartPulse,
  Pill,
  Search,
  X,
} from 'lucide-react'
import { correctQuery, search, SEARCH_INDEX, type SearchItem, type SearchKind } from '@/lib/search'
import { useUi } from '@/lib/store/ui'
import { cx } from '@/lib/format'

const ICON: Record<SearchKind, typeof Apple> = {
  Orgán: HeartPulse,
  Živina: Atom,
  Potravina: Apple,
  Stránka: FileText,
  Průvodce: BookOpen,
  Doplněk: Pill,
  Kalkulačka: Calculator,
  Pojem: BookA,
}
const SUGGESTED = [
  'guide-spanek',
  'guide-dopamin-a-mobil',
  'compound-creatine',
  'brain',
  'omega3',
  'jak-funguje-telo',
] as const

export function CommandPalette() {
  const router = useRouter()
  const { searchOpen: open, setSearch } = useUi()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)

  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (open) {
      setQ('')
      setActive(0)
    }
  }
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => input.current?.focus())
      document.body.style.overflow = 'hidden'
    } else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // a query with no results falls back to its typo fix ("brokolce" → brokolice), which the list then names
  const { results, corrected } = useMemo((): { results: SearchItem[]; corrected?: string } => {
    if (!q.trim())
      return {
        results: SUGGESTED.map((id) => SEARCH_INDEX.find((i) => i.id === id)).filter(
          (x): x is SearchItem => !!x,
        ),
      }
    const hits = search(q)
    if (hits.length) return { results: hits }
    const fix = correctQuery(q)
    return fix ? { results: search(fix), corrected: fix } : { results: [] }
  }, [q])

  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const goTo = (href: string) => {
    setSearch(false)
    router.push(href)
  }
  const go = (item: SearchItem) => goTo(item.href)

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && setSearch(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hledání"
        className="glass fade-up bg-ink-3/95 w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl shadow-black/60"
      >
        <div className="border-line focus-within:border-cyan flex items-center gap-3 border-b px-4 transition-colors">
          <Search size={18} className="text-subtle" aria-hidden />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setActive(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(results.length - 1, a + 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(0, a - 1))
              } else if (e.key === 'Enter' && results[active]) go(results[active])
              else if (e.key === 'Escape') setSearch(false)
            }}
            placeholder="Hledat průvodce, doplňky, orgány…"
            className="placeholder:text-subtle h-14 flex-1 bg-transparent text-[16px] outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${active}` : undefined}
          />
          <button
            type="button"
            onClick={() => setSearch(false)}
            aria-label="Zavřít hledání"
            className="text-subtle hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-subtle px-4 pt-3 font-mono text-[12px] tracking-wider uppercase">
          {q.trim()
            ? corrected
              ? `Výsledky pro „${corrected}“: ${results.length}`
              : `Výsledků: ${results.length}`
            : 'Doporučujeme'}
        </p>
        {/* the empty message lives outside the listbox (a listbox may only contain options) */}
        {results.length === 0 && q.trim() && (
          <p role="status" className="text-muted px-4 pt-5 pb-1 text-center">
            Pro „{q}“ jsme nic nenašli.
          </p>
        )}
        <ul id="search-results" ref={list} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.map((r, i) => {
            const Icon = ICON[r.kind]
            return (
              <li
                key={`${r.kind}-${r.id}`}
                id={`sr-${i}`}
                data-index={i}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={cx(
                  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5',
                  i === active && 'bg-white/[0.06]',
                )}
              >
                <span className="border-line text-cyan grid h-8 w-8 shrink-0 place-items-center rounded-lg border">
                  <Icon size={15} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px]">{r.title}</span>
                  <span className="text-subtle block truncate text-[13px]">{r.subtitle}</span>
                </span>
                <span className="text-subtle font-mono text-[12px]">{r.kind}</span>
                {i === active && <CornerDownLeft size={14} className="text-subtle" aria-hidden />}
              </li>
            )
          })}
        </ul>
        {results.length === 0 && q.trim() && (
          <div className="border-line border-t px-4 py-3 text-[14px]" data-testid="search-empty-help">
            <p className="text-subtle">Zkuste jiné slovo, nebo:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Spánek', 'Bílkoviny', 'Hořčík', 'Únava'].map((t) => (
                <button key={t} type="button" className="chip" onClick={() => setQ(t)}>
                  {t}
                </button>
              ))}
            </div>
            <ul className="mt-3 grid gap-1.5">
              <li>
                <button type="button" className="link" onClick={() => goTo('/potraviny#barcode')}>
                  Balený výrobek? Najděte ho podle čárového kódu
                </button>
              </li>
              <li>
                <button type="button" className="link" onClick={() => goTo('/potraviny')}>
                  Procházet všech {SEARCH_INDEX.filter((i) => i.kind === 'Potravina').length} potravin
                </button>
              </li>
              <li>
                <button type="button" className="link" onClick={() => goTo('/jak-funguje-telo')}>
                  Všichni průvodci „Jak funguje tělo“
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
