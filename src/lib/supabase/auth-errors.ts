/** Supabase auth error codes we explain in the user's language; anything else gets the generic message. */
const KNOWN = {
  user_already_exists: 'errUserExists',
  email_exists: 'errUserExists',
  weak_password: 'errWeakPassword',
  same_password: 'errSamePassword',
  email_address_invalid: 'errEmailInvalid',
  over_email_send_rate_limit: 'errRateLimit',
  over_request_rate_limit: 'errRateLimit',
  signup_disabled: 'errSignupDisabled',
} as const

export type AuthErrorKey = (typeof KNOWN)[keyof typeof KNOWN]

export function authErrorKey(error: { code?: string } | null | undefined): AuthErrorKey | null {
  const code = error?.code
  return code && code in KNOWN ? KNOWN[code as keyof typeof KNOWN] : null
}
