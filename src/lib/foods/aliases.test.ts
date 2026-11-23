import { describe, expect, it } from 'vitest'
import { FOODS } from '@/data/foods'
import { matchesText } from './query'
import { search } from '@/lib/search'

describe('everyday food words', () => {
  const names = (q: string) => FOODS.filter((f) => matchesText(f, q)).map((f) => f.name)
  it.each([
    ['vajíčko', 'Vejce (celé)'],
    ['ryba', 'Losos (chovaný)'],
    ['špagety', 'Těstoviny vařené'],
    ['krocan', 'Krůtí prsa'],
    ['energeťák', 'Energetický nápoj'],
    ['syrovátka', 'Syrovátkový protein (izolát)'],
  ])('"%s" finds %s in the food list and in ⌘K', (q, name) => {
    expect(names(q)).toContain(name)
    expect(search(q).map((r) => r.title)).toContain(name)
  })
})
