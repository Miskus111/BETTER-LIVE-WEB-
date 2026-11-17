import { describe, expect, it } from 'vitest'
import { QUIZ, QUIZ_LENGTH } from './quiz'
import { BODY_GUIDE_BY_SLUG } from './body-guides'

describe('quiz', () => {
  it('every item points to an existing guide', () => {
    for (const q of QUIZ) expect(BODY_GUIDE_BY_SLUG[q.guide], q.id).toBeDefined()
  })
  it('ids and statements are unique', () => {
    expect(new Set(QUIZ.map((q) => q.id)).size).toBe(QUIZ.length)
    expect(new Set(QUIZ.map((q) => q.statement)).size).toBe(QUIZ.length)
  })
  it('has enough myths and facts for a balanced round', () => {
    expect(QUIZ.filter((q) => q.fact).length).toBeGreaterThanOrEqual(QUIZ_LENGTH)
    expect(QUIZ.filter((q) => !q.fact).length).toBeGreaterThanOrEqual(QUIZ_LENGTH)
  })
})
