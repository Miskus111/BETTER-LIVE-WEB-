export const SHIPPING_FEE = 99
export const FREE_SHIPPING_FROM = 1200

export function quoteTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
  return { subtotal, shipping, total: +(subtotal + shipping).toFixed(2) }
}
