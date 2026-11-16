import { FlaskConical, ThermometerSun } from 'lucide-react'
import { FERMENTATION } from '@/data/fermentation'

export function FermentationExplainer() {
  return (
    <section className="card p-5" aria-labelledby="ferment-title">
      <div className="text-cyan flex items-center gap-2">
        <FlaskConical size={16} aria-hidden />
        <h3 id="ferment-title" className="eyebrow">
          Fermentation, decoded
        </h3>
      </div>
      <p className="text-fg/90 mt-3 text-[14.5px]">{FERMENTATION.intro}</p>
      <dl className="mt-4 grid gap-3">
        {FERMENTATION.terms.map((t, i) => (
          <div key={t.term} className="border-line rounded-xl border bg-white/[0.02] p-3.5">
            <dt className="flex items-center gap-2 font-medium">
              <span className="text-subtle font-mono text-[12px]">0{i + 1}</span>
              {t.term}
            </dt>
            <dd className="text-muted mt-1 text-[14px]">{t.def}</dd>
          </div>
        ))}
      </dl>
      <p className="border-warn/25 bg-warn/[0.05] text-fg/90 mt-4 flex gap-2 rounded-xl border p-3.5 text-[14px]">
        <ThermometerSun size={16} className="text-warn mt-0.5 shrink-0" aria-hidden />
        <span>{FERMENTATION.heat}</span>
      </p>
      <p className="text-subtle mt-3 text-[13px]">{FERMENTATION.claim}</p>
    </section>
  )
}
