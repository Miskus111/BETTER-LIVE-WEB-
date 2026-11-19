import { describe, expect, it } from 'vitest'
import { screenMessage } from './safety'

describe('coach safety pre-screen', () => {
  it('routes self-harm to crisis contacts', () => {
    expect(screenMessage('Už nechci žít')).toBe('crisis')
    expect(screenMessage('I want to kill myself')).toBe('crisis')
  })
  it('routes acute symptoms to emergency', () => {
    expect(screenMessage('Při dřepu mě začala bolet hruď, bolest na hrudi nepřestává')).toBe('emergency')
    expect(screenMessage('chest pain when running')).toBe('emergency')
    expect(screenMessage('mám necitlivý rozkrok, necítím rozkrok')).toBe('emergency')
  })
  it('flags eating-disorder signals without blocking', () => {
    expect(screenMessage('po jídle zvracím po jídle aby se nepřibralo')).toBe('eating')
    expect(screenMessage('I use laxatives after meals')).toBe('eating')
  })
  it('leaves normal questions alone', () => {
    expect(screenMessage('Kolik bílkovin mám jíst na nabírání?')).toBeNull()
    expect(screenMessage('How do I improve my bench press?')).toBeNull()
  })
})

describe('everyday Czech phrasings', () => {
  it('catches crisis wording in natural word order', () => {
    for (const m of ['Chci se zabít', 'Řežu se', 'Sebepoškozuju se', 'Nemám pro co žít'])
      expect(screenMessage(m), m).toBe('crisis')
  })
  it('catches chest pain however it is phrased', () => {
    for (const m of [
      'Bolí mě na hrudi',
      'Tlak na hrudníku',
      'Svírá mě na hrudi',
      'Pálí mě na prsou a brní levá ruka',
    ])
      expect(screenMessage(m), m).toBe('emergency')
  })
  it('does not flag ordinary training messages', () => {
    for (const m of ['Bolí mě záda po dřepech', 'Dnes jsem dal bench 80 kg', 'Chci zhubnout do léta'])
      expect(screenMessage(m), m).toBeNull()
  })
})
