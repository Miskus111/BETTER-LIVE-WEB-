/* eslint-disable @next/next/no-img-element -- local SVG placeholders; swap to next/image with real photos */
import { cx } from '@/lib/format'

/** Image with a subtle "placeholder" marker for generated SVG art. */
export function Thumb({
  src,
  alt,
  className,
  ratio = 'aspect-[10/9]',
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  ratio?: string
  /** the page's main image (above the fold): load at once with high priority instead of lazily */
  priority?: boolean
}) {
  return (
    <div className={cx('bg-ink-3 relative overflow-hidden', ratio, className)}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  )
}
