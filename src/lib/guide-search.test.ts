import { describe, expect, it } from 'vitest'
import { BODY_GUIDES, GUIDE_CATEGORY } from '@/data/body-guides'
import { searchGuides } from './guide-search'

describe('searchGuides', () => {
  it('ignores diacritics and ranks title matches first', () => {
    const r = searchGuides(BODY_GUIDES, 'spanek')
    expect(r[0].slug).toBe('spanek')
    expect(r.length).toBeGreaterThan(1) // other guides mention sleep too
  })
  it('requires every word', () => {
    expect(searchGuides(BODY_GUIDES, 'kofein adenosin').map((g) => g.slug)).toContain('energie-a-kofein')
    expect(searchGuides(BODY_GUIDES, 'kofein xyzneexistuje')).toHaveLength(0)
  })
  it('finds content inside myths and advice', () => {
    expect(searchGuides(BODY_GUIDES, 'magnetická rezonance').map((g) => g.slug)).toContain('bolest-zad')
  })
  it('returns everything for an empty query', () => {
    expect(searchGuides(BODY_GUIDES, '  ')).toHaveLength(BODY_GUIDES.length)
  })
  it('every guide has a category', () => {
    for (const g of BODY_GUIDES) expect(GUIDE_CATEGORY[g.slug], g.slug).toBeTruthy()
  })
})
