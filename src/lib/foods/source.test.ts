import { describe, expect, it, vi } from 'vitest'
import { FOODS } from '@/data/foods'
import { fdcUrl } from './source'

vi.mock('server-only', () => ({}))
const { FOOD_DETAILS } = await import('@/data/food-details')

describe('USDA FoodData Central links', () => {
  it('search by FDC number within the right dataset (deep links do not open from other sites)', () => {
    expect(fdcUrl(171458, 'SR Legacy 2018-04')).toBe(
      'https://fdc.nal.usda.gov/food-search?query=171458&type=SR%20Legacy',
    )
    expect(fdcUrl('323121', 'Foundation Foods 2026-10-29')).toBe(
      'https://fdc.nal.usda.gov/food-search?query=323121&type=Foundation',
    )
  })
  it('every food from FDC has a number and a known dataset', () => {
    for (const f of FOODS) {
      const p = FOOD_DETAILS[f.id]?.provenance
      if (p?.source !== 'USDA FoodData Central') continue
      expect(String(p.sourceId), f.id).toMatch(/^\d+$/)
      expect(p.sourceVersion, f.id).toMatch(/^(SR Legacy|Foundation)/)
    }
  })
})
