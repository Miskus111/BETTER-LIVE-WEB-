import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { HtmlLang } from './HtmlLang'

/**
 * Translations for the app, login and onboarding only. The public site is Czech and must not read the
 * language cookie — that would make every public page dynamic (no CDN cache).
 */
export async function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <NextIntlClientProvider>
      <HtmlLang locale={locale} />
      {children}
    </NextIntlClientProvider>
  )
}
