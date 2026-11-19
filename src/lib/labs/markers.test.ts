import { describe, expect, it } from 'vitest'
import { flagFor, matchMarker, normalizeRow, MARKER_BY_KEY } from './markers'
import { parseLabText } from './parse-text'

describe('marker matching', () => {
  it('matches Czech, English and abbreviated names', () => {
    expect(matchMarker('Glukóza')?.key).toBe('glucose')
    expect(matchMarker('S-Glukóza')?.key).toBe('glucose')
    expect(matchMarker('25-OH vitamin D')?.key).toBe('vitd')
    expect(matchMarker('HDL-cholesterol')?.key).toBe('hdl')
    expect(matchMarker('Feritin')?.key).toBe('ferritin')
    expect(matchMarker('Nonsense value')).toBeNull()
  })
})

describe('unit conversion and flags', () => {
  it('converts US units to SI and converts the lab range with it', () => {
    const r = normalizeRow({ name: 'Glucose', value: 90, unit: 'mg/dL', ref_low: 70, ref_high: 99 })
    expect(r.unit).toBe('mmol/L')
    expect(r.value).toBeCloseTo(5.0, 1)
    expect(r.ref_high).toBeCloseTo(5.49, 1)
    expect(r.flag).toBe('normal')
  })
  it('converts vitamin D ng/mL to nmol/L', () => {
    expect(normalizeRow({ name: 'Vitamin D', value: 20, unit: 'ng/mL' }).value).toBeCloseTo(49.9, 1)
  })
  it('converts HbA1c % to IFCC mmol/mol', () => {
    expect(normalizeRow({ name: 'HbA1c', value: 6.5, unit: '%' }).value).toBeCloseTo(47.5, 0)
  })
  it('marks unknown units for review instead of guessing', () => {
    const r = normalizeRow({ name: 'Ferritin', value: 40, unit: 'furlongs' })
    expect(r.needsReview).toBe(true)
    expect(r.flag).toBeNull()
  })
  it('lab range wins over the generic one; critical overrides everything', () => {
    expect(flagFor(MARKER_BY_KEY.ferritin, 25, 15, 150)).toBe('normal')
    expect(flagFor(MARKER_BY_KEY.ferritin, 25)).toBe('low')
    expect(flagFor(MARKER_BY_KEY.potassium, 6.8, 3.5, 5.1)).toBe('critical')
  })
})

describe('text parser', () => {
  it('reads a typical Czech lab printout', () => {
    const rows = parseLabText(`
S-Glukóza      5,9   mmol/l   3,9 - 5,6   H
S-Cholesterol  4,8   mmol/l   < 5,0
HDL cholesterol 1,4 mmol/l  1,0 - 2,1
Vitamin B12   350 pmol/l  145 - 569
25-OH vitamin D 42 nmol/l 75 - 250
Feritin 12 ug/l 30-300
Poznámka: odběr nalačno
`)
    const by = Object.fromEntries(rows.map((r) => [r.marker, r]))
    expect(by.glucose).toMatchObject({ value: 5.9, ref_low: 3.9, ref_high: 5.6, flag: 'high' })
    expect(by.chol_total).toMatchObject({ value: 4.8, ref_high: 5, flag: 'normal' })
    expect(by.b12.value).toBe(350)
    expect(by.vitd.flag).toBe('low')
    expect(by.ferritin.flag).toBe('low')
    expect(rows).toHaveLength(6)
  })
})

describe('review fixes', () => {
  it('Czech "Cholesterol HDL/LDL" labels map to HDL/LDL, not total cholesterol', () => {
    expect(matchMarker('Cholesterol HDL')?.key).toBe('hdl')
    expect(matchMarker('Cholesterol LDL')?.key).toBe('ldl')
    expect(matchMarker('S-Cholesterol celkový')?.key).toBe('chol_total')
    expect(matchMarker('Gama-GT')?.key).toBe('ggt')
  })
  it('a value without a unit is sent to review when the marker has several common units', () => {
    const r = normalizeRow({ name: 'Glukóza', value: 95, unit: '' })
    expect(r.needsReview).toBe(true)
    expect(r.flag).toBeNull()
  })
  it('a one-sided lab range is not completed with the generic range', () => {
    expect(flagFor(matchMarker('HDL cholesterol'), 3.5, 1.0, null)).toBe('normal')
  })
})
