'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Apple, Atom, CornerDownLeft, HeartPulse, Package, Search, X } from 'lucide-react'
import { search, SEARCH_INDEX, type SearchItem, type SearchKind } from '@/lib/search'
import { useUi } from '@/lib/store/ui'
import { cx } from '@/lib/format'

const ICON: Record<SearchKind, typeof Apple> = {
  Organ: HeartPulse,
  Nutrient: Atom,
  Food: Apple,
  Product: Package,
}
const SUGGESTED = ['brain', 'intestines', 'omega3', 'choline', 'kefir', 'eggs'] as const

export function CommandPalette() {
  const router = useRouter()
  const { searchOpen: open, setSearch } = useUi()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch(!useUi.getState().searchOpen)
      } else if (
        e.key === '/' &&
        !(e.target as HTMLElement)?.closest('input,textarea,select,[contenteditable]')
      ) {
        e.preventDefault()
        setSearch(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearch])

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      requestAnimationFrame(() => input.current?.focus())
      document.body.style.overflow = 'hidden'
    } else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const results: SearchItem[] = useMemo(
    () =>
      q.trim()
        ? search(q)
        : SUGGESTED.map((id) => SEARCH_INDEX.find((i) => i.id === id)).filter((x): x is SearchItem => !!x),
    [q],
  )

  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const go = (item: SearchItem) => {
    setSearch(false)
    router.push(item.href)
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && setSearch(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="glass fade-up bg-ink-3/95 w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl shadow-black/60"
      >
        <div className="border-line flex items-center gap-3 border-b px-4">
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
            placeholder="Search organs, nutrients, foods, products…"
            className="placeholder:text-subtle h-14 flex-1 bg-transparent text-[16px] outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${active}` : undefined}
          />
          <button
            type="button"
            onClick={() => setSearch(false)}
            aria-label="Close search"
            className="text-subtle hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-subtle px-4 pt-3 font-mono text-[12px] tracking-wider uppercase">
          {q.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Suggested'}
        </p>
        <ul id="search-results" ref={list} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="text-muted px-3 py-6 text-center">No matches for “{q}”.</li>
          )}
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
      </div>
    </div>
  )
}
