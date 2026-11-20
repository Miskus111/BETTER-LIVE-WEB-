import { describe, expect, it } from 'vitest'
import { BODY_GUIDES } from './body-guides'
import { COMPOUNDS } from './compounds'
import { SUPPLEMENT_NUTRIENTS, SUPPLEMENT_SLUGS } from './supplements'
import { PUBLISHED, modifiedAfter } from './published'

describe('article publication dates', () => {
  it('exist for every guide and supplement page (add one when you add a page)', () => {
    const paths = [
      ...BODY_GUIDES.map((g) => `/jak-funguje-telo/${g.slug}`),
      ...COMPOUNDS.map((c) => `/doplnky/${c.slug}`),
      ...SUPPLEMENT_NUTRIENTS.filter((id) => SUPPLEMENT_SLUGS[id]).map(
        (id) => `/doplnky/${SUPPLEMENT_SLUGS[id]}`,
      ),
    ]
    expect(paths.filter((p) => !/^\d{4}-\d{2}-\d{2}$/.test(PUBLISHED[p] ?? ''))).toEqual([])
  })
  it('never lets dateModified precede datePublished', () => {
    expect(modifiedAfter('2026-11-19', '2026-11-18')).toBe('2026-11-19')
    expect(modifiedAfter('2026-11-16', '2026-11-18')).toBe('2026-11-18')
  })
})
