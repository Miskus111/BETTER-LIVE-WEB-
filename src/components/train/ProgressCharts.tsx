'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { niceAxis, type ExercisePoint, type WeekPoint } from '@/lib/train/progress'

// one series per chart → the app's accent; text stays in text tokens
const SERIES = '#5ee7ff'
const AXIS = '#7f8e9c'
const GRID = 'rgba(255,255,255,0.06)'

export interface ExerciseSeries {
  slug: string
  name: string
  points: ExercisePoint[]
}

export function ProgressCharts({ weeks, exercises }: { weeks: WeekPoint[]; exercises: ExerciseSeries[] }) {
  const t = useTranslations('progress')
  const locale = useLocale()
  const nf = useMemo(() => new Intl.NumberFormat(locale === 'en' ? 'en' : 'cs-CZ'), [locale])
  const df = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric' }) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale === 'en' ? 'en-GB' : 'cs-CZ', opts)

  const [slug, setSlug] = useState(exercises[0]?.slug ?? '')
  const series = exercises.find((e) => e.slug === slug) ?? exercises[0]

  const hasVolume = weeks.some((w) => w.volume > 0)
  const yAxis = niceAxis(series?.points.map((p) => p.e1rm) ?? [])

  return (
    <div className="space-y-10">
      <section aria-labelledby="vol-title">
        <h2 id="vol-title" className="text-[17px] font-medium">
          {t('volumeTitle')}
        </h2>
        <p className="text-subtle mt-1 text-[13.5px]">{t('volumeHint')}</p>
        {hasVolume ? (
          <>
            <div className="mt-4 h-56 md:h-64" data-testid="volume-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeks} margin={{ left: -6, right: 4, top: 8 }} barCategoryGap="22%">
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis
                    dataKey="week"
                    tickFormatter={(w) => df(w)}
                    stroke={AXIS}
                    fontSize={11.5}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={18}
                  />
                  <YAxis
                    stroke={AXIS}
                    fontSize={11.5}
                    tickLine={false}
                    axisLine={false}
                    width={52}
                    tickFormatter={(v) => (v >= 1000 ? `${nf.format(Math.round(v / 100) / 10)} t` : `${v}`)}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    content={({ active, payload }) => {
                      const p = active && (payload?.[0]?.payload as WeekPoint | undefined)
                      if (!p) return null
                      return (
                        <Tip>
                          <p className="text-subtle">{t('weekOf', { date: df(p.week) })}</p>
                          <p className="mt-0.5 font-mono text-[14px]">{nf.format(p.volume)} kg</p>
                          <p className="text-muted">
                            {t('workoutsN', { n: p.workouts })} · {t('setsN', { n: p.sets })}
                          </p>
                        </Tip>
                      )
                    }}
                  />
                  <Bar dataKey="volume" fill={SERIES} radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <DataTable
              caption={t('volumeTitle')}
              head={[t('week'), t('volume'), t('workouts')]}
              rows={weeks.map((w) => [df(w.week), `${nf.format(w.volume)} kg`, String(w.workouts)])}
              label={t('showTable')}
            />
          </>
        ) : (
          <Empty text={t('emptyVolume')} />
        )}
      </section>

      <section aria-labelledby="ex-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="ex-title" className="text-[17px] font-medium">
              {t('strengthTitle')}
            </h2>
            <p className="text-subtle mt-1 text-[13.5px]">{t('strengthHint')}</p>
          </div>
          {exercises.length > 0 && (
            <label className="w-full sm:w-auto">
              <span className="sr-only">{t('pickExercise')}</span>
              <select
                className="field !py-2 sm:min-w-[240px]"
                value={series?.slug}
                onChange={(e) => setSlug(e.target.value)}
                data-testid="exercise-select"
              >
                {exercises.map((e) => (
                  <option key={e.slug} value={e.slug}>
                    {e.name} ({e.points.length})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {series && series.points.length > 0 ? (
          <>
            <ExerciseSummary points={series.points} nf={nf} />
            <div className="mt-4 h-56 md:h-64" data-testid="strength-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series.points} margin={{ left: -6, right: 10, top: 8 }}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => df(d)}
                    stroke={AXIS}
                    fontSize={11.5}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={18}
                  />
                  <YAxis
                    stroke={AXIS}
                    fontSize={11.5}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    domain={[yAxis.lo, yAxis.hi]}
                    ticks={yAxis.ticks}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1 }}
                    content={({ active, payload }) => {
                      const p = active && (payload?.[0]?.payload as ExercisePoint | undefined)
                      if (!p) return null
                      return (
                        <Tip>
                          <p className="text-subtle">{df(p.date, { day: 'numeric', month: 'long' })}</p>
                          <p className="mt-0.5 font-mono text-[14px]">
                            {t('e1rmShort')} {nf.format(p.e1rm)} kg
                          </p>
                          <p className="text-muted">
                            {t('bestSet')}: {nf.format(p.weightKg)} kg × {p.reps}
                          </p>
                        </Tip>
                      )
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="e1rm"
                    stroke={SERIES}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2, stroke: '#0b0f14', fill: SERIES }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#0b0f14', fill: SERIES }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <DataTable
              caption={series.name}
              head={[t('date'), t('e1rmShort'), t('bestSet')]}
              rows={series.points.map((p) => [
                df(p.date),
                `${nf.format(p.e1rm)} kg`,
                `${nf.format(p.weightKg)} kg × ${p.reps}`,
              ])}
              label={t('showTable')}
            />
          </>
        ) : (
          <Empty text={t('emptyStrength')} />
        )}
      </section>
    </div>
  )
}

function ExerciseSummary({ points, nf }: { points: ExercisePoint[]; nf: Intl.NumberFormat }) {
  const t = useTranslations('progress')
  const first = points[0]
  const last = points[points.length - 1]
  const best = points.reduce((a, b) => (b.e1rm > a.e1rm ? b : a))
  const diff = points.length > 1 ? Math.round(((last.e1rm - first.e1rm) / first.e1rm) * 100) : null
  return (
    <dl className="mt-4 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-3">
      <Stat label={t('current')} value={`${nf.format(last.e1rm)} kg`} />
      <Stat label={t('best')} value={`${nf.format(best.e1rm)} kg`} />
      <Stat
        label={t('change')}
        value={diff === null ? '—' : `${diff > 0 ? '+' : ''}${diff} %`}
        tone={diff === null ? undefined : diff >= 0 ? 'up' : 'down'}
      />
    </dl>
  )
}

export function Stat({ label, value, tone }: { label: string; value: string; tone?: 'up' | 'down' }) {
  return (
    <div className="card p-3 sm:p-4">
      <dt className="text-subtle text-[12.5px]">{label}</dt>
      <dd className="mt-0.5 font-mono text-[17px]">
        {tone && (
          <span aria-hidden className={tone === 'up' ? 'text-bio mr-1' : 'text-warn mr-1'}>
            {tone === 'up' ? '▲' : '▼'}
          </span>
        )}
        {value}
      </dd>
    </div>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-line-strong bg-ink-3 rounded-xl border px-3 py-2 text-[12.5px] shadow-lg">
      {children}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <p className="text-muted border-line mt-4 rounded-2xl border border-dashed p-6 text-[14.5px]">{text}</p>
  )
}

/** The same numbers as a table, for screen readers and anyone who prefers rows to bars. */
function DataTable({
  caption,
  head,
  rows,
  label,
}: {
  caption: string
  head: string[]
  rows: string[][]
  label: string
}) {
  return (
    <details className="mt-2">
      <summary className="text-subtle hover:text-fg cursor-pointer text-[13px]">{label}</summary>
      <div className="border-line mt-2 overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-[13.5px]">
          <caption className="sr-only">{caption}</caption>
          <thead className="text-subtle bg-white/[0.03] font-mono text-[12px]">
            <tr>
              {head.map((h) => (
                <th key={h} className="px-3 py-2 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-line divide-y font-mono">
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-1.5">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
