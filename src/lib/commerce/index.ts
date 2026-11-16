import { mockCommerce } from './mock'
import type { CommerceProvider } from './types'

/**
 * Swap this for a Stripe / Shopify implementation of CommerceProvider.
 * e.g. `export const commerce = process.env.NEXT_PUBLIC_COMMERCE === 'shopify' ? shopifyCommerce : mockCommerce`
 */
export const commerce: CommerceProvider = mockCommerce
export * from './types'
export * from './pricing'
