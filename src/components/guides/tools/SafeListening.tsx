'use client'

import { useState } from 'react'
import { cx } from '@/lib/format'

/**
 * WHO safe listening: 80 dB for up to 40 h a week; 90 dB only 4 h. Equal-energy rule —
 * every +3 dB halves the safe time (40 h · 0.5^((dB − 80) / 3) reproduces both WHO numbers).
 */
const PRESETS = [
  { db: 60, label: 'Běžný rozhovor' },
  { db: 80, label: 'Hlasitá hudba v pokoji' },
  { db: 85, label: 'Hustý provoz' },
  { db: 94, label: 'Sluchátka v MHD, nahlas' },
  { db: 100, label: 'Sluchátka na maximum' },
  { db: 105, label: 'Koncert, klub' },
]

const safeHoursPerWeek = (db: number) => (db <= 80 ? 40 : 40 * Math.pow(0.5, (db - 80) / 3))

function fmtDuration(h: number) {
  if (h >= 40) return '40 h a víc'
  if (h >= 2) return `${h.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} h`
  const min = h * 60
  if (min >= 1) return `${Math.round(min)} min`
  return `${Math.max(1, Math.round(min * 60))} s`
}

export function SafeListening() {
  const [db, setDb] = useState(94)
  const week = safeHoursPerWeek(db)
  const day = week / 7
  const level = db <= 80 ? 'ok' : db <= 90 ? 'care' : 'risk'

  return (
    <div className="card p-5" data-testid="safe-listening">
      <h3 className="text-[18px] font-medium">Jak dlouho je hlasitost bezpečná?</h3>
      <p className="text-muted mt-1 text-[14.5px]">
        Vyberte, jak hlasitě posloucháte. Spočítáme týdenní „příděl“ podle WHO.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.db}
            type="button"
            aria-pressed={db === p.db}
            onClick={() => setDb(p.db)}
            className={cx(
              'rounded-full border px-3 py-1.5 text-[13px]',
              db === p.db ? 'border-cyan bg-cyan/10' : 'border-line text-muted hover:text-fg',
            )}
          >
            {p.label} <span className="text-subtle font-mono">~{p.db} dB</span>
          </button>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="flex items-baseline justify-between text-[14px]">
          <span className="text-muted">Hlasitost</span>
          <span className="font-mono text-[20px]">{db} dB</span>
        </span>
        <input
          type="range"
          min={60}
          max={110}
          value={db}
          onChange={(e) => setDb(Number(e.target.value))}
          className="mt-2 w-full accent-[#5ee7ff]"
          aria-label="Hlasitost v decibelech"
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div
          className={cx(
            'rounded-xl border p-3',
            level === 'ok' ? 'border-bio/40' : level === 'care' ? 'border-warn/40' : 'border-[#ff9b9b]/40',
          )}
          data-testid="safe-week"
        >
          <p className="text-subtle text-[12.5px]">Bezpečně za týden</p>
          <p className="mt-0.5 font-mono text-[22px]">{fmtDuration(week)}</p>
        </div>
        <div className="border-line rounded-xl border p-3">
          <p className="text-subtle text-[12.5px]">To je denně</p>
          <p className="mt-0.5 font-mono text-[22px]">{fmtDuration(day)}</p>
        </div>
      </div>

      <p className="text-subtle mt-3 text-[12.5px] leading-relaxed">
        WHO: 80 dB lze bezpečně poslouchat až 40 hodin týdně, při 90 dB jen 4 hodiny — každé 3 dB navíc zkrátí
        čas na polovinu. Úrovně u příkladů jsou orientační. Skutečnou hlasitost ve sluchátkách umí změřit
        iPhone (aplikace Zdraví) i řada telefonů s Androidem (nastavení bezpečného poslechu). Rada WHO:
        hlasitost nejvýš na 60 %.
      </p>
    </div>
  )
}
