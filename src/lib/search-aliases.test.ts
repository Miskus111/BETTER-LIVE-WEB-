import { describe, expect, it } from 'vitest'
import { search } from './search'

const first = (q: string) => search(q)[0]?.title

describe('search aliases', () => {
  it('finds nutrients by everyday and English names', () => {
    expect(first('protein')).toBe('Bílkoviny')
    expect(first('fish oil')).toBe('Omega-3 EPA + DHA')
    expect(first('calcium')).toBe('Vápník')
  })
  it('finds foods by their English name', () => {
    expect(first('chicken')).toMatch(/^Kuřecí/)
  })
  it('finds guides by the words people use', () => {
    expect(first('nespavost')).toBe('Spánek')
    expect(first('cukrovka')).toBe('Cukr a inzulin')
    expect(first('posilovna')).toBe('Posilování od nuly')
  })
  it('still prefers Czech title matches', () => {
    expect(first('losos')).toMatch(/^Losos/)
  })
})
