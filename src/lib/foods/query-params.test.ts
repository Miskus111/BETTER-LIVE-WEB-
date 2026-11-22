import { describe, expect, it } from 'vitest'
import { EMPTY_QUERY, queryFromParams, queryToParams } from './query'

describe('food explorer URL', () => {
  it('round-trips filters and leaves defaults out of the URL', () => {
    const q = {
      ...EMPTY_QUERY,
      q: 'špenát',
      diet: 'vegan' as const,
      highIn: 'iron' as const,
      per: 'portion' as const,
    }
    const sp = queryToParams(q)
    expect(sp.toString()).toBe('q=%C5%A1pen%C3%A1t&diet=vegan&highIn=iron&per=portion')
    expect(queryFromParams(sp)).toEqual(q)
    expect(queryToParams(EMPTY_QUERY).toString()).toBe('')
  })
  it('ignores unknown or malformed values', () => {
    const q = queryFromParams(
      new URLSearchParams('diet=carnivore&highIn=unobtainium&sort=evil&per=ton&state=<script>'),
    )
    expect(q).toEqual(EMPTY_QUERY)
  })
})
