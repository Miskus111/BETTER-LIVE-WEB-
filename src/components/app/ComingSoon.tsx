import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Hammer } from 'lucide-react'

/** Placeholder for modules built in later phases — always offers a working path to related content. */
export async function ComingSoon({
  title,
  related,
}: {
  title: string
  related?: { href: string; label: string }[]
}) {
  const t = await getTranslations('common')
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="display text-[44px]">{title}</h1>
      <div className="card mt-6 flex gap-4 p-6">
        <Hammer size={22} className="text-cyan shrink-0" aria-hidden />
        <div>
          <p className="font-medium">{t('comingSoon')}</p>
          <p className="text-muted mt-1 text-[15px]">{t('comingSoonText')}</p>
          {related && (
            <div className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link key={r.href} href={r.href} className="btn btn-ghost !py-1.5 !text-[14px]">
                  {r.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
