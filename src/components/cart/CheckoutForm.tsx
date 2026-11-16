'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2, Loader2, Lock } from 'lucide-react'
import { PRODUCT_BY_ID } from '@/data/products'
import { commerce, type Address, type Order } from '@/lib/commerce'
import { useCart } from '@/lib/store/cart'
import { useCartTotals } from '@/lib/store/useCartTotals'
import { useHydrated } from '@/lib/useHydrated'
import { czk } from '@/lib/format'
import { OrderSummary } from './OrderSummary'

type Errors = Partial<Record<keyof Address, string>>

const FIELDS: { key: keyof Address; label: string; type?: string; autoComplete: string; span?: boolean }[] = [
  { key: 'name', label: 'Jméno a příjmení', autoComplete: 'name', span: true },
  { key: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', span: true },
  { key: 'street', label: 'Ulice a číslo popisné', autoComplete: 'street-address', span: true },
  { key: 'postcode', label: 'PSČ', autoComplete: 'postal-code' },
  { key: 'city', label: 'Město', autoComplete: 'address-level2' },
]

const COUNTRIES = [
  'Česko',
  'Slovensko',
  'Rakousko',
  'Německo',
  'Polsko',
  'Maďarsko',
  'Belgie',
  'Dánsko',
  'Francie',
  'Irsko',
  'Itálie',
  'Nizozemsko',
  'Španělsko',
]

export function validate(a: Address): Errors {
  const e: Errors = {}
  if (a.name.trim().length < 2) e.name = 'Zadejte jméno a příjmení.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email.trim())) e.email = 'Zadejte platný e-mail.'
  if (a.street.trim().length < 3) e.street = 'Zadejte ulici a číslo popisné.'
  if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(a.postcode.trim())) e.postcode = 'Zadejte platné PSČ.'
  if (a.city.trim().length < 2) e.city = 'Zadejte město.'
  if (!COUNTRIES.includes(a.country)) e.country = 'Vyberte zemi.'
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
    country: 'Česko',
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
        <p className="text-[17px]">Košík je prázdný.</p>
        <Link href="/shop" className="btn btn-primary mt-5">
          Procházet obchod
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
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
            <strong className="font-medium">Ukázková pokladna.</strong> Nic se neplatí ani neodesílá.
            Nezadávejte prosím skutečné osobní údaje.
          </span>
        </p>
        <fieldset className="min-w-0">
          <legend className="eyebrow mb-4">Doručovací údaje</legend>
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
                Země
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

        <fieldset className="mt-8 min-w-0">
          <legend className="eyebrow mb-3">Platba</legend>
          <p className="border-line text-muted rounded-xl border p-4 text-[14px]">
            Platba je v tomto prototypu vypnutá. Platební bránu (např. Stripe nebo Shopify Checkout) lze
            připojit přes <code className="text-fg font-mono text-[13px]">src/lib/commerce</code>.
          </p>
        </fieldset>

        {status === 'error' && (
          <p role="alert" className="mt-5 text-[14px] text-[#ff9b9b]">
            Ukázkovou objednávku se nepodařilo odeslat. Zkuste to prosím znovu.
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
              <Loader2 size={16} className="animate-spin" aria-hidden /> Odesílám ukázkovou objednávku…
            </>
          ) : (
            `Odeslat ukázkovou objednávku · ${czk(total)}`
          )}
        </button>
      </form>

      <aside className="card h-fit p-5 lg:sticky lg:top-20" aria-label="Souhrn objednávky">
        <h2 className="eyebrow mb-4">Vaše objednávka</h2>
        <ul className="mb-5 space-y-2 text-[14px]">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">
                {i.qty} × {i.product.name}
              </span>
              <span className="font-mono">{czk(i.qty * i.product.price)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
        <Link href="/cart" className="link mt-4 inline-block text-[13.5px]">
          Upravit košík
        </Link>
      </aside>
    </div>
  )
}

function Confirmation({ order }: { order: Order }) {
  return (
    <div className="card fade-up mx-auto max-w-xl p-8 text-center" data-testid="order-confirmation">
      <CheckCircle2 size={40} className="text-cyan mx-auto" aria-hidden />
      <h2 className="display mt-4 text-[38px]">Ukázková objednávka odeslána</h2>
      <p className="text-muted mt-2">
        Děkujeme, {order.address.name.split(' ')[0]}. Šlo jen o ukázku — nic se nezaplatilo.
      </p>
      <p className="text-subtle mt-6 font-mono text-[13px]">Číslo objednávky</p>
      <p className="text-cyan font-mono text-[22px] tracking-wider" data-testid="order-number">
        {order.id}
      </p>
      <dl className="mx-auto mt-6 grid max-w-xs gap-1.5 text-left text-[14px]">
        {order.lines.map((l) => (
          <div key={l.productId} className="flex justify-between">
            <dt className="text-muted">
              {l.qty} × {PRODUCT_BY_ID[l.productId]?.name ?? l.productId}
            </dt>
            <dd className="font-mono">{czk(l.qty * l.unitPrice)}</dd>
          </div>
        ))}
        <div className="border-line mt-2 flex justify-between border-t pt-2 font-medium">
          <dt>Celkem</dt>
          <dd className="font-mono">{czk(order.total)}</dd>
        </div>
      </dl>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-primary">
          Pokračovat v nákupu
        </Link>
        <Link href="/" className="btn btn-ghost">
          Zpět na tělo
        </Link>
      </div>
    </div>
  )
}
