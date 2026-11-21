'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { pace, SPORT_TYPES, sportSessionSchema } from '@/lib/train/sport'

export function SportForm() {
  const t = useTranslations('train')
  const sp = useTranslations('sports')
  const router = useRouter()
  const [v, setV] = useState({
    sport: 'running',
    durationMin: '45',
    distanceKm: '',
    avgHr: '',
    rpe: '6',
    notes: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof v, val: string) => setV((s) => ({ ...s, [k]: val }))
  const p = pace(Number(v.durationMin) || 0, Number(v.distanceKm) || null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = sportSessionSchema.safeParse(v)
    if (!r.success) {
      setError(t('formInvalid'))
      return
    }
    setBusy(true)
    const db = createClient() as unknown as {
      from: (t: string) => { insert: (r: object) => PromiseLike<{ error: unknown }> }
    }
    const { error: err } = await db.from('sport_sessions').insert({
      client_id: crypto.randomUUID(),
      sport: r.data.sport,
      duration_min: r.data.durationMin,
      distance_km: r.data.distanceKm,
      avg_hr: r.data.avgHr,
      rpe: r.data.rpe,
      notes: r.data.notes || null,
    })
    setBusy(false)
    if (err) setError(t('syncError'))
    else router.replace('/train/history')
  }

  return (
    <form onSubmit={submit} className="card grid max-w-lg gap-4 p-5" noValidate>
      <label className="grid gap-1.5">
        <span className="text-muted text-[14px]">{t('sportType')}</span>
        <select className="field" value={v.sport} onChange={(e) => set('sport', e.target.value)}>
          {SPORT_TYPES.map((s) => (
            <option key={s} value={s}>
              {sp(s)}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5">
          <span className="text-muted text-[14px]">{t('duration')}</span>
          <input
            className="field"
            inputMode="numeric"
            value={v.durationMin}
            onChange={(e) => set('durationMin', e.target.value)}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-muted text-[14px]">{t('distance')}</span>
          <input
            className="field"
            inputMode="decimal"
            value={v.distanceKm}
            onChange={(e) => set('distanceKm', e.target.value.replace(',', '.'))}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-muted text-[14px]">{t('avgHr')}</span>
          <input
            className="field"
            inputMode="numeric"
            value={v.avgHr}
            onChange={(e) => set('avgHr', e.target.value)}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-muted text-[14px]">RPE (1–10)</span>
          <input
            className="field"
            type="range"
            min={1}
            max={10}
            value={v.rpe}
            onChange={(e) => set('rpe', e.target.value)}
          />
          <span className="font-mono text-[13px]">{v.rpe}</span>
        </label>
      </div>
      {p && (
        <p className="text-muted font-mono text-[13px]">
          {t('pace')}: {p} min/km
        </p>
      )}
      <textarea
        className="field"
        rows={2}
        placeholder={t('notes')}
        value={v.notes}
        onChange={(e) => set('notes', e.target.value)}
      />
      {error && (
        <p role="alert" className="text-[14px] text-[#ff9b9b]">
          {error}
        </p>
      )}
      <button className="btn btn-primary" disabled={busy}>
        {busy && <Loader2 size={16} className="animate-spin" aria-hidden />} {t('save')}
      </button>
    </form>
  )
}
