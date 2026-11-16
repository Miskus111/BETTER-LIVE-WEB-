'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { AlertTriangle, Check, Clock, Plus, ShieldAlert, Stethoscope, Trash2 } from 'lucide-react'
import { SUPPLEMENTS, SUPPLEMENT_BY_ID, type SupplementId } from '@/data/supplement-library'
import { checkStack, type SafetyIssue } from '@/lib/supplements/safety'
import { createClient } from '@/lib/supabase/client'
import { EVIDENCE } from '@/data/sources'
import { cx } from '@/lib/format'

export interface StackRow {
  id: string
  slug: SupplementId
  dose_amount: number | null
  timing: string | null
  reminder_time: string | null
  takenToday: boolean
}
type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

const ICON: Record<SafetyIssue['level'], typeof AlertTriangle> = {
  block: ShieldAlert,
  doctor: Stethoscope,
  warn: AlertTriangle,
  timing: Clock,
}

export function StackTracker({ rows, medications }: { rows: StackRow[]; medications: string | null }) {
  const t = useTranslations('supp')
  const ev = useTranslations('evidence')
  const locale = useLocale() as 'cs' | 'en'
  const router = useRouter()
  const [pending, start] = useTransition()
  const [adding, setAdding] = useState<SupplementId | null>(null)
  const [dose, setDose] = useState('')
  const [timing, setTiming] = useState('')
  const [reminder, setReminder] = useState('')
  const [error, setError] = useState<string | null>(null)

  const issues = checkStack(
    rows.map((r) => ({ id: r.slug, dailyAmount: Number(r.dose_amount ?? 0) })),
    { medications },
  )
  const draftIssue = adding
    ? checkStack([{ id: adding, dailyAmount: Number(dose.replace(',', '.')) || 0 }], { medications })
    : []
  const blocked = draftIssue.some((i) => i.level === 'block')

  const add = () =>
    start(async () => {
      if (!adding || blocked) return
      const db = createClient() as unknown as Db
      const { data: sup } = await db.from('supplements').select('id').eq('slug', adding).maybeSingle()
      if (!sup) {
        setError('Supplement library is not seeded yet (npm run seed:reference).')
        return
      }
      const s = SUPPLEMENT_BY_ID[adding]
      const { error: err } = await db.from('user_supplements').insert({
        supplement_id: sup.id,
        dose_amount: Number(dose.replace(',', '.')) || s.dose.min,
        dose_unit: s.dose.unit,
        timing: timing || s.timing[locale],
        reminder_time: reminder || null,
      })
      if (err) setError(err.message)
      else {
        setAdding(null)
        router.refresh()
      }
    })

  const toggleTaken = (r: StackRow) =>
    start(async () => {
      const db = createClient() as unknown as Db
      if (r.takenToday) {
        const since = new Date()
        since.setHours(0, 0, 0, 0)
        await db
          .from('supplement_logs')
          .delete()
          .eq('user_supplement_id', r.id)
          .gte('taken_at', since.toISOString())
      } else await db.from('supplement_logs').insert({ user_supplement_id: r.id })
      router.refresh()
    })

  const remove = (id: string) =>
    start(async () => {
      const db = createClient() as unknown as Db
      await db.from('user_supplements').update({ active: false }).eq('id', id)
      router.refresh()
    })

  return (
    <div className="space-y-10">
      <section>
        <h2 className="eyebrow mb-3">{t('stack')}</h2>
        {rows.length === 0 ? (
          <p className="text-muted">{t('empty')}</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => {
              const s = SUPPLEMENT_BY_ID[r.slug]
              return (
                <li key={r.id} className="card flex items-center gap-3 p-3.5">
                  <button
                    type="button"
                    aria-pressed={r.takenToday}
                    aria-label={t('taken')}
                    disabled={pending}
                    onClick={() => toggleTaken(r)}
                    className={cx(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-lg border',
                      r.takenToday ? 'border-bio bg-bio text-ink' : 'border-line text-subtle',
                    )}
                  >
                    <Check size={16} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium">{s?.name[locale] ?? r.slug}</p>
                    <p className="text-subtle text-[13px]">
                      {r.dose_amount} {s?.dose.unit} · {r.timing}
                      {r.reminder_time && ` · ${r.reminder_time.slice(0, 5)}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={t('remove')}
                    onClick={() => remove(r.id)}
                    className="text-subtle p-2 hover:text-[#ff9b9b]"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {rows.length > 0 && (
          <div className="mt-4">
            <h3 className="eyebrow !text-subtle mb-2">{t('issues')}</h3>
            {issues.length === 0 ? (
              <p className="text-muted text-[14px]">{t('noIssues')}</p>
            ) : (
              <ul className="space-y-1.5">
                {issues.map((i, k) => {
                  const Icon = ICON[i.level]
                  return (
                    <li
                      key={k}
                      className={cx(
                        'flex gap-2 text-[14px]',
                        i.level === 'block' || i.level === 'doctor' ? 'text-warn' : 'text-fg/90',
                      )}
                    >
                      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden />
                      <span>
                        <strong className="font-medium">
                          {SUPPLEMENT_BY_ID[i.supplement].name[locale]}:
                        </strong>{' '}
                        {i.detail[locale]}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="eyebrow">{t('library')}</h2>
          <Link href="/supplements/guide" className="link text-[14px]">
            {t('guide')} →
          </Link>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {SUPPLEMENTS.map((s) => (
            <li key={s.id} className="card flex flex-col p-4" data-testid={`supp-${s.id}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[16px] font-medium">{s.name[locale]}</p>
                <span
                  className="rounded-full border px-2 py-0.5 font-mono text-[12px]"
                  style={{
                    color: EVIDENCE[s.evidence].color,
                    borderColor: `${EVIDENCE[s.evidence].color}55`,
                  }}
                >
                  {ev(s.evidence)}
                </span>
              </div>
              <p className="text-muted mt-1.5 text-[14px]">{s.what[locale]}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                <div>
                  <dt className="text-subtle font-mono">{t('typical')}</dt>
                  <dd>
                    {s.dose.min}–{s.dose.max} {s.dose.unit}
                  </dd>
                </div>
                <div>
                  <dt className="text-subtle font-mono">{t('ul')}</dt>
                  <dd>
                    {s.ul ? `${s.ul.value} ${s.dose.unit}${s.ul.scope === 'supplements' ? '*' : ''}` : '—'}
                  </dd>
                </div>
              </dl>
              {s.dose.note && <p className="text-subtle mt-1 text-[12.5px]">{s.dose.note[locale]}</p>}
              {s.interactions.length > 0 && (
                <p className="text-subtle mt-2 text-[12.5px]">
                  <strong className="text-muted font-medium">{t('interactions')}:</strong>{' '}
                  {s.interactions.map((i) => i.text[locale]).join(' ')}
                </p>
              )}
              {s.avoidIf.length > 0 && (
                <p className="text-subtle mt-1 text-[12.5px]">
                  <strong className="text-muted font-medium">{t('avoid')}:</strong>{' '}
                  {s.avoidIf.map((a) => t(a)).join(', ')}
                </p>
              )}
              {adding === s.id ? (
                <div className="border-line mt-3 grid gap-2 rounded-xl border p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      aria-label={t('dose')}
                      placeholder={`${s.dose.min} ${s.dose.unit}`}
                      className="field !py-1.5"
                      inputMode="decimal"
                      value={dose}
                      onChange={(e) => setDose(e.target.value)}
                    />
                    <input
                      aria-label={t('timing')}
                      placeholder={t('timing')}
                      className="field !py-1.5"
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                    />
                    <input
                      aria-label={t('reminder')}
                      type="time"
                      className="field !py-1.5"
                      value={reminder}
                      onChange={(e) => setReminder(e.target.value)}
                    />
                  </div>
                  {draftIssue.map((i, k) => (
                    <p
                      key={k}
                      className={cx('text-[13px]', i.level === 'block' ? 'text-[#ff9b9b]' : 'text-warn')}
                    >
                      {i.detail[locale]}
                    </p>
                  ))}
                  {error && <p className="text-[13px] text-[#ff9b9b]">{error}</p>}
                  <button
                    type="button"
                    onClick={add}
                    disabled={pending || blocked}
                    className="btn btn-primary !py-1.5"
                    data-testid="add-to-stack"
                  >
                    {t('add')}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAdding(s.id)
                    setDose(String(s.dose.min))
                    setTiming('')
                    setError(null)
                  }}
                  className="link mt-auto inline-flex items-center gap-1 pt-3 text-[14px]"
                >
                  <Plus size={14} aria-hidden /> {t('add')}
                </button>
              )}
            </li>
          ))}
        </ul>
        <p className="text-subtle mt-3 text-[12.5px]">
          * EFSA: limit only for supplements, not food. Educational content, not medical advice.
        </p>
      </section>
    </div>
  )
}
