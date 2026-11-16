import { Truck } from 'lucide-react'
import { FREE_SHIPPING_FROM } from '@/lib/commerce/pricing'
import { eur } from '@/lib/format'

export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const left = Math.max(0, FREE_SHIPPING_FROM - subtotal)
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)
  return (
    <div>
      <p className="flex items-center gap-2 text-[14px]">
        <Truck size={15} className="text-cyan" aria-hidden />
        {left > 0 ? (
          <span>
            Add <strong className="text-cyan font-medium">{eur(left)}</strong> for free shipping
          </span>
        ) : (
          <span className="text-cyan">Free shipping unlocked</span>
        )}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_FROM}
        aria-valuenow={Math.min(subtotal, FREE_SHIPPING_FROM)}
        aria-label="Progress to free shipping"
      >
        <div
          className="from-cyan-2 to-cyan h-full rounded-full bg-gradient-to-r transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
