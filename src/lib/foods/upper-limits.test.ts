import { describe, expect, it } from 'vitest'
import data from '@/data/foods.generated.json'
import type { FoodsFile } from './types'
import { upperLimitHits } from './upper-limits'

const byId = Object.fromEntries((data as unknown as FoodsFile).foods.map((f) => [f.id, f]))
const hits = (id: string) => upperLimitHits(byId[id].nutrients, byId[id].portions[0].grams).map((h) => h.name)

describe('upperLimitHits (EFSA adult ULs, one portion)', () => {
  it('warns about retinol in liver and selenium in Brazil nuts', () => {
    expect(hits('beef-liver').join()).toContain('retinol')
    expect(hits('brazil-nuts').join()).toContain('selen')
  })
  it('does not warn about beta-carotene foods (the UL is for retinol only)', () => {
    expect(hits('carrot')).toEqual([])
    expect(hits('sweet-potato')).toEqual([])
    expect(hits('spinach')).toEqual([])
  })
})

describe('portions from FDC', () => {
  it('use the right FDC measure and count', () => {
    expect(byId['egg'].portions[0].grams).toBe(50) // "large", not "cup (4.86 large eggs)"
    expect(byId['couscous-cooked'].portions[0].grams).toBe(157) // "cup, cooked", not "cup, dry, yields"
    expect(byId['oysters'].portions[0].grams).toBe(84) // "6 ústřic" = 6 × 14 g
  })
})

describe('upper limits agree across the site', () => {
  it('food warnings use the same EFSA limits as the supplement pages and reference values', async () => {
    const { SUPPLEMENTS } = await import('@/data/supplement-library')
    const { REFERENCE } = await import('@/data/reference')
    const { UPPER_LIMITS } = await import('./upper-limits')
    const supplementId: Record<string, string> = {
      vitD: 'vitamin-d3',
      b6: 'vitamin-b6',
      zinc: 'zinc',
      iodine: 'iodine',
      selenium: 'selenium',
    }
    for (const u of UPPER_LIMITS) {
      if (u.key === 'retinol') {
        expect(REFERENCE.vitA?.ul?.text.replace(/\s/g, '')).toContain(String(u.ul))
        continue
      }
      expect(SUPPLEMENTS.find((s) => s.id === supplementId[u.key])?.ul?.value, u.key).toBe(u.ul)
    }
  })
})
