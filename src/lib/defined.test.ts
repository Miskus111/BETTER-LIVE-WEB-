import { describe, expect, it } from 'vitest'
import { defined } from './defined'

describe('defined', () => {
  it('keeps zero and false, drops null and undefined', () => {
    expect(defined({ a: 0, b: null, c: false, d: undefined, e: 'x' })).toEqual({ a: 0, c: false, e: 'x' })
  })
})
