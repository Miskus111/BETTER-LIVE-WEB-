import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { Toaster } from '@/components/layout/Toaster'
import { SITE } from '@/lib/site'
import './globals.css'

const geist = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-geist-mono' })
const serif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" className={`${geist.variable} ${geistMono.variable} ${serif.variable}`}>
      <body>
        <a
          href="#main"
          className="bg-cyan text-ink sr-only z-[80] rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Přeskočit na obsah
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <CommandPalette />
        <Toaster />
      </body>
    </html>
  )
}
