'use client'
import { create } from 'zustand'

interface UiState {
  searchOpen: boolean
  setSearch: (open: boolean) => void
}

export const useUi = create<UiState>()((set) => ({
  searchOpen: false,
  setSearch: (searchOpen) => set({ searchOpen }),
}))
