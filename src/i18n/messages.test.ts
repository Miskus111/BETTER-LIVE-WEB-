import { describe, expect, it } from 'vitest'
import cs from '../../messages/cs.json'
import en from '../../messages/en.json'

type Tree = Record<string, unknown>
const flat = (o: unknown, p = ''): Record<string, unknown> =>
  o && typeof o === 'object'
    ? Object.entries(o as Tree).reduce((acc, [k, v]) => ({ ...acc, ...flat(v, p ? `${p}.${k}` : k) }), {})
    : { [p]: o }
const placeholders = (s: unknown) =>
  typeof s === 'string' ? [...s.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort() : []

describe('translations', () => {
  const a = flat(cs)
  const b = flat(en)
  it('have the same keys in Czech and English', () => {
    expect(Object.keys(a).filter((k) => !(k in b))).toEqual([])
    expect(Object.keys(b).filter((k) => !(k in a))).toEqual([])
  })
  it('have no empty texts and the same {placeholders}', () => {
    expect(
      Object.entries({ ...a, ...b })
        .filter(([, v]) => v === '')
        .map(([k]) => k),
    ).toEqual([])
    expect(
      Object.keys(a).filter((k) => k in b && placeholders(a[k]).join() !== placeholders(b[k]).join()),
    ).toEqual([])
  })
})
