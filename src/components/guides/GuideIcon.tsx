import {
  Activity,
  Bone,
  Candy,
  Cloud,
  Ear,
  Package,
  Scale,
  Brain,
  Droplet,
  Dumbbell,
  Eye,
  Footprints,
  GraduationCap,
  Heart,
  Moon,
  Shield,
  Sprout,
  Sun,
  Wine,
  Zap,
} from 'lucide-react'
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
  wine: Wine,
  shield: Shield,
  eye: Eye,
  sun: Sun,
  heart: Heart,
  graduation: GraduationCap,
  scale: Scale,
  candy: Candy,
  package: Package,
  cloud: Cloud,
  bone: Bone,
  ear: Ear,
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
