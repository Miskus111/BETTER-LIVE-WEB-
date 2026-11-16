import { czk } from '@/lib/format'
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
    <dl className="grid grid-cols-1 gap-2 text-[14.5px]">
      <div className="flex justify-between">
        <dt className="text-muted">Mezisoučet</dt>
        <dd className="font-mono" data-testid="subtotal">
          {czk(subtotal)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">
          Doprava{' '}
          <span className="text-subtle text-[12.5px]">
            ({czk(SHIPPING_FEE)}, od {czk(FREE_SHIPPING_FROM)} zdarma)
          </span>
        </dt>
        <dd className="font-mono">{shipping === 0 ? 'Zdarma' : czk(shipping)}</dd>
      </div>
      <div className="border-line mt-1 flex justify-between border-t pt-3 text-[16px] font-medium">
        <dt>Celkem</dt>
        <dd className="font-mono" data-testid="total">
          {czk(total)}
        </dd>
      </div>
    </dl>
  )
}
