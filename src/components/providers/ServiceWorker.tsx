'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Registers the offline service worker (production only) and clears cached personal pages on /login. */
export function ServiceWorker() {
  const pathname = usePathname()
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])
  useEffect(() => {
    if (pathname === '/login' && 'serviceWorker' in navigator)
      navigator.serviceWorker.ready.then((r) => r.active?.postMessage('clear-user-cache')).catch(() => {})
  }, [pathname])
  return null
}
