'use client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { PRODUCT_BY_ID } from '@/data/products'
import { toast } from './toast'

export interface CartLine {
  id: string
  qty: number
}

interface CartState {
  lines: CartLine[]
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

export const MAX_QTY = 20

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (id, qty = 1) => {
        const p = PRODUCT_BY_ID[id]
        if (!p) return
        const existing = get().lines.find((l) => l.id === id)
        const lines = existing
          ? get().lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
          : [...get().lines, { id, qty: Math.min(MAX_QTY, qty) }]
        set({ lines })
        toast({
          title: 'Added to cart',
          body: `${qty} × ${p.name}`,
          action: { label: 'View cart', href: '/cart' },
        })
      },
      setQty: (id, qty) =>
        set({
          lines:
            qty <= 0
              ? get().lines.filter((l) => l.id !== id)
              : get().lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
        }),
      remove: (id) => set({ lines: get().lines.filter((l) => l.id !== id) }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: 'flx-cart-v1',
      storage: createJSONStorage(() => window.localStorage),
      // drop lines whose product no longer exists
      merge: (persisted, current) => {
        const p = persisted as Partial<CartState> | undefined
        const lines = (p?.lines ?? []).filter((l) => PRODUCT_BY_ID[l.id] && l.qty > 0)
        return { ...current, lines }
      },
    },
  ),
)

export const cartCount = (lines: CartLine[]) => lines.reduce((s, l) => s + l.qty, 0)
