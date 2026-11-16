import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from './config'

/** Czech for everyone; English only after the user picks it in the language switch. */
export default getRequestConfig(async () => {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value
  const locale: Locale = isLocale(fromCookie) ? fromCookie : DEFAULT_LOCALE
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default }
})
