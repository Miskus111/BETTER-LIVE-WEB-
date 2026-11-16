import { CheckCircle2, CircleHelp, Lightbulb } from 'lucide-react'
import { ABSORPTION, type FormRating } from '@/data/absorption'
import type { NutrientId } from '@/data/types'
import { cx } from '@/lib/format'

const RATING: Record<FormRating, { label: string; cls: string }> = {
  nejlepší: { label: 'Nejlepší volba', cls: 'border-bio/40 bg-bio/10 text-bio' },
  dobrá: { label: 'Dobrá', cls: 'border-cyan/35 bg-cyan/10 text-cyan' },
  slabší: { label: 'Slabší', cls: 'border-warn/35 bg-warn/10 text-warn' },
}

export function RatingBadge({ rating }: { rating: FormRating }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-mono text-[12px]',
        RATING[rating].cls,
      )}
    >
      {RATING[rating].label}
    </span>
  )
}

/** Formy živiny seřazené podle vstřebatelnosti + praktické tipy. */
export function AbsorptionCard({ id, compact }: { id: NutrientId; compact?: boolean }) {
  const a = ABSORPTION[id]
  if (!a) return null
  return (
    <div className="grid gap-5">
      <p className="text-fg/90 flex gap-2 text-[14.5px]">
        <CircleHelp size={17} className="text-cyan mt-0.5 shrink-0" aria-hidden />
        <span>
          <strong className="font-medium">Kdy má doplněk smysl: </strong>
          {a.when}
        </span>
      </p>
      <div>
        <p className="eyebrow mb-2.5">Formy podle vstřebatelnosti</p>
        <ul className="divide-line border-line divide-y rounded-xl border">
          {(compact ? a.forms.slice(0, 2) : a.forms).map((f) => (
            <li key={f.name} className="flex flex-col gap-1.5 p-3.5 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex items-center gap-2 sm:w-[42%] sm:shrink-0">
                <RatingBadge rating={f.rating} />
                <span className="text-[14.5px] font-medium">{f.name}</span>
              </div>
              <p className="text-muted text-[14px]">{f.note}</p>
            </li>
          ))}
        </ul>
      </div>
      {!compact && (
        <div>
          <p className="eyebrow mb-2.5 flex items-center gap-1.5">
            <Lightbulb size={13} aria-hidden /> Jak užívat
          </p>
          <ul className="space-y-1.5">
            {a.tips.map((t) => (
              <li key={t} className="flex gap-2 text-[14.5px]">
                <CheckCircle2 size={16} className="text-bio mt-0.5 shrink-0" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <ul className="mt-3 space-y-1">
            {a.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer noopener" className="link text-[12.5px]">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
