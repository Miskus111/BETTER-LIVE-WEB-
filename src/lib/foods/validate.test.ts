import { describe, expect, it } from 'vitest'
import data from '@/data/foods.generated.json'
import type { FoodsFile, GeneratedFood } from './types'
import { validateFoods } from './validate'

const base = (data as unknown as FoodsFile).foods.find((f) => f.id === 'salmon')!
const broken = (patch: Partial<GeneratedFood['nutrients']>): GeneratedFood => ({
  ...base,
  id: 'test-food',
  nutrients: { ...base.nutrients, ...patch },
})
const problems = (f: GeneratedFood) => validateFoods([f]).map((i) => i.problem)

describe('validateFoods', () => {
  it('accepts the committed dataset', () => {
    expect(validateFoods((data as unknown as FoodsFile).foods)).toEqual([])
  })
  it('catches parts larger than their whole', () => {
    expect(problems(broken({ satFat: 30, fat: 13 })).join()).toMatch(/saturated fat/)
    expect(problems(broken({ carbsTotal: 2, sugars: 9 })).join()).toMatch(/sugars/)
  })
  it('catches an impossible fatty-acid breakdown (FDC 168000 pattern)', () => {
    expect(problems(broken({ fat: 29.7, satFat: 28.4, monoFat: 0, polyFat: 0 })).join()).toMatch(
      /mono and poly/,
    )
  })
})

describe('basic minerals', () => {
  it('flags a food whose source has no minerals, unless the gap is explained', async () => {
    const { validateFoods } = await import('./validate')
    const data = (await import('@/data/foods.generated.json')).default as unknown as {
      foods: Parameters<typeof validateFoods>[0]
    }
    const beans = structuredClone(data.foods.find((f) => f.id === 'lentils')!)
    beans.id = 'test-beans'
    const n = beans.nutrients as Record<string, number | null>
    n.sodium = n.potassium = n.iron = n.calcium = null
    const issues = validateFoods([beans])
    expect(issues.some((i) => /missing sodium, potassium, iron, calcium/.test(i.problem))).toBe(true)
    beans.provenance.notes = [...beans.provenance.notes, 'Hodnoty minerálů neuvádíme, protože…']
    expect(validateFoods([beans]).some((i) => /missing/.test(i.problem))).toBe(false)
  })
})
