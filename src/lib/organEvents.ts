'use client'
import type { OrganId } from '@/data/types'

/** Ask the homepage anatomy explorer to select an organ and scroll it into view. */
export const ORGAN_EVENT = 'flx:select-organ'

export function focusOrgan(id: OrganId) {
  window.dispatchEvent(new CustomEvent<OrganId>(ORGAN_EVENT, { detail: id }))
  document.getElementById('body')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
