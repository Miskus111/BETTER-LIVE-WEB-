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
