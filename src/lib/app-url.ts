/**
 * The app (sign-in, training, food diary, AI coach) is its own project (BETTER-LIVE-WITH-BIOHACKIN-APP-).
 * The website links to it; set NEXT_PUBLIC_APP_URL on Vercel to the app's address.
 */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://better-live-app.vercel.app').replace(
  /\/$/,
  '',
)

/** Paths served by the app (keep in sync with APP_PATHS in next.config.ts). */
const APP =
  /^\/(login|today|train|eat|body|coach|labs|mobility|looks|supplements|settings|onboarding|store|reset-password)(\/|\?|#|$)/

export const isAppPath = (href: string) => APP.test(href)

/** Absolute URL of a page in the app. */
export const appUrl = (path: string) => `${APP_URL}${path.startsWith('/') ? path : `/${path}`}`
