'use client'

import { useState } from 'react'
import { Barcode, ExternalLink } from 'lucide-react'
import { fmtAmount } from '@/lib/nutrition'

/** Open Food Facts nutriments we show (all per 100 g / 100 ml). */
const FIELDS: [key: string, label: string, unit: string][] = [
  ['energy-kcal_100g', 'Energie', 'kcal'],
  ['proteins_100g', 'Bílkoviny', 'g'],
  ['fat_100g', 'Tuky', 'g'],
  ['saturated-fat_100g', 'z toho nasycené', 'g'],
  ['carbohydrates_100g', 'Sacharidy', 'g'],
  ['sugars_100g', 'z toho cukry', 'g'],
  ['fiber_100g', 'Vláknina', 'g'],
  ['salt_100g', 'Sůl', 'g'],
]

interface OffProduct {
  code: string
  product_name?: string
  brands?: string
  quantity?: string
  nutriments?: Record<string, number | string | undefined>
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'found'; product: OffProduct }

export const isValidEan = (code: string) => /^\d{8}$|^\d{12,14}$/.test(code)

/**
 * Branded products by barcode from Open Food Facts (ODbL). Values are user-contributed and unverified,
 * shown per 100 g exactly as published; a missing value is "bez údajů". The lookup goes straight from the
 * browser to Open Food Facts — nothing is stored by us.
 */
export function BarcodeLookup() {
  const [code, setCode] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault()
    const ean = code.replace(/\s/g, '')
    if (!isValidEan(ean)) {
      setState({ kind: 'error', message: 'Zadejte čárový kód (EAN) — 8 nebo 13 číslic.' })
      return
    }
    setState({ kind: 'loading' })
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${ean}.json?fields=code,product_name,brands,quantity,nutriments`,
      )
      const data = (await res.json()) as { status: number; product?: OffProduct }
      if (data.status !== 1 || !data.product)
        setState({ kind: 'error', message: 'Výrobek v Open Food Facts nebyl nalezen.' })
      else setState({ kind: 'found', product: data.product })
    } catch {
      setState({ kind: 'error', message: 'Open Food Facts teď neodpovídá. Zkuste to později.' })
    }
  }

  return (
    <section className="card mt-6 p-5" aria-labelledby="barcode" data-testid="barcode-lookup">
      <h3 id="barcode" className="flex items-center gap-2 text-[17px] font-medium">
        <Barcode size={18} className="text-cyan" aria-hidden /> Balený výrobek podle čárového kódu
      </h3>
      <p className="text-muted mt-1 text-[14px]">
        Údaje z etiket sdílí komunita Open Food Facts. Jsou užitečné pro konkrétní značku, ale nejsou ověřené.
      </p>
      <form onSubmit={lookup} className="mt-3 flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Čárový kód (EAN)</span>
          <input
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="např. 3017620422003"
            className="field"
            data-testid="barcode-input"
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={state.kind === 'loading'}>
          {state.kind === 'loading' ? 'Hledám…' : 'Vyhledat'}
        </button>
      </form>

      {state.kind === 'error' && <p className="text-warn mt-3 text-[14px]">{state.message}</p>}
      {state.kind === 'found' && (
        <div className="mt-4" data-testid="barcode-result">
          <p className="text-[15.5px] font-medium">
            {state.product.product_name || 'Výrobek bez názvu'}
            {state.product.brands && (
              <span className="text-muted font-normal"> · {state.product.brands}</span>
            )}
          </p>
          <p className="text-subtle font-mono text-[12px]">
            EAN {state.product.code}
            {state.product.quantity && ` · ${state.product.quantity}`} · na 100 g / 100 ml
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[14px] sm:grid-cols-4">
            {FIELDS.map(([key, label, unit]) => {
              const raw = state.product.nutriments?.[key]
              const v =
                typeof raw === 'number' ? raw : typeof raw === 'string' && raw !== '' ? Number(raw) : null
              return (
                <div key={key}>
                  <dt className="text-subtle text-[12px]">{label}</dt>
                  <dd className="font-mono">
                    {v === null || Number.isNaN(v) ? (
                      <span className="text-subtle">bez údajů</span>
                    ) : (
                      fmtAmount(v, unit)
                    )}
                  </dd>
                </div>
              )
            })}
          </dl>
          <p className="text-subtle mt-3 text-[12px]">
            Data:{' '}
            <a
              className="link inline-flex items-center gap-1"
              href={`https://world.openfoodfacts.org/product/${state.product.code}`}
              target="_blank"
              rel="noopener"
            >
              Open Food Facts <ExternalLink size={11} aria-hidden />
            </a>{' '}
            (licence ODbL), uživatelsky přidaná a neověřená. Vždy platí údaje na obalu.
          </p>
        </div>
      )}
    </section>
  )
}
