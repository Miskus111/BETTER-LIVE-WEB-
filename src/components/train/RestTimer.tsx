'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, Timer } from 'lucide-react'
import { useSession } from '@/lib/train/session-store'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/** Floating rest countdown; vibrates and shows a notification when it ends (if permitted). */
export function RestTimer() {
  const t = useTranslations('train')
  const { restEndsAt, stopRest, startRest } = useSession()
  const [now, setNow] = useState(() => Date.now())
  const fired = useRef<number | null>(null)

  useEffect(() => {
    if (!restEndsAt) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [restEndsAt])

  const left = restEndsAt ? Math.max(0, Math.ceil((restEndsAt - now) / 1000)) : 0

  useEffect(() => {
    if (!restEndsAt || left > 0 || fired.current === restEndsAt) return
    fired.current = restEndsAt
    navigator.vibrate?.([200, 100, 200])
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(t('restDone'))
      } catch {
        /* some mobile browsers only allow notifications from a service worker */
      }
    }
    const id = setTimeout(stopRest, 4000)
    return () => clearTimeout(id)
  }, [left, restEndsAt, stopRest, t])

  if (!restEndsAt) return null
  return (
    <div
      role="timer"
      aria-live="polite"
      className="border-cyan/40 bg-ink-3/95 fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl border p-3 shadow-2xl backdrop-blur lg:bottom-6"
    >
      <Timer size={20} className="text-cyan shrink-0" aria-hidden />
      <span className="font-mono text-[22px] tabular-nums">{left > 0 ? fmt(left) : t('restDone')}</span>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          aria-label="-15 s"
          onClick={() => startRest(Math.max(0, left - 15))}
          className="border-line rounded-full border p-2"
        >
          <Minus size={15} />
        </button>
        <button
          type="button"
          aria-label="+15 s"
          onClick={() => startRest(left + 15)}
          className="border-line rounded-full border p-2"
        >
          <Plus size={15} />
        </button>
        <button type="button" onClick={stopRest} className="btn btn-ghost !px-3 !py-1.5 !text-[13.5px]">
          {t('restSkip')}
        </button>
      </div>
    </div>
  )
}
