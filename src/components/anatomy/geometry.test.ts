import { describe, expect, it } from 'vitest'
import { HALF_OUTLINE_POINTS, LANDMARKS, STATURE } from './geometry'

/**
 * Segment heights as a share of stature (Drillis & Contini 1966; tabulated in Winter,
 * Biomechanics and Motor Control of Human Movement). The figure must stay within ±3 % of stature.
 */
const REFERENCE: Record<keyof typeof LANDMARKS, number> = {
  chin: 0.87,
  shoulder: 0.818,
  elbow: 0.63,
  wrist: 0.485,
  hipJoint: 0.53,
  knee: 0.285,
  ankle: 0.039,
}

const H = STATURE.floor - STATURE.crown
const heightShare = (y: number) => (STATURE.floor - y) / H

describe('anatomy proportions', () => {
  for (const [k, ref] of Object.entries(REFERENCE)) {
    it(`${k} height ≈ ${ref} × stature`, () => {
      expect(Math.abs(heightShare(LANDMARKS[k as keyof typeof LANDMARKS]) - ref)).toBeLessThan(0.03)
    })
  }

  /** full breadth from the outermost outline point between y0 and y1 (optionally ignoring the arm) */
  const widthBetween = (y0: number, y1: number, minX = 0) => {
    const xs = HALF_OUTLINE_POINTS.filter(([x, y]) => y >= y0 && y <= y1 && x >= minX).map(([x]) => x)
    return (200 - Math.min(...xs)) * 2
  }

  it('shoulder breadth (deltoids) ≈ 0.259 × stature', () => {
    expect(Math.abs(widthBetween(200, 260) / H - 0.259)).toBeLessThan(0.02)
  })
  it('hip breadth ≈ 0.191 × stature', () => {
    // ignore the hanging hand, which is at the same height
    expect(Math.abs(widthBetween(440, 520, 110) / H - 0.191)).toBeLessThan(0.02)
  })
  it('hand length ≈ 0.108 × stature', () => {
    const fingertip = Math.max(...HALF_OUTLINE_POINTS.filter(([x]) => x < 100).map(([, y]) => y))
    expect(Math.abs((fingertip - LANDMARKS.wrist) / H - 0.108)).toBeLessThan(0.02)
  })
  it('head height (chin to crown) ≈ 0.13 × stature', () => {
    expect(Math.abs((LANDMARKS.chin - STATURE.crown) / H - 0.13)).toBeLessThan(0.01)
  })
})
