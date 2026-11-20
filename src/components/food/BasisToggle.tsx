'use client'

import type { Basis } from '@/lib/nutrition'
import { cx } from '@/lib/format'

/** "per 100 g" / "per portion" switch for food rankings. */
export function BasisToggle({
  value,
  onChange,
  className,
}: {
  value: Basis
  onChange: (b: Basis) => void
  className?: string
}) {
  return (
    <div role="group" aria-label="Pořadí podle" className={cx('flex gap-1.5', className)}>
      {(
        [
          ['100g', 'na 100 g'],
          ['portion', 'na porci'],
        ] as const
      ).map(([b, label]) => (
        <button
          key={b}
          type="button"
          aria-pressed={value === b}
          onClick={() => onChange(b)}
          className="chip !py-1 text-[12.5px]"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
