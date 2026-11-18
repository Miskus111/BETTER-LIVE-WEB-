import { describe, expect, it } from 'vitest'
import { GLOSSARY, splitTerms } from './glossary'
import { BODY_GUIDE_BY_SLUG } from './body-guides'

const terms = (text: string) =>
  splitTerms(text, new Set()).flatMap((p) => (typeof p === 'string' ? [] : [`${p.id}:${p.text}`]))

describe('glossary', () => {
  it('finds inflected Czech forms and keeps the rest of the text intact', () => {
    const text = 'Kofein zablokuje signál adenosinu a zvedá kortizol.'
    const parts = splitTerms(text, new Set())
    expect(parts.map((p) => (typeof p === 'string' ? p : p.text)).join('')).toBe(text)
    expect(terms(text)).toEqual(['adenosin:adenosinu', 'kortizol:kortizol'])
  })
  it('prefers the longer term and matches capitalised words', () => {
    expect(terms('Inzulinová rezistence předchází cukrovce.')).toEqual([
      'inzulinova-rezistence:Inzulinová rezistence',
    ])
    expect(terms('Inzulin pomáhá.')).toEqual(['inzulin:Inzulin'])
  })
  it('matches acronyms only as whole words in capitals', () => {
    expect(terms('UV záření a LDL')).toEqual(['uv:UV', 'ldl:LDL'])
    expect(terms('uvnitř buňky, Tremor')).toEqual([])
  })
  it('does not match inside other words', () => {
    expect(terms('plakát a plakal')).toEqual([])
    expect(terms('aurum, laura')).toEqual([])
  })
  it('underlines each term only once per page', () => {
    const seen = new Set<string>()
    splitTerms('dopamin', seen)
    expect(splitTerms('dopaminu a zase dopamin', seen)).toEqual(['dopaminu a zase dopamin'])
  })
  it('every term links to an existing guide and ids are unique', () => {
    expect(new Set(GLOSSARY.map((t) => t.id)).size).toBe(GLOSSARY.length)
    for (const t of GLOSSARY) if (t.guide) expect(BODY_GUIDE_BY_SLUG[t.guide], t.id).toBeDefined()
  })
})
