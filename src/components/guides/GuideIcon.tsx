import { Activity, Brain, Droplet, Dumbbell, Footprints, Moon, Sprout, Zap } from 'lucide-react'
import type { BodyGuide } from '@/data/body-guides'

const ICONS = {
  moon: Moon,
  zap: Zap,
  activity: Activity,
  brain: Brain,
  dumbbell: Dumbbell,
  footprints: Footprints,
  sprout: Sprout,
  droplet: Droplet,
} as const

export function GuideIcon({
  icon,
  size = 20,
  className,
}: {
  icon: BodyGuide['icon']
  size?: number
  className?: string
}) {
  const I = ICONS[icon]
  return <I size={size} className={className} aria-hidden />
}
