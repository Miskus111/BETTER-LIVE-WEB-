export const SHIPPING_FEE = 4.9
export const FREE_SHIPPING_FROM = 49

export function quoteTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
  return { subtotal, shipping, total: +(subtotal + shipping).toFixed(2) }
}
