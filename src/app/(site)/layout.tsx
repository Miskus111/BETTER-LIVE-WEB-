import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'

/** Public, indexable educational pages (anatomy, foods, supplements, looksmaxing, science). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="bg-cyan text-ink sr-only z-[80] rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Přeskočit na obsah
      </a>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE.name,
            alternateName: SITE.short,
            url: SITE.url,
            logo: `${SITE.url}/pwa-icon/512`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE.name,
            url: SITE.url,
            inLanguage: 'cs',
            description: SITE.description,
          },
        ]}
      />
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <CommandPalette />
    </>
  )
}
