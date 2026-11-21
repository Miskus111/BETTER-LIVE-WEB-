import { describe, expect, it } from 'vitest'
import data from '@/data/foods.generated.json'
import lite from '@/data/foods.lite.generated.json'
import type { FoodsFile } from './types'
import { microsFromPanel, toLite } from './lite'

const full = Object.fromEntries((data as unknown as FoodsFile).foods.map((f) => [f.id, f]))

describe('client food index', () => {
  it('is exactly what toLite makes of the full panel (no stale build)', () => {
    expect(lite).toEqual((data as unknown as FoodsFile).foods.map(toLite))
  })
  it('converts EPA + DHA from g to mg as one omega-3 value', () => {
    const n = full['salmon'].nutrients
    expect(microsFromPanel(n).omega3).toBe(Math.round(((n.epa ?? 0) + (n.dha ?? 0)) * 1000))
  })
  it('leaves out unknown and zero values instead of showing 0', () => {
    const m = microsFromPanel(full['olive-oil'].nutrients)
    expect(m.vitC).toBeUndefined()
    expect(Object.values(m).every((v) => (v as number) > 0)).toBe(true)
  })
  it('uses available carbohydrate (EU), not total', () => {
    const almonds = (lite as { id: string; carbs: number }[]).find((f) => f.id === 'almonds')!
    expect(almonds.carbs).toBe(full['almonds'].nutrients.carbsAvailable)
  })
})
