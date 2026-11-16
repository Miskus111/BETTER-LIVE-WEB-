'use client'
import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/** true after hydration — use to gate UI that reads persisted (localStorage) state. */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}
