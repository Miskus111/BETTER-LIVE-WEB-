export const LOCALES = ['cs', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'cs'
export const LOCALE_COOKIE = 'blwb-locale'
export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale)
