import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { appUrl, isAppPath } from '@/lib/app-url'

/**
 * next/link for the website. Links into the app (sign-up, training, diary…) go to the app's own address as a
 * plain link: no prefetch of another site, and shared data can keep writing '/login?mode=signup'.
 */
export default function Link(props: ComponentProps<typeof NextLink>) {
  const { href } = props
  if (typeof href === 'string' && isAppPath(href)) {
    const rest: Record<string, unknown> = { ...props }
    for (const k of [
      'href',
      'prefetch',
      'replace',
      'scroll',
      'shallow',
      'passHref',
      'legacyBehavior',
      'locale',
    ])
      delete rest[k]
    return <a href={appUrl(href)} {...(rest as ComponentProps<'a'>)} />
  }
  return <NextLink {...props} />
}
