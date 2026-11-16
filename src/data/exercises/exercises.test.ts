import { describe, expect, it } from 'vitest'
import { EXERCISE_BY_SLUG, EXERCISES, MUSCLES, EQUIPMENT_KINDS } from './index'

describe('exercise library', () => {
  it('has at least 150 exercises with unique slugs', () => {
    expect(EXERCISES.length).toBeGreaterThanOrEqual(150)
    expect(new Set(EXERCISES.map((e) => e.slug)).size).toBe(EXERCISES.length)
  })
  it('every exercise is bilingual and fully described', () => {
    for (const e of EXERCISES) {
      expect(e.name.cs && e.name.en, e.slug).toBeTruthy()
      expect(e.cue.cs && e.cue.en && e.mistake.cs && e.mistake.en, e.slug).toBeTruthy()
      expect(e.primary.length, e.slug).toBeGreaterThan(0)
      expect(e.equipment.length, e.slug).toBeGreaterThan(0)
    }
  })
  it('uses only known muscles and equipment', () => {
    for (const e of EXERCISES) {
      for (const m of [...e.primary, ...e.secondary]) expect(MUSCLES, `${e.slug}: ${m}`).toContain(m)
      for (const q of e.equipment) expect(EQUIPMENT_KINDS, `${e.slug}: ${q}`).toContain(q)
    }
  })
  it('regressions and progressions point to existing exercises', () => {
    for (const e of EXERCISES)
      for (const r of [...e.regressions, ...e.progressions])
        expect(EXERCISE_BY_SLUG[r], `${e.slug} → ${r}`).toBeDefined()
  })
})

import { TEMPLATES } from './templates'
describe('templates', () => {
  it('only reference existing exercises', () => {
    for (const tpl of TEMPLATES)
      for (const s of tpl.exercises) expect(EXERCISE_BY_SLUG[s], `${tpl.id} → ${s}`).toBeDefined()
  })
})
