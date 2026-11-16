'use client'

import Link from 'next/link'
import { CheckCircle2, X } from 'lucide-react'
import { useToasts } from '@/lib/store/toast'

export function Toaster() {
  const { toasts, dismiss } = useToasts()
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="glass fade-up bg-ink-3/90 pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4 shadow-2xl shadow-black/50"
        >
          <CheckCircle2 size={18} className="text-cyan mt-0.5 shrink-0" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-[14.5px] font-medium">{t.title}</p>
            {t.body && <p className="text-muted truncate text-[13px]">{t.body}</p>}
            {t.action && (
              <Link
                href={t.action.href}
                onClick={() => dismiss(t.id)}
                className="link mt-1 inline-block text-[13px]"
              >
                {t.action.label} →
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
            className="text-subtle hover:text-fg"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
