import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from './config'

/** Locale from cookie (set by the language switch), else Czech. No locale in the URL. */
export default getRequestConfig(async () => {
  const store = await cookies()
  const fromCookie = store.get(LOCALE_COOKIE)?.value
  let locale: Locale = DEFAULT_LOCALE
  if (isLocale(fromCookie)) locale = fromCookie
  else {
    // first visit: Czech unless the browser clearly prefers English and not Czech/Slovak
    const accept = (await headers()).get('accept-language') ?? ''
    if (/^en\b/i.test(accept) && !/\b(cs|sk)\b/i.test(accept)) locale = 'en'
  }
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default }
})
