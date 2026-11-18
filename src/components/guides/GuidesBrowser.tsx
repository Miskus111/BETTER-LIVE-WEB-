'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'
import { BODY_GUIDES, GUIDE_CATEGORIES, GUIDE_CATEGORY, type GuideCategory } from '@/data/body-guides'
import { searchGuides } from '@/lib/guide-search'
import { cx } from '@/lib/format'
import { GuideIcon } from './GuideIcon'

const SUGGESTIONS = ['spánek', 'kofein', 'mobil', 'hubnutí', 'stres', 'záda']

/** Search box + category chips over the body guides; state lives in the URL (?q=…&k=…) so it can be shared. */
export function GuidesBrowser() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const initialK = params.get('k')
  const [cat, setCat] = useState<GuideCategory | 'all'>(
    GUIDE_CATEGORIES.some((c) => c.id === initialK) ? (initialK as GuideCategory) : 'all',
  )

  // keep the URL in sync without adding history entries on every keystroke — and only when the
  // filters actually changed, so a pending update can never pull the reader back after they click a link
  const current = params.toString()
  useEffect(() => {
    const sp = new URLSearchParams()
    if (q.trim()) sp.set('q', q.trim())
    if (cat !== 'all') sp.set('k', cat)
    if (sp.toString() === current) return
    const t = setTimeout(() => {
      if (window.location.pathname !== pathname) return
      router.replace(sp.toString() ? `${pathname}?${sp}` : pathname, { scroll: false })
    }, 250)
    return () => clearTimeout(t)
  }, [q, cat, pathname, router, current])

  const matches = useMemo(() => searchGuides(BODY_GUIDES, q), [q])
  const shown = matches.filter((g) => cat === 'all' || GUIDE_CATEGORY[g.slug] === cat)
  const count = (c: GuideCategory) => matches.filter((g) => GUIDE_CATEGORY[g.slug] === c).length

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4">
        <label className="relative block max-w-xl">
          <span className="sr-only">Hledat v průvodcích</span>
          <Search size={18} className="text-subtle absolute top-1/2 left-4 -translate-y-1/2" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hledat, např. kofein"
            className="field !rounded-full !py-3 !pr-11 !pl-11 text-[16px]"
            data-testid="guides-search"
            enterKeyHint="search"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="text-subtle hover:text-fg absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5"
              aria-label="Smazat hledání"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Kategorie">
          <Chip on={cat === 'all'} onClick={() => setCat('all')} label="Vše" n={matches.length} />
          {GUIDE_CATEGORIES.map((c) => (
            <Chip key={c.id} on={cat === c.id} onClick={() => setCat(c.id)} label={c.label} n={count(c.id)} />
          ))}
        </div>
      </div>

      <p
        className="text-subtle mt-5 text-[13.5px]"
        role="status"
        aria-live="polite"
        data-testid="guides-count"
      >
        {shown.length === BODY_GUIDES.length
          ? `${shown.length} průvodců`
          : `${shown.length} z ${BODY_GUIDES.length} průvodců`}
      </p>

      {shown.length ? (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="guides">
          {shown.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/jak-funguje-telo/${g.slug}`}
                className="card hover:border-cyan/40 group flex h-full flex-col p-5 transition"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="bg-cyan/10 text-cyan grid h-10 w-10 place-items-center rounded-xl">
                    <GuideIcon icon={g.icon} />
                  </span>
                  <span className="text-subtle font-mono text-[11px] uppercase">
                    {GUIDE_CATEGORIES.find((c) => c.id === GUIDE_CATEGORY[g.slug])?.label}
                  </span>
                </span>
                <span className="mt-4 text-[17px] leading-snug font-medium">{g.title}</span>
                <span className="text-muted mt-2 text-[14px]">{g.hook}</span>
                <span className="text-cyan mt-auto inline-flex items-center gap-1 pt-4 text-[13.5px]">
                  Číst <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-line mt-3 rounded-2xl border border-dashed p-6" data-testid="guides-empty">
          <p className="text-[15px]">
            Na „{q}“ jsme nic nenašli{cat !== 'all' ? ' v této kategorii' : ''}.
          </p>
          <p className="text-muted mt-2 text-[14px]">Zkuste třeba:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                onClick={() => {
                  setQ(s)
                  setCat('all')
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ on, onClick, label, n }: { on: boolean; onClick: () => void; label: string; n: number }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      disabled={!on && n === 0}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13.5px] transition disabled:opacity-40',
        on ? 'border-cyan bg-cyan/10 text-fg' : 'border-line text-muted hover:text-fg',
      )}
    >
      {label}
      <span className="text-subtle font-mono text-[11.5px]">{n}</span>
    </button>
  )
}
