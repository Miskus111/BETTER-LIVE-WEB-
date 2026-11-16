'use client'
import { create } from 'zustand'

export interface Toast {
  id: number
  title: string
  body?: string
  action?: { label: string; href: string }
}

interface ToastState {
  toasts: Toast[]
  dismiss: (id: number) => void
}

let seq = 0
export const useToasts = create<ToastState>()((set) => ({
  toasts: [],
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export function toast(t: Omit<Toast, 'id'>) {
  const id = ++seq
  useToasts.setState((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }))
  setTimeout(() => useToasts.getState().dismiss(id), 3800)
}
