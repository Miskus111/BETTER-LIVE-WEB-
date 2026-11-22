import { JsonLd } from './JsonLd'
import { SITE } from '@/lib/site'

/** Breadcrumb for search engines (schema.org BreadcrumbList); "Domů" is added in front. */
export function BreadcrumbLd({ items }: { items: [name: string, path: string][] }) {
  const all: [string, string][] = [['Domů', '/'], ...items]
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: all.map(([name, path], i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name,
          item: path === '/' ? SITE.url : `${SITE.url}${path}`,
        })),
      }}
    />
  )
}
