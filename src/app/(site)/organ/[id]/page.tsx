import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { ORGAN_BY_ID, ORGANS } from '@/data/organs'
import type { OrganId } from '@/data/types'
import { AnatomyExplorer } from '@/components/anatomy/AnatomyExplorer'
import { RelatedGuides } from '@/components/guides/RelatedGuides'

type Params = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return ORGANS.map((o) => ({ id: o.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const o = ORGAN_BY_ID[id as OrganId]
  if (!o) return {}
  const title = `${o.shortName} — funkce a výživa`
  return {
    title,
    description: `${o.what} ${o.why}`.slice(0, 158),
    alternates: { canonical: `/organ/${o.id}` },
    openGraph: { title, description: o.what, url: `/organ/${o.id}` },
  }
}

export default async function OrganPage({ params }: Params) {
  const { id } = await params
  const organ = ORGAN_BY_ID[id as OrganId]
  if (!organ) notFound()
  return (
    <>
      <nav aria-label="Drobečková navigace" className="mx-auto max-w-[1440px] px-4 pt-4 md:px-8">
        <ol className="text-subtle flex items-center gap-1 font-mono text-[12px]">
          <li>
            <Link href="/" className="hover:text-fg">
              Domů
            </Link>
          </li>
          <ChevronRight size={12} aria-hidden />
          <li>
            <Link href="/#body" className="hover:text-fg">
              Tělo
            </Link>
          </li>
          <ChevronRight size={12} aria-hidden />
          <li aria-current="page" className="text-muted">
            {organ.shortName}
          </li>
        </ol>
      </nav>
      <AnatomyExplorer key={organ.id} initial={organ.id} urlMode="path" mobilePanel="inline" />
      <RelatedGuides href={`/organ/${organ.id}`} className="mx-auto max-w-[1440px] px-4 pt-10 pb-4 md:px-8" />
    </>
  )
}
