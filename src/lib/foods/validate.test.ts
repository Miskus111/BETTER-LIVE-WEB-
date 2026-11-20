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
