'use client'

import { Minus, Plus } from 'lucide-react'
import { MAX_QTY } from '@/lib/store/cart'

export function QuantitySelector({
  value,
  onChange,
  label = 'Množství',
}: {
  value: number
  onChange: (n: number) => void
  label?: string
}) {
  return (
    <div
      className="border-line-strong inline-flex items-center rounded-full border"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Snížit množství"
        className="text-muted hover:text-fg grid h-10 w-10 place-items-center rounded-full disabled:opacity-30"
      >
        <Minus size={15} />
      </button>
      <output className="w-8 text-center font-mono text-[15px]" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_QTY, value + 1))}
        disabled={value >= MAX_QTY}
        aria-label="Zvýšit množství"
        className="text-muted hover:text-fg grid h-10 w-10 place-items-center rounded-full disabled:opacity-30"
      >
        <Plus size={15} />
      </button>
    </div>
  )
}
