import { describe, expect, it } from 'vitest'
import { clip } from './format'

describe('clip', () => {
  it('keeps short text and cuts long text at a word boundary', () => {
    expect(clip('krátké', 10)).toBe('krátké')
    expect(clip('Srdce pumpuje krev, kyslík a živiny do celého těla', 25)).toBe('Srdce pumpuje krev…')
  })
  it('does not leave a parenthesis open', () => {
    expect(clip('Srdeční sval potřebuje stálou energii (závislou na thiaminu a hořčíku)', 55)).toBe(
      'Srdeční sval potřebuje stálou energii…',
    )
  })
})
