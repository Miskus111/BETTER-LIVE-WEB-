import { FlaskConical } from 'lucide-react'
import { cx } from '@/lib/format'

/** Subtle marker shown wherever sample products, prices or control-body codes appear. */
export function SampleDataLabel({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        'border-warn/25 bg-warn/[0.06] text-warn/90 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[12px] tracking-wide',
        className,
      )}
      title="Products, prices, producers and control-body codes are placeholders for this prototype."
    >
      <FlaskConical size={12} aria-hidden />
      Prototype · sample data
    </span>
  )
}
