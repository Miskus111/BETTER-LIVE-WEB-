'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LogOut } from 'lucide-react'
import { SECONDARY, TABS, type NavItem } from '@/lib/app-nav'
import { cx } from '@/lib/format'
import { Logo } from '@/components/layout/Logo'
import { signOut } from '@/app/(auth)/actions'
import { LanguageSwitch } from './LanguageSwitch'

const active = (path: string, href: string) => path === href || path.startsWith(`${href}/`)

function SideLink({ item, path }: { item: NavItem; path: string }) {
  const t = useTranslations('nav')
  const on = active(path, item.href)
  return (
    <Link
      href={item.href}
      aria-current={on ? 'page' : undefined}
      className={cx(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition',
        on ? 'bg-cyan/10 text-fg' : 'text-muted hover:text-fg hover:bg-white/[0.04]',
      )}
    >
      <item.icon size={18} className={on ? 'text-cyan' : undefined} aria-hidden />
      {t(item.key)}
    </Link>
  )
}

/** Desktop: left sidebar. */
export function Sidebar() {
  const path = usePathname()
  const t = useTranslations('common')
  return (
    <aside className="border-line bg-ink-2/60 sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r px-4 py-5 lg:flex">
      <Link href="/today" className="px-2" aria-label="Better Live with Biohacking">
        <Logo />
      </Link>
      <nav className="mt-8 flex flex-col gap-1" aria-label="App">
        {TABS.map((i) => (
          <SideLink key={i.href} item={i} path={path} />
        ))}
        <div className="border-line my-3 border-t" />
        {SECONDARY.map((i) => (
          <SideLink key={i.href} item={i} path={path} />
        ))}
      </nav>
      <div className="mt-auto flex items-center justify-between gap-2 px-2">
        <LanguageSwitch />
        <form action={signOut}>
          <button type="submit" className="text-muted hover:text-fg flex items-center gap-1.5 text-[13.5px]">
            <LogOut size={15} aria-hidden /> {t('signOut')}
          </button>
        </form>
      </div>
    </aside>
  )
}

/** Mobile: top bar + bottom tab bar. */
export function MobileNav() {
  const path = usePathname()
  const t = useTranslations('nav')
  return (
    <>
      <header className="border-line bg-ink/85 sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 backdrop-blur-xl lg:hidden">
        <Link href="/today" aria-label="Better Live with Biohacking">
          <Logo size={24} />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <Link
            href="/settings"
            className="text-muted hover:text-fg rounded-full p-2"
            aria-label={t('settings')}
          >
            <SettingsIcon />
          </Link>
        </div>
      </header>
      <nav
        aria-label="App"
        className="border-line bg-ink/90 fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        {TABS.map((i) => {
          const on = active(path, i.href)
          return (
            <Link
              key={i.href}
              href={i.href}
              aria-current={on ? 'page' : undefined}
              className={cx(
                'flex flex-col items-center gap-1 py-2.5 text-[12px]',
                on ? 'text-cyan' : 'text-muted',
              )}
            >
              <i.icon size={21} aria-hidden />
              {t(i.key)}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

function SettingsIcon() {
  const Item = SECONDARY.find((i) => i.key === 'settings')!.icon
  return <Item size={19} aria-hidden />
}
