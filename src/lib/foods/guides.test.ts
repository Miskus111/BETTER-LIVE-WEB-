import { describe, expect, it } from 'vitest'
import { FOOD_BY_ID } from '@/data/foods'
import { guidesForFood } from './guides'

const slugs = (id: string) => guidesForFood(FOOD_BY_ID[id]).map((g) => g.slug)

describe('guidesForFood', () => {
  it('links foods to guides by what they are notable for', () => {
    expect(slugs('kefir')).toEqual(expect.arrayContaining(['laktoza-a-lepek', 'streva-a-mikrobiom']))
    expect(slugs('salmon')).toEqual(expect.arrayContaining(['tuky', 'bilkoviny']))
    expect(slugs('lentils')).toEqual(expect.arrayContaining(['rostlinna-strava']))
  })
  it('does not attach unrelated guides', () => {
    expect(slugs('beef')).not.toContain('traveni-a-zacpa')
    expect(slugs('spinach')).not.toContain('bilkoviny')
  })
})

describe('foodPicksForGuide', () => {
  it('lists real, varied sources per portion and no junk or recipes', async () => {
    const { foodPicksForGuide } = await import('./guides')
    const { FOODS } = await import('@/data/foods')
    const fat = foodPicksForGuide('tuky', FOODS)!
    expect(fat.items[0].amount).toBeGreaterThan(1000)
    expect(fat.items.every((x) => x.amount >= fat.items[0].amount * 0.25)).toBe(true)
    const protein = foodPicksForGuide('bilkoviny', FOODS)!.items.map((x) => x.food)
    expect(protein.some((f) => f.recipe)).toBe(false)
    const fibre = foodPicksForGuide('traveni-a-zacpa', FOODS)!.items.map((x) => x.food.category)
    expect(new Set(fibre).size).toBeGreaterThan(2)
    expect(foodPicksForGuide('spanek', FOODS)).toBeNull()
  })
})
