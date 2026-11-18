'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Menu, Search, X } from 'lucide-react'
import { useUi } from '@/lib/store/ui'
import { cx } from '@/lib/format'
import { Logo } from './Logo'

const LINKS = [
  { href: '/#body', label: 'Tělo' },
  { href: '/jak-funguje-telo', label: 'Jak funguje tělo' },
  { href: '/#nutrients', label: 'Živiny' },
  { href: '/#foods', label: 'Potraviny' },
  { href: '/doplnky', label: 'Doplňky' },
  { href: '/looksmaxing', label: 'Looksmaxing' },
  { href: '/pricing', label: 'Ceník' },
]

export function Nav() {
  const pathname = usePathname()
  const setSearch = useUi((s) => s.setSearch)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  // close the mobile menu when the route changes
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }

  const isActive = (href: string) => !href.startsWith('/#') && pathname.startsWith(href)

  return (
    <header
      className={cx(
        'sticky top-0 z-40 transition-colors duration-300',
        scrolled || open ? 'border-line bg-ink/80 border-b backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:px-8"
        aria-label="Hlavní navigace"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="BLWB — Better Live with Biohacking, domů"
        >
          <Logo />
        </Link>

        <ul className="ml-2 hidden items-center gap-0.5 lg:flex xl:ml-6 xl:gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={cx(
                  'rounded-full px-2 py-1.5 text-[14px] whitespace-nowrap transition-colors xl:px-3 xl:text-[14.5px]',
                  isActive(l.href) ? 'text-fg' : 'text-muted hover:text-fg',
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearch(true)}
            className="border-line text-muted hover:border-line-strong hover:text-fg flex h-10 items-center gap-2 rounded-full border px-3 text-[14px] transition"
            aria-label="Hledat průvodce, doplňky, orgány a potraviny"
          >
            <Search size={16} />
            <span className="hidden sm:inline">Hledat</span>
            <kbd className="border-line text-subtle hidden rounded border px-1.5 font-mono text-[12px] sm:inline">
              ⌘K
            </kbd>
          </button>
          <Link href="/today" className="btn btn-primary !h-10 !px-4 !py-0 text-[14px]" data-testid="nav-app">
            <LayoutDashboard size={16} aria-hidden />
            <span className="hidden sm:inline">Moje aplikace</span>
            <span className="sm:hidden">Aplikace</span>
          </Link>
          <button
            type="button"
            className="border-line grid h-10 w-10 place-items-center rounded-full border lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-line border-t px-4 pb-5 lg:hidden">
          <ul className="flex flex-col py-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-line text-fg block border-b py-3.5 text-[17px]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
