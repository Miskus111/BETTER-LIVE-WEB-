'use client'

import { Plus } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { cx } from '@/lib/format'

export function AddToCartButton({
  id,
  qty = 1,
  label = 'Do košíku',
  compact,
  className,
}: {
  id: string
  qty?: number
  label?: string
  compact?: boolean
  className?: string
}) {
  const add = useCart((s) => s.add)
  return (
    <button
      type="button"
      onClick={() => add(id, qty)}
      data-testid={`add-${id}`}
      className={cx('btn btn-primary', compact && '!px-3 !py-1.5 !text-[13.5px]', className)}
    >
      <Plus size={compact ? 14 : 16} aria-hidden />
      {label}
    </button>
  )
}
