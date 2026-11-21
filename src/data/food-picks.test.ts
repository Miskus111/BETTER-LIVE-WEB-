import { describe, expect, it } from 'vitest'
import generated from './food-picks.generated.json'
import { buildFoodPicks } from '@/lib/food-picks'

describe('food picks', () => {
  it('the generated file matches the live rankings (run npm run gen:picks after changing foods or rules)', () => {
    expect(JSON.parse(JSON.stringify(buildFoodPicks()))).toEqual(generated)
  })
})
