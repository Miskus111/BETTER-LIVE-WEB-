import { cx } from '@/lib/format'

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  aside,
  className,
}: {
  id: string
  eyebrow: string
  title: React.ReactNode
  intro?: React.ReactNode
  children: React.ReactNode
  aside?: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cx('scroll-mt-16 pt-20 md:pt-28', className)}>
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <header className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={`${id}-title`} className="display mt-3 text-[38px] md:text-[54px]">
              {title}
            </h2>
            {intro && <p className="text-muted mt-4 max-w-2xl text-[15.5px]">{intro}</p>}
          </div>
          {aside}
        </header>
        {children}
      </div>
    </section>
  )
}
