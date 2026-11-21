import { describe, expect, it } from 'vitest'
import cs from '../../../messages/cs.json'
import { authErrorKey } from './auth-errors'

describe('authErrorKey', () => {
  it('maps known Supabase codes to translated messages', () => {
    expect(authErrorKey({ code: 'user_already_exists' })).toBe('errUserExists')
    expect(authErrorKey({ code: 'weak_password' })).toBe('errWeakPassword')
    expect(authErrorKey({ code: 'over_email_send_rate_limit' })).toBe('errRateLimit')
  })
  it('returns null for unknown or missing codes', () => {
    expect(authErrorKey({ code: 'something_new' })).toBeNull()
    expect(authErrorKey({})).toBeNull()
    expect(authErrorKey(null)).toBeNull()
  })
  it('every key has a Czech text', () => {
    for (const code of [
      'user_already_exists',
      'weak_password',
      'same_password',
      'email_address_invalid',
      'over_request_rate_limit',
      'signup_disabled',
    ])
      expect((cs.auth as Record<string, string>)[authErrorKey({ code })!]).toBeTruthy()
  })
})
