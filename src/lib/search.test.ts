import { describe, expect, it } from 'vitest'
import { search } from './search'
import { thresholdOf } from './nutrition'
import { searchGuides } from './guide-search'
import { BODY_GUIDES } from '@/data/body-guides'

describe('site search', () => {
  it('finds calculators and glossary terms', () => {
    expect(search('krevní tlak').some((r) => r.kind === 'Kalkulačka')).toBe(true)
    expect(search('adenosin').some((r) => r.kind === 'Pojem')).toBe(true)
  })
  it('ignores one-letter words in guide search', () => {
    const withD = searchGuides(BODY_GUIDES, 'kofein d')
    expect(withD[0]?.slug).toBe(searchGuides(BODY_GUIDES, 'kofein')[0]?.slug)
  })
})

describe('EU "source of" thresholds', () => {
  it('drinks use half the solid threshold (7.5 % per 100 ml)', () => {
    const solid = thresholdOf('calcium')!
    expect(thresholdOf('calcium', true)).toBeCloseTo(solid / 2)
  })
})

describe('search finds the main pages', () => {
  it('foods, calculators, pricing and how we recommend', async () => {
    const { search } = await import('./search')
    const top = (q: string) =>
      search(q)
        .slice(0, 3)
        .map((r) => r.href)
    expect(top('potraviny')).toContain('/potraviny')
    expect(top('kalkulacka')).toContain('/nastroje')
    expect(top('cenik')).toContain('/pricing')
    expect(top('affiliate')).toContain('/jak-doporucujeme')
  })
})
