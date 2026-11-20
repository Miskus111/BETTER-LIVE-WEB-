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
