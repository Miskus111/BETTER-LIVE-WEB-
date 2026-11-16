import { describe, expect, it } from 'vitest'
import { COMPOUNDS } from './compounds'
import { BODY_GUIDES } from './body-guides'
import { SUPPLEMENT_SLUGS } from './supplements'
import { ORGANS } from './organs'

const internal = new Set<string>([
  '/login?mode=signup',
  ...COMPOUNDS.map((c) => `/doplnky/${c.slug}`),
  ...Object.values(SUPPLEMENT_SLUGS).map((s) => `/doplnky/${s}`),
  ...BODY_GUIDES.map((g) => `/jak-funguje-telo/${g.slug}`),
  ...ORGANS.map((o) => `/organ/${o.id}`),
])

describe('educational content', () => {
  it('every compound has effects with evidence, safety notes and https sources', () => {
    for (const c of COMPOUNDS) {
      expect(c.effects.length, c.slug).toBeGreaterThan(0)
      expect(c.caution.length, c.slug).toBeGreaterThan(0)
      expect(c.sources.length, c.slug).toBeGreaterThan(0)
      for (const s of c.sources) expect(s.url, c.slug).toMatch(/^https:\/\//)
    }
  })
  it('slugs are unique and never clash with nutrient guide slugs', () => {
    const all = [...COMPOUNDS.map((c) => c.slug), ...Object.values(SUPPLEMENT_SLUGS)]
    expect(new Set(all).size).toBe(all.length)
  })
  it('every body guide is complete and links only to pages that exist', () => {
    for (const g of BODY_GUIDES) {
      expect(g.tldr.length, g.slug).toBeGreaterThanOrEqual(2)
      expect(g.helps.length, g.slug).toBeGreaterThan(0)
      expect(g.myths.length, g.slug).toBeGreaterThan(0)
      expect(g.sources.length, g.slug).toBeGreaterThan(0)
      for (const r of g.related) expect(internal.has(r.href), `${g.slug} → ${r.href}`).toBe(true)
    }
  })
})
