import { describe, expect, it } from 'vitest'
import { NUTRIENTS } from '@/data/nutrients'
import { EU_REFERENCE } from './panel'

describe('EU reference intakes (Reg. 1169/2011 Annex XIII)', () => {
  it('are the same in the nutrient model and the full nutrition table', () => {
    for (const [id, n] of Object.entries(NUTRIENTS)) {
      if (n.ref?.kind !== 'RHP') continue
      expect((EU_REFERENCE as Record<string, number>)[id], id).toBe(n.ref.value)
    }
  })
})
