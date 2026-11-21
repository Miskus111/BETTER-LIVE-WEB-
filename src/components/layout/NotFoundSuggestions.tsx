'use client'

import Link from '@/components/ui/Link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { SearchItem } from '@/lib/search'

/**
 * "Možná hledáte": suggestions from the words in the missing URL (/food/losos-uzeny → Losos uzený).
 * Tiny on purpose — the root not-found ships with every page — and the search index is imported only
 * when a 404 is actually shown.
 */
export function NotFoundSuggestions() {
  const pathname = usePathname()
  const [items, setItems] = useState<SearchItem[]>([])

  useEffect(() => {
    const words = decodeURIComponent(pathname.split('/').filter(Boolean).pop() ?? '')
      .replace(/[-_]+/g, ' ')
      .trim()
    if (words.length < 3) return
    let alive = true
    import('@/lib/search').then(({ search }) => {
      // all words first; if nothing matches, the longest single word
      const longest = words.split(' ').sort((a, b) => b.length - a.length)[0]
      const hits = search(words, 4)
      if (alive) setItems(hits.length ? hits : search(longest, 4))
    })
    return () => {
      alive = false
    }
  }, [pathname])

  if (!items.length) return null
  return (
    <nav aria-label="Možná hledáte" className="mt-10 w-full text-left" data-testid="not-found-suggestions">
      <p className="eyebrow mb-3 text-center">Možná hledáte</p>
      <ul className="grid gap-2">
        {items.map((r) => (
          <li key={`${r.kind}-${r.id}`}>
            <Link
              href={r.href}
              className="card hover:border-cyan/40 flex items-baseline justify-between gap-3 p-4"
            >
              <span className="font-medium">{r.title}</span>
              <span className="text-subtle font-mono text-[12px]">{r.kind}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
