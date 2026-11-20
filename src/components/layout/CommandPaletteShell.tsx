'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useUi } from '@/lib/store/ui'

// the palette (and its search index of foods, guides, nutrients…) loads only when first opened
const CommandPalette = dynamic(() => import('./CommandPalette').then((m) => m.CommandPalette), {
  ssr: false,
})

/** Keyboard shortcuts (⌘K, /) for site search; the palette itself is code-split. */
export function CommandPaletteShell() {
  const { searchOpen: open, setSearch } = useUi()

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

  return open ? <CommandPalette /> : null
}
