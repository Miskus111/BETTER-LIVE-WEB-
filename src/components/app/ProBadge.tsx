import { cx } from '@/lib/format'

/** Small "PRO" marker next to features that will be part of the paid plan. */
export function ProBadge({ className, title }: { className?: string; title?: string }) {
  return (
    <span
      title={title}
      className={cx(
        'border-cyan/40 text-cyan inline-flex items-center rounded-full border px-1.5 py-px font-mono text-[10px] leading-4 tracking-wider',
        className,
      )}
    >
      PRO
    </span>
  )
}
