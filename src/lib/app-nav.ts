import {
  Activity,
  Apple,
  Bot,
  Dumbbell,
  FlaskConical,
  Pill,
  Settings,
  Sparkles,
  Store,
  Sun,
  PersonStanding,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  href: string
  key:
    | 'today'
    | 'train'
    | 'eat'
    | 'body'
    | 'coach'
    | 'labs'
    | 'mobility'
    | 'looks'
    | 'supplements'
    | 'store'
    | 'settings'
  icon: LucideIcon
}

/** Mobile bottom tab bar (5 items). */
export const TABS: NavItem[] = [
  { href: '/today', key: 'today', icon: Sun },
  { href: '/train', key: 'train', icon: Dumbbell },
  { href: '/eat', key: 'eat', icon: Apple },
  { href: '/body', key: 'body', icon: PersonStanding },
  { href: '/coach', key: 'coach', icon: Bot },
]

/** Desktop sidebar: tabs + secondary modules. */
export const SECONDARY: NavItem[] = [
  { href: '/labs', key: 'labs', icon: FlaskConical },
  { href: '/mobility', key: 'mobility', icon: Activity },
  { href: '/looks', key: 'looks', icon: Sparkles },
  { href: '/supplements', key: 'supplements', icon: Pill },
  { href: '/store', key: 'store', icon: Store },
  { href: '/settings', key: 'settings', icon: Settings },
]
