'use client'

import { useEffect } from 'react'

/** The root <html lang> is static Czech; app screens in English correct it (screen readers, hyphenation). */
export function HtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang
    document.documentElement.lang = locale
    return () => {
      document.documentElement.lang = prev
    }
  }, [locale])
  return null
}
