'use client'

import { useState } from 'react'
import { cx } from '@/lib/format'

/**
 * EFSA (2010) adequate intake of total water: women 2.0 l, men 2.5 l a day; +0.3 l in pregnancy,
 * +0.7 l while breastfeeding; about 20 % comes from food. Exercise: ACSM (2007) — weigh before and
 * after; each kg lost is ~1 l of sweat to replace; avoid losing more than 2 % of body weight.
 */
type Sex = 'f' | 'm'
type Extra = 'none' | 'pregnant' | 'breastfeeding'

const fmt = (l: number) => l.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })

export function WaterCalculator() {
  const [sex, setSex] = useState<Sex>('f')
  const [extra, setExtra] = useState<Extra>('none')
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')

  const base = sex === 'f' ? 2.0 : 2.5
  const add = sex === 'f' ? (extra === 'pregnant' ? 0.3 : extra === 'breastfeeding' ? 0.7 : 0) : 0
  const total = base + add
  const drinks = total * 0.8

  const b = Number(before.replace(',', '.'))
  const a = Number(after.replace(',', '.'))
  const sweat = b > 0 && a > 0 && b >= a && b - a < 6 ? b - a : null
  const lossPct = sweat !== null ? (sweat / b) * 100 : null

  const chip = (on: boolean) =>
    cx(
      'rounded-full border px-3 py-1.5 text-[13.5px]',
      on ? 'border-cyan bg-cyan/10' : 'border-line text-muted hover:text-fg',
    )

  return (
    <div className="card p-5" data-testid="water-calc">
      <h3 className="text-[18px] font-medium">Kolik vody denně potřebujete?</h3>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Pohlaví">
        <button
          type="button"
          aria-pressed={sex === 'f'}
          onClick={() => setSex('f')}
          className={chip(sex === 'f')}
        >
          Žena
        </button>
        <button
          type="button"
          aria-pressed={sex === 'm'}
          onClick={() => {
            setSex('m')
            setExtra('none')
          }}
          className={chip(sex === 'm')}
        >
          Muž
        </button>
      </div>
      {sex === 'f' && (
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Těhotenství a kojení">
          {(
            [
              ['none', 'Běžně'],
              ['pregnant', 'Těhotná'],
              ['breastfeeding', 'Kojím'],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              type="button"
              aria-pressed={extra === v}
              onClick={() => setExtra(v)}
              className={chip(extra === v)}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="border-line rounded-xl border p-3">
          <p className="text-subtle text-[12.5px]">Voda celkem za den</p>
          <p className="mt-0.5 font-mono text-[22px]" data-testid="water-total">
            {fmt(total)} l
          </p>
        </div>
        <div className="border-cyan/40 rounded-xl border p-3">
          <p className="text-subtle text-[12.5px]">Z toho vypít</p>
          <p className="mt-0.5 font-mono text-[22px]" data-testid="water-drinks">
            {fmt(drinks)} l
          </p>
          <p className="text-subtle text-[12px]">≈ {Math.round(drinks / 0.25)} sklenic po 250 ml</p>
        </div>
      </div>
      <p className="text-muted mt-2 text-[14px]">
        Zbytek (asi pětinu) dodá jídlo. Počítá se i čaj, káva, polévka a mléko — nemusí to být čistá voda.
      </p>

      <div className="border-line mt-5 rounded-xl border p-4">
        <p className="text-[15px] font-medium">Sportujete? Zvažte se před a po</p>
        <p className="text-muted mt-1 text-[14px]">
          Úbytek váhy je hlavně pot — každý kilogram odpovídá zhruba litru vody.
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-[13px]">
            <span className="text-muted block">Před (kg)</span>
            <input
              inputMode="decimal"
              value={before}
              onChange={(e) => setBefore(e.target.value)}
              className="field mt-1 !w-[110px] !py-2 font-mono"
              placeholder="72,4"
              data-testid="water-before"
            />
          </label>
          <label className="text-[13px]">
            <span className="text-muted block">Po (kg)</span>
            <input
              inputMode="decimal"
              value={after}
              onChange={(e) => setAfter(e.target.value)}
              className="field mt-1 !w-[110px] !py-2 font-mono"
              placeholder="71,6"
              data-testid="water-after"
            />
          </label>
        </div>
        {sweat !== null && lossPct !== null && (
          <p
            className={cx(
              'mt-3 rounded-lg border p-3 text-[14.5px]',
              lossPct > 2 ? 'border-warn/40 bg-warn/[0.06]' : 'border-line',
            )}
            data-testid="water-sweat"
          >
            Vypotili jste asi <strong className="font-medium">{fmt(sweat)} l</strong> ({fmt(lossPct)} %
            hmotnosti) — tolik doplňte navíc.{' '}
            {lossPct > 2
              ? 'Ztráta nad 2 % už zhoršuje výkon: příště pijte i během tréninku.'
              : 'Ztráta pod 2 % hmotnosti je v pořádku.'}
          </p>
        )}
      </div>

      <p className="text-subtle mt-3 text-[12.5px] leading-relaxed">
        Hodnoty EFSA (2010) pro dospělé v mírném klimatu a při běžné aktivitě. V horku a při sportu je potřeba
        víc; u zdravých lidí je dobrým ukazatelem žízeň a světlá moč. Při onemocnění srdce nebo ledvin se
        řiďte radou lékaře.
      </p>
    </div>
  )
}
