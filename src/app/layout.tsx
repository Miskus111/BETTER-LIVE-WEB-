import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { Providers } from '@/components/providers/Providers'
import { Analytics } from '@vercel/analytics/next'
import { SITE } from '@/lib/site'
import './globals.css'

const geist = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist' })
// mono is only used for small labels, never above-the-fold headings: don't let it compete with the LCP heading font
const geistMono = Geist_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-mono',
  preload: false,
})
const serif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // set GOOGLE_SITE_VERIFICATION on Vercel to verify the site in Google Search Console
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  applicationName: SITE.name,
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.short}` },
  description: SITE.description,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    locale: 'cs_CZ',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = { themeColor: '#07090c', colorScheme: 'dark' }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={`${geist.variable} ${geistMono.variable} ${serif.variable}`}>
      <body>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        {/* cookieless page-view counts (no personal data, no consent banner needed) */}
        <Analytics />
      </body>
    </html>
  )
}
