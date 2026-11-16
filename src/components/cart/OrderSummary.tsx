import { eur } from '@/lib/format'
import { FREE_SHIPPING_FROM, SHIPPING_FEE } from '@/lib/commerce/pricing'

export function OrderSummary({
  subtotal,
  shipping,
  total,
}: {
  subtotal: number
  shipping: number
  total: number
}) {
  return (
    <dl className="grid gap-2 text-[14.5px]">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="font-mono" data-testid="subtotal">
          {eur(subtotal)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">
          Shipping{' '}
          <span className="text-subtle text-[12.5px]">
            ({eur(SHIPPING_FEE)}, free from {eur(FREE_SHIPPING_FROM)})
          </span>
        </dt>
        <dd className="font-mono">{shipping === 0 ? 'Free' : eur(shipping)}</dd>
      </div>
      <div className="border-line mt-1 flex justify-between border-t pt-3 text-[16px] font-medium">
        <dt>Total</dt>
        <dd className="font-mono" data-testid="total">
          {eur(total)}
        </dd>
      </div>
    </dl>
  )
}
