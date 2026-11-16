import { describe, expect, it } from 'vitest'
import { EDUCATION, MOBILITY, MOBILITY_BY_SLUG, REGION_PLAN, ROUTINES } from './mobility'
import { FLAGS_BY_REGION } from '@/lib/pain/red-flags'

describe('mobility data', () => {
  it('slugs are unique and routines/plans reference existing exercises', () => {
    expect(new Set(MOBILITY.map((m) => m.slug)).size).toBe(MOBILITY.length)
    for (const r of ROUTINES)
      for (const s of r.items) expect(MOBILITY_BY_SLUG[s], `${r.id} → ${s}`).toBeDefined()
    for (const [region, stages] of Object.entries(REGION_PLAN)) {
      expect(stages.length, region).toBe(3)
      for (const st of stages)
        for (const s of st) expect(MOBILITY_BY_SLUG[s], `${region} → ${s}`).toBeDefined()
    }
  })
  it('every pain region has education, a plan and red-flag questions', () => {
    for (const region of Object.keys(FLAGS_BY_REGION)) {
      expect(EDUCATION[region as keyof typeof EDUCATION], region).toBeDefined()
      expect(REGION_PLAN[region as keyof typeof REGION_PLAN], region).toBeDefined()
    }
  })
  it('every exercise has a dose and bilingual instructions', () => {
    for (const m of MOBILITY) {
      expect(m.seconds || m.reps, m.slug).toBeTruthy()
      expect(m.how.cs && m.how.en, m.slug).toBeTruthy()
    }
  })
})
