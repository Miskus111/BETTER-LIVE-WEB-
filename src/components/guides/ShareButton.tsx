'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

/** Native share sheet on phones, copy-link fallback elsewhere. Shares the current page URL. */
export function ShareButton({
  title,
  text,
  label = 'Sdílet',
  className = 'btn btn-ghost',
}: {
  title: string
  text?: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href.split('?')[0]
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (e) {
        // user closed the sheet: nothing to do
        if ((e as Error).name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(text ? `${text} ${url}` : url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked: leave the button as is
    }
  }

  return (
    <button type="button" onClick={share} className={className} data-testid="share">
      {copied ? <Check size={15} aria-hidden /> : <Share2 size={15} aria-hidden />}
      <span aria-live="polite">{copied ? 'Odkaz zkopírován' : label}</span>
    </button>
  )
}
