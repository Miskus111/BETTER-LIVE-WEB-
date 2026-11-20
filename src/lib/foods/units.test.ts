import { describe, expect, it } from 'vitest'
import {
  atwaterKcal,
  folateDfe,
  iuToMgAlphaTocopherol,
  iuToUgRetinol,
  iuToUgVitD,
  kcalToKj,
  kjToKcal,
  round,
  saltFromSodiumMg,
} from './units'

describe('food unit conversions', () => {
  it('vitamin D: 400 IU = 10 µg, 4000 IU = 100 µg', () => {
    expect(iuToUgVitD(400)).toBeCloseTo(10)
    expect(iuToUgVitD(4000)).toBeCloseTo(100)
  })
  it('vitamin A (retinol): 3333 IU ≈ 1000 µg RAE', () => {
    expect(iuToUgRetinol(3333)).toBeCloseTo(999.9, 1)
  })
  it('vitamin E: natural vs synthetic α-tocopherol', () => {
    expect(iuToMgAlphaTocopherol(100, 'natural')).toBeCloseTo(67)
    expect(iuToMgAlphaTocopherol(100, 'synthetic')).toBeCloseTo(45)
  })
  it('folate DFE counts folic acid 1.7×', () => {
    expect(folateDfe(100, 100)).toBeCloseTo(270)
    expect(folateDfe(50, 0)).toBe(50)
  })
  it('energy kcal ↔ kJ round-trips', () => {
    expect(kcalToKj(100)).toBeCloseTo(418.4)
    expect(kjToKcal(kcalToKj(250))).toBeCloseTo(250)
  })
  it('salt = sodium × 2.5', () => {
    expect(saltFromSodiumMg(400)).toBeCloseTo(1)
  })
  it('Atwater 4/4/9/7 with fibre 2', () => {
    expect(atwaterKcal({ protein: 10, carbsAvailable: 20, fat: 5, alcohol: 1, fiber: 3 })).toBe(
      40 + 80 + 45 + 7 + 6,
    )
  })
  it('rounding keeps precision proportional to magnitude', () => {
    expect(round(123.456)).toBe(123)
    expect(round(12.345)).toBe(12.3)
    expect(round(1.2345)).toBe(1.23)
    expect(round(0.12345)).toBe(0.123)
  })
})
