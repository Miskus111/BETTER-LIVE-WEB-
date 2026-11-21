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

  it('every guide with food picks exists, and fortified plant drinks say so in their name', async () => {
    const { foodPicksForGuide } = await import('./guides')
    const { FOODS } = await import('@/data/foods')
    const { BODY_GUIDE_BY_SLUG } = await import('@/data/body-guides')
    for (const slug of ['menopauza', 'imunita', 'cukr-a-inzulin', 'hubnuti-a-energie', 'prevence-rakoviny']) {
      expect(BODY_GUIDE_BY_SLUG[slug], slug).toBeTruthy()
      expect(foodPicksForGuide(slug, FOODS)!.items.length, slug).toBeGreaterThan(2)
    }
    const calcium = foodPicksForGuide('menopauza', FOODS)!.items.map((x) => x.food)
    for (const f of calcium.filter((f) => /drink|nápoj/i.test(`${f.id} ${f.name}`)))
      expect(f.name, f.id).toMatch(/obohacen/)
  })
})
