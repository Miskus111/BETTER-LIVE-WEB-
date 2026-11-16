/**
 * Commerce provider interface. The app talks only to this interface, so a real backend
 * (Stripe Checkout, Shopify Storefront API, …) can replace the mock without touching UI code.
 */
export interface CheckoutLine {
  productId: string
  qty: number
  unitPrice: number
}

export interface Address {
  name: string
  email: string
  street: string
  city: string
  postcode: string
  country: string
}

export interface OrderInput {
  lines: CheckoutLine[]
  address: Address
}

export interface Order {
  id: string
  createdAt: string
  lines: CheckoutLine[]
  subtotal: number
  shipping: number
  total: number
  address: Address
  /** 'demo' orders are never charged or fulfilled */
  mode: 'demo' | 'live'
}

export interface CommerceProvider {
  name: string
  quote(lines: CheckoutLine[]): { subtotal: number; shipping: number; total: number }
  createOrder(input: OrderInput): Promise<Order>
}
