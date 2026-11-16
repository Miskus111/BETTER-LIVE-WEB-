import { describe, expect, it } from 'vitest'
import { SUPPLEMENT_BY_ID, SUPPLEMENTS } from '@/data/supplement-library'
import { checkDose, checkStack, isExcluded, medicationCategories } from './safety'

describe('upper limits (EFSA)', () => {
  it('blocks vitamin D above 100 µg', () => {
    expect(checkDose(SUPPLEMENT_BY_ID['vitamin-d3'], 125)?.level).toBe('block')
    expect(checkDose(SUPPLEMENT_BY_ID['vitamin-d3'], 25)).toBeNull()
  })
  it('blocks zinc above 25 mg and B6 above 12.5 mg', () => {
    expect(checkDose(SUPPLEMENT_BY_ID.zinc, 30)?.code).toBe('over_ul')
    expect(checkDose(SUPPLEMENT_BY_ID['vitamin-b6'], 20)?.code).toBe('over_ul')
  })
  it('blocks supplemental magnesium above 250 mg', () => {
    expect(checkDose(SUPPLEMENT_BY_ID.magnesium, 400)?.level).toBe('block')
  })
  it('warns above typical range but under the UL', () => {
    expect(checkDose(SUPPLEMENT_BY_ID['vitamin-d3'], 50)?.code).toBe('over_typical')
  })
  it('every typical maximum respects its own UL', () => {
    for (const s of SUPPLEMENTS) if (s.ul) expect(s.dose.max, s.id).toBeLessThanOrEqual(s.ul.value)
  })
})

describe('medications', () => {
  it('recognises Czech and English drug names', () => {
    expect(medicationCategories('Warfarin 5 mg, Euthyrox 50')).toEqual(['anticoagulants', 'levothyroxine'])
    expect(medicationCategories('beru Xarelto')).toContain('anticoagulants')
    expect(medicationCategories('')).toEqual([])
  })
  it('flags omega-3 with anticoagulants for a doctor', () => {
    const r = checkStack([{ id: 'omega-3', dailyAmount: 1000 }], { medications: 'warfarin' })
    expect(r.some((i) => i.level === 'doctor')).toBe(true)
  })
  it('adds timing advice for magnesium with levothyroxine', () => {
    const r = checkStack([{ id: 'magnesium', dailyAmount: 200 }], { medications: 'Letrox' })
    expect(r.map((i) => i.level)).toContain('timing')
  })
  it('flags iron + calcium in the same stack', () => {
    const r = checkStack(
      [
        { id: 'iron', dailyAmount: 20 },
        { id: 'calcium', dailyAmount: 300 },
      ],
      {},
    )
    expect(r.filter((i) => i.code === 'combination').length).toBeGreaterThan(0)
  })
  it('defers everything to a doctor during pregnancy', () => {
    const r = checkStack([{ id: 'vitamin-c', dailyAmount: 100 }], { conditions: ['pregnancy'] })
    expect(r.some((i) => i.level === 'doctor')).toBe(true)
  })
})

describe('hard exclusions', () => {
  it('rejects steroids, SARMs and peptides', () => {
    for (const n of ['Ostarine MK-2866', 'BPC-157', 'Anabolic steroids', 'Melanotan II', 'RAD-140'])
      expect(isExcluded(n), n).toBe(true)
  })
  it('the library itself contains nothing excluded', () => {
    for (const s of SUPPLEMENTS) expect(isExcluded(s.name.en), s.id).toBe(false)
  })
})

describe('caffeine', () => {
  it('blocks above the EFSA 400 mg/day safe intake', () => {
    expect(checkDose(SUPPLEMENT_BY_ID.caffeine, 500)?.level).toBe('block')
  })
})
