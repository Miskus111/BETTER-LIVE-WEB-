'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/** Password field with a show/hide button (fewer typos on phones). */
export function PasswordInput(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const t = useTranslations('auth')
  const [visible, setVisible] = useState(false)
  return (
    <span className="relative block">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`field w-full pr-12 ${props.className ?? ''}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('hidePassword') : t('showPassword')}
        aria-pressed={visible}
        className="text-muted hover:text-fg absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl"
      >
        {visible ? <EyeOff size={17} aria-hidden /> : <Eye size={17} aria-hidden />}
      </button>
    </span>
  )
}
