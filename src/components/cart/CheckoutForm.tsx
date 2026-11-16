'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2, Loader2, Lock } from 'lucide-react'
import { PRODUCT_BY_ID } from '@/data/products'
import { commerce, type Address, type Order } from '@/lib/commerce'
import { useCart } from '@/lib/store/cart'
import { useCartTotals } from '@/lib/store/useCartTotals'
import { useHydrated } from '@/lib/useHydrated'
import { eur } from '@/lib/format'
import { OrderSummary } from './OrderSummary'

type Errors = Partial<Record<keyof Address, string>>

const FIELDS: { key: keyof Address; label: string; type?: string; autoComplete: string; span?: boolean }[] = [
  { key: 'name', label: 'Full name', autoComplete: 'name', span: true },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', span: true },
  { key: 'street', label: 'Street and number', autoComplete: 'street-address', span: true },
  { key: 'postcode', label: 'Postcode', autoComplete: 'postal-code' },
  { key: 'city', label: 'City', autoComplete: 'address-level2' },
]

const COUNTRIES = [
  'Austria',
  'Belgium',
  'Czechia',
  'Denmark',
  'France',
  'Germany',
  'Ireland',
  'Italy',
  'Netherlands',
  'Poland',
  'Slovakia',
  'Spain',
]

export function validate(a: Address): Errors {
  const e: Errors = {}
  if (a.name.trim().length < 2) e.name = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email.trim())) e.email = 'Enter a valid email address.'
  if (a.street.trim().length < 3) e.street = 'Enter your street and house number.'
  if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(a.postcode.trim())) e.postcode = 'Enter a valid postcode.'
  if (a.city.trim().length < 2) e.city = 'Enter your city.'
  if (!COUNTRIES.includes(a.country)) e.country = 'Choose a country.'
  return e
}

export function CheckoutForm() {
  const hydrated = useHydrated()
  const { items, subtotal, shipping, total } = useCartTotals()
  const clear = useCart((s) => s.clear)
  const [form, setForm] = useState<Address>({
    name: '',
    email: '',
    street: '',
    city: '',
    postcode: '',
    country: 'Czechia',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Address, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [order, setOrder] = useState<Order | null>(null)

  if (!hydrated) return <div className="h-96" aria-busy="true" />

  if (order) return <Confirmation order={order} />

  if (!items.length)
    return (
      <div className="card p-10 text-center">
        <p className="text-[17px]">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-5">
          Browse the store
        </Link>
      </div>
    )

  const set = (k: keyof Address, v: string) => {
    const next = { ...form, [k]: v }
    setForm(next)
    if (touched[k]) setErrors(validate(next))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    setTouched({ name: true, email: true, street: true, city: true, postcode: true, country: true })
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setStatus('submitting')
    try {
      const o = await commerce.createOrder({
        address: form,
        lines: items.map((i) => ({ productId: i.id, qty: i.qty, unitPrice: i.product.price })),
      })
      setOrder(o)
      clear()
      window.scrollTo({ top: 0 })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <form
        onSubmit={submit}
        noValidate
        className="card p-5 md:p-7"
        aria-describedby="demo-note"
        data-testid="checkout-form"
      >
        <p
          id="demo-note"
          className="border-warn/30 bg-warn/[0.06] mb-6 flex items-start gap-2 rounded-xl border p-3.5 text-[14px]"
        >
          <Lock size={15} className="text-warn mt-0.5 shrink-0" aria-hidden />
          <span>
            <strong className="font-medium">Demo checkout.</strong> No payment is taken and nothing will be
            shipped. Please do not enter real personal data.
          </span>
        </p>
        <fieldset>
          <legend className="eyebrow mb-4">Delivery details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.span ? 'sm:col-span-2' : undefined}>
                <label htmlFor={`f-${f.key}`} className="text-muted mb-1.5 block text-[14px]">
                  {f.label}
                </label>
                <input
                  id={`f-${f.key}`}
                  name={f.key}
                  type={f.type ?? 'text'}
                  autoComplete={f.autoComplete}
                  value={form[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, [f.key]: true }))
                    setErrors(validate(form))
                  }}
                  aria-invalid={!!(touched[f.key] && errors[f.key])}
                  aria-describedby={touched[f.key] && errors[f.key] ? `e-${f.key}` : undefined}
                  className="field"
                  required
                />
                {touched[f.key] && errors[f.key] && (
                  <p id={`e-${f.key}`} className="mt-1.5 text-[13px] text-[#ff9b9b]">
                    {errors[f.key]}
                  </p>
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label htmlFor="f-country" className="text-muted mb-1.5 block text-[14px]">
                Country
              </label>
              <select
                id="f-country"
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
                className="field"
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="eyebrow mb-3">Payment</legend>
          <p className="border-line text-muted rounded-xl border p-4 text-[14px]">
            Payment is disabled in this prototype. A payment provider (e.g. Stripe or Shopify Checkout) plugs
            in via <code className="text-fg font-mono text-[13px]">src/lib/commerce</code>.
          </p>
        </fieldset>

        {status === 'error' && (
          <p role="alert" className="mt-5 text-[14px] text-[#ff9b9b]">
            Something went wrong placing the demo order. Please try again.
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-7 w-full"
          disabled={status === 'submitting'}
          data-testid="place-order"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden /> Placing demo order…
            </>
          ) : (
            `Place demo order · ${eur(total)}`
          )}
        </button>
      </form>

      <aside className="card h-fit p-5 lg:sticky lg:top-20" aria-label="Order summary">
        <h2 className="eyebrow mb-4">Your order</h2>
        <ul className="mb-5 space-y-2 text-[14px]">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">
                {i.qty} × {i.product.name}
              </span>
              <span className="font-mono">{eur(i.qty * i.product.price)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
        <Link href="/cart" className="link mt-4 inline-block text-[13.5px]">
          Edit cart
        </Link>
      </aside>
    </div>
  )
}

function Confirmation({ order }: { order: Order }) {
  return (
    <div className="card fade-up mx-auto max-w-xl p-8 text-center" data-testid="order-confirmation">
      <CheckCircle2 size={40} className="text-cyan mx-auto" aria-hidden />
      <h2 className="display mt-4 text-[38px]">Demo order placed</h2>
      <p className="text-muted mt-2">
        Thank you, {order.address.name.split(' ')[0]}. This was a demonstration — no payment was taken.
      </p>
      <p className="text-subtle mt-6 font-mono text-[13px]">Order number</p>
      <p className="text-cyan font-mono text-[22px] tracking-wider" data-testid="order-number">
        {order.id}
      </p>
      <dl className="mx-auto mt-6 grid max-w-xs gap-1.5 text-left text-[14px]">
        {order.lines.map((l) => (
          <div key={l.productId} className="flex justify-between">
            <dt className="text-muted">
              {l.qty} × {PRODUCT_BY_ID[l.productId]?.name ?? l.productId}
            </dt>
            <dd className="font-mono">{eur(l.qty * l.unitPrice)}</dd>
          </div>
        ))}
        <div className="border-line mt-2 flex justify-between border-t pt-2 font-medium">
          <dt>Total</dt>
          <dd className="font-mono">{eur(order.total)}</dd>
        </div>
      </dl>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-primary">
          Continue shopping
        </Link>
        <Link href="/" className="btn btn-ghost">
          Back to the body
        </Link>
      </div>
    </div>
  )
}
