import { quoteTotals } from './pricing'
import type { CommerceProvider, Order } from './types'

/** Demo provider: validates and returns an order with a demo number. No payment, nothing is shipped. */
export const mockCommerce: CommerceProvider = {
  name: 'mock',
  quote(lines) {
    return quoteTotals(+lines.reduce((s, l) => s + l.unitPrice * l.qty, 0).toFixed(2))
  },
  async createOrder({ lines, address }) {
    if (!lines.length) throw new Error('Cart is empty')
    await new Promise((r) => setTimeout(r, 650)) // simulate network
    const { subtotal, shipping, total } = this.quote(lines)
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
    const order: Order = {
      id: `FLX-DEMO-${rand}`,
      createdAt: new Date().toISOString(),
      lines,
      subtotal,
      shipping,
      total,
      address,
      mode: 'demo',
    }
    return order
  },
}
