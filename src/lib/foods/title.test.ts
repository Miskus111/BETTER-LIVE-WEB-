import { describe, expect, it } from 'vitest'
import { FOODS } from '@/data/foods'
import { foodTitle } from './title'

describe('food page titles', () => {
  it('fit in search results: at most 70 characters with the site suffix, for every food', () => {
    const tooLong = FOODS.map((f) => `${foodTitle(f)} · BLWB`).filter((t) => t.length > 70)
    expect(tooLong).toEqual([])
  })
  it('keep the approximation note off the title and are unique', () => {
    expect(foodTitle({ name: 'Bábovka / biskupský chlebíček (blízká obdoba)' })).not.toContain('obdoba')
    const titles = FOODS.map(foodTitle)
    expect(new Set(titles).size).toBe(titles.length)
  })
})
