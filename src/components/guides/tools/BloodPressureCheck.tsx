'use client'

import { useState } from 'react'
import { cx } from '@/lib/format'

/**
 * Blood pressure categories from the 2024 ESC guidelines (McEvoy et al., Eur Heart J 2024):
 * non-elevated < 120/70, elevated 120–139 / 70–89, hypertension ≥ 140/90 mmHg.
 * The higher of the two categories (systolic vs diastolic) decides.
 */
type Cat = 'low' | 'ok' | 'elevated' | 'high' | 'severe'

function category(sys: number, dia: number): Cat {
  if (sys >= 180 || dia >= 110) return 'severe'
  if (sys >= 140 || dia >= 90) return 'high'
  if (sys >= 120 || dia >= 70) return 'elevated'
  if (sys < 90 || dia < 60) return 'low'
  return 'ok'
}

const INFO: Record<Cat, { title: string; text: string; cls: string }> = {
  low: {
    title: 'Nízký tlak',
    text: 'Pod 90/60. U řady zdravých, štíhlých lidí je to normální. Pokud se ale točí hlava, máte mžitky, omdléváte nebo je tlak nově nízký, poraďte se s lékařem.',
    cls: 'border-[#9fb6ff]/40 bg-[#9fb6ff]/[0.06]',
  },
  ok: {
    title: 'Nezvýšený tlak',
    text: 'Pod 120/70 (a nad 90/60). Stačí si tlak občas zkontrolovat — a držet zdravé návyky.',
    cls: 'border-bio/40 bg-bio/[0.05]',
  },
  elevated: {
    title: 'Zvýšený tlak',
    text: 'Mezi 120–139 / 70–89. Ještě to není nemoc, ale signál: pohyb, méně soli a alkoholu a nekouření tlak měřitelně sníží. Měřte pravidelně a řekněte o tom lékaři při prohlídce.',
    cls: 'border-warn/40 bg-warn/[0.05]',
  },
  high: {
    title: 'Hypertenze (vysoký tlak)',
    text: 'Od 140/90. Pokud to potvrdí opakovaná měření, objednejte se k praktickému lékaři — vysoký tlak se dobře léčí a léčba výrazně snižuje riziko infarktu a mrtvice.',
    cls: 'border-[#ff9b9b]/40 bg-[#ff9b9b]/[0.05]',
  },
  severe: {
    title: 'Velmi vysoký tlak',
    text: 'Od 180/110. Změřte znovu po pár minutách v klidu. Pokud zůstává takto vysoký, kontaktujte lékaře ještě dnes. Při bolesti na hrudi, dušnosti, poruše řeči, vidění nebo hybnosti volejte 155.',
    cls: 'border-[#ff6b7d]/60 bg-[#ff6b7d]/[0.08]',
  },
}

export function BloodPressureCheck() {
  const [sys, setSys] = useState(128)
  const [dia, setDia] = useState(82)
  const valid = sys >= 70 && sys <= 260 && dia >= 40 && dia <= 160 && sys > dia
  const cat = valid ? category(sys, dia) : null

  // the scale is drawn in systolic units; map the diastolic value onto it (70→120, 90→140, 110→180)
  // so the marker always sits in the band of the higher category
  const diaAsSys =
    dia < 70
      ? 90 + (dia - 50) * 1.5
      : dia < 90
        ? 120 + (dia - 70)
        : dia < 110
          ? 140 + (dia - 90) * 2
          : 180 + (dia - 110)
  const marker = Math.min(100, Math.max(0, ((Math.max(sys, diaAsSys) - 90) / 100) * 100))

  return (
    <div className="card p-5" data-testid="bp-check">
      <h3 className="text-[18px] font-medium">Co znamená vaše číslo?</h3>
      <p className="text-muted mt-1 text-[14.5px]">
        Zadejte tlak z měření — horní (systolický) a dolní (diastolický).
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-[14px]">
          <span className="text-muted block text-[13px]">Horní</span>
          <input
            type="number"
            inputMode="numeric"
            value={sys}
            onChange={(e) => setSys(Number(e.target.value))}
            className="field mt-1 !w-[110px] !py-2 font-mono text-[18px]"
            aria-label="Horní (systolický) tlak v mmHg"
            data-testid="bp-sys"
          />
        </label>
        <span className="text-subtle pb-2.5 font-mono text-[22px]">/</span>
        <label className="text-[14px]">
          <span className="text-muted block text-[13px]">Dolní</span>
          <input
            type="number"
            inputMode="numeric"
            value={dia}
            onChange={(e) => setDia(Number(e.target.value))}
            className="field mt-1 !w-[110px] !py-2 font-mono text-[18px]"
            aria-label="Dolní (diastolický) tlak v mmHg"
            data-testid="bp-dia"
          />
        </label>
        <span className="text-subtle pb-3 text-[13px]">mmHg</span>
      </div>

      <div className="mt-5" aria-hidden>
        <div className="relative h-2.5 rounded-full bg-[linear-gradient(90deg,#4ade80_0%,#4ade80_30%,#f5c46a_30%,#f5c46a_50%,#ff9b9b_50%,#ff9b9b_90%,#ff6b7d_90%)] opacity-70">
          {valid && (
            <span
              className="bg-fg absolute -top-1 h-4.5 w-1 -translate-x-1/2 rounded-full transition-all"
              style={{ left: `${marker}%` }}
            />
          )}
        </div>
        <div className="text-subtle relative mt-1 h-4 font-mono text-[11px]">
          {[
            [0, '90'],
            [30, '120'],
            [50, '140'],
            [90, '180'],
          ].map(([pos, l]) => (
            <span
              key={l}
              className="absolute -translate-x-1/2 first:translate-x-0"
              style={{ left: `${pos}%` }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {cat ? (
        <div
          className={cx('mt-4 rounded-xl border p-4', INFO[cat].cls)}
          data-testid="bp-result"
          aria-live="polite"
        >
          <p className="text-[16px] font-medium">{INFO[cat].title}</p>
          <p className="text-muted mt-1 text-[14.5px]">{INFO[cat].text}</p>
        </div>
      ) : (
        <p className="text-muted mt-4 text-[14px]">
          Zadejte prosím reálné hodnoty (horní musí být vyšší než dolní).
        </p>
      )}

      <p className="text-subtle mt-3 text-[12.5px] leading-relaxed">
        Kategorie podle doporučení Evropské kardiologické společnosti (ESC, 2024); rozhoduje vyšší z obou
        čísel. Jedno měření nic nediagnostikuje: měřte vsedě po 5 minutách klidu, paže ve výšce srdce, dvakrát
        po sobě a několik dní. Diagnózu stanoví lékař.
      </p>
    </div>
  )
}
