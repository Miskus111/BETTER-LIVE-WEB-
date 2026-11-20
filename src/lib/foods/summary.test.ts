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
  it('also states the downsides (UK FSA "high" thresholds)', () => {
    expect(text('nutella')).toContain('Vysoký obsah cukrů')
    expect(text('parmesan')).toContain('nasycených tuků')
    expect(text('nutella')).not.toContain('nasycených tuků') // source values are wrong → no data
    expect(text('chips')).toContain('Vysoký obsah tuku')
    expect(text('parmesan')).toContain('Vysoký obsah soli')
    expect(text('dates')).toContain('přirozené cukry z ovoce')
    expect(text('salmon')).not.toContain('cukrů')
  })
  it('does not repeat parentheses in nutrient names', () => {
    expect(text('oats')).not.toMatch(/\) \(/)
  })
})
