import Link from 'next/link'
import { ArrowRight, Bone, Brain, Dumbbell, HeartPulse, Microscope, ScanFace, Sprout } from 'lucide-react'
import { PRODUCTS, SHOP_CATEGORIES } from '@/data/products'
import type { ShopCategory } from '@/data/types'

const ICONS: Record<ShopCategory, typeof Bone> = {
  'Zdraví střev': Microscope,
  'Výživa mozku': Brain,
  'Zdraví srdce': HeartPulse,
  'Zdraví kostí': Bone,
  'Výživa svalů': Dumbbell,
  'Výživa pokožky': ScanFace,
  'Obecná výživa': Sprout,
}

export function StorePreview() {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
      {SHOP_CATEGORIES.map((c) => {
        const Icon = ICONS[c]
        const n = PRODUCTS.filter((p) => p.categories.includes(c)).length
        return (
          <li key={c}>
            <Link
              href={`/shop?category=${encodeURIComponent(c)}`}
              className="card group hover:border-cyan/40 hover:bg-cyan/[0.03] flex h-full flex-col gap-6 p-4 transition"
            >
              <Icon size={22} className="text-cyan" aria-hidden />
              <span>
                <span className="block text-[15px] font-medium">{c}</span>
                <span className="text-subtle mt-0.5 flex items-center justify-between font-mono text-[12px]">
                  {n} produktů{' '}
                  <ArrowRight
                    size={13}
                    className="group-hover:text-cyan transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
