import Link from 'next/link'
import { ORGAN_BY_ID } from '@/data/organs'
import type { OrganId } from '@/data/types'

/** Small coloured dots (with names on hover) linking to organ pages. */
export function OrganDots({
  ids,
  max = 4,
  linked = true,
}: {
  ids: OrganId[]
  max?: number
  linked?: boolean
}) {
  const shown = ids.slice(0, max)
  const rest = ids.length - shown.length
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Související orgány">
      {shown.map((id) => {
        const o = ORGAN_BY_ID[id]
        const inner = (
          <>
            <span className="h-2 w-2 rounded-full" style={{ background: o.accent }} aria-hidden />
            {o.shortName}
          </>
        )
        return (
          <li key={id}>
            {linked ? (
              <Link
                href={`/organ/${id}`}
                className="border-line text-muted hover:border-line-strong hover:text-fg inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[12px] transition"
              >
                {inner}
              </Link>
            ) : (
              <span className="border-line text-muted inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[12px]">
                {inner}
              </span>
            )}
          </li>
        )
      })}
      {rest > 0 && <li className="text-subtle font-mono text-[12px]">+{rest}</li>}
    </ul>
  )
}
