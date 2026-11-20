import { describe, expect, it } from 'vitest'
import { FOOD_BY_ID } from '@/data/foods'
import { foodSummary } from './summary'

const text = (id: string) => foodSummary(FOOD_BY_ID[id]).join(' ')

describe('foodSummary (EU claim thresholds)', () => {
  it('states what a food is notable for', () => {
    expect(text('almonds')).toContain('Vysoký obsah vlákniny')
    expect(text('almonds')).toContain('Energeticky hutné')
    expect(text('salmon')).toContain('Vysoký obsah bílkovin')
    expect(text('salmon')).toMatch(/vitamín D \(\d+\u00a0%\)/)
    expect(text('cucumber')).toContain('Nízký obsah energie')
  })
  it('makes no protein claim for foods with almost no protein', () => {
    expect(text('coffee')).not.toContain('bílkovin')
    expect(text('spinach')).not.toContain('bílkovin')
  })
  it('does not repeat parentheses in nutrient names', () => {
    expect(text('oats')).not.toMatch(/\) \(/)
  })
})
