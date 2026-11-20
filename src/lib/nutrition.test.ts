import { describe, expect, it } from 'vitest'
import { ORGAN_BY_ID } from '@/data/organs'
import { foodsForOrgan, topFoodsFor } from './nutrition'

describe('rankings per 100 g', () => {
  it('leave out foods eaten by the pinch (spices, dried herbs)', () => {
    const ids = topFoodsFor('calcium', 10).map((x) => x.food.id)
    expect(ids).not.toContain('marjoram')
    expect(ids).not.toContain('oregano')
    expect(foodsForOrgan(ORGAN_BY_ID.bones, 12).map((x) => x.food.id)).not.toContain('marjoram')
  })
  it('still rank them per portion on their real amounts', () => {
    expect(topFoodsFor('calcium', 10, 'portion').length).toBe(10)
  })
})
