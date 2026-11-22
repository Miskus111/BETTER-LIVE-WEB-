import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

/**
 * A page's own title and description also for link previews (Facebook, WhatsApp, X…). Without it a page
 * inherits the site-wide preview from the root layout and every shared link looks like the homepage.
 */
export function withShare(
  m: Metadata & { title: string; description: string },
  path: string,
  /** the page has its own opengraph-image file — don't replace it with the site-wide one */
  { ownImage = false }: { ownImage?: boolean } = {},
): Metadata {
  return {
    ...m,
    alternates: m.alternates ?? { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: 'cs_CZ',
      title: m.title,
      description: m.description,
      url: path,
      // the site-wide preview image (setting openGraph drops the inherited one)
      ...(ownImage
        ? {}
        : { images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE.name }] }),
    },
    twitter: { card: 'summary_large_image', title: m.title, description: m.description },
  }
}
