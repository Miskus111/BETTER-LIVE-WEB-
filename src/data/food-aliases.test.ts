import { describe, expect, it } from 'vitest'
import { FOOD_BY_ID, FOOD_ID_ALIASES, foodById } from './foods'

describe('renamed food ids', () => {
  it('old ids still resolve (diary entries keep them)', () => {
    expect(foodById('seaweed-nori')?.id).toBe('spirulina')
    expect(foodById('yeast-nutritional')?.id).toBe('yeast-dry')
  })
  it('aliases point to existing foods and never shadow a current id', () => {
    for (const [oldId, id] of Object.entries(FOOD_ID_ALIASES)) {
      expect(FOOD_BY_ID[id]).toBeDefined()
      expect(FOOD_BY_ID[oldId]).toBeUndefined()
    }
  })
})
