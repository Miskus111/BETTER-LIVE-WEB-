import { NUTRIENTS } from '@/data/nutrients'
import { REFERENCE } from '@/data/reference'
import type { NutrientId } from '@/data/types'
import { cx } from '@/lib/format'

/** RHP (etiketa) vs. doporučení EFSA vs. horní bezpečný limit — tři čísla, která se často pletou. */
export function ReferenceValues({ id, className }: { id: NutrientId; className?: string }) {
  const n = NUTRIENTS[id]
  const r = REFERENCE[id]
  const rhp = n.ref?.kind === 'RHP' ? `${n.ref.value.toLocaleString('cs-CZ')} ${n.unit}` : '—'
  const cells = [
    { k: 'RHP (etiketa)', v: rhp, hint: 'Jedno číslo pro „% RHP“ na obalech v EU.' },
    {
      k: r?.efsa ? `Doporučení EFSA (${r.efsa.kind})` : 'Doporučení EFSA',
      v: r?.efsa?.text ?? '—',
      hint:
        r?.efsa?.note ??
        (r?.efsa?.kind === 'AI'
          ? 'Adekvátní příjem — data na přesné doporučení nestačí.'
          : 'Pokryje potřebu ~97,5 % dospělých.'),
    },
    {
      k: 'Horní limit (UL)',
      v: r?.ul?.text ?? '—',
      hint: r?.ul?.note ?? 'Nejvyšší dlouhodobý denní příjem ze všech zdrojů bez rizika.',
    },
  ]
  return (
    <dl className={cx('grid grid-cols-1 gap-2 sm:grid-cols-3', className)}>
      {cells.map((c, i) => (
        <div
          key={c.k}
          className={cx(
            'rounded-xl border p-3.5',
            i === 2 && r?.ul ? 'border-warn/25 bg-warn/[0.04]' : 'border-line',
          )}
        >
          <dt className="text-subtle font-mono text-[12px]">{c.k}</dt>
          <dd className="mt-1 text-[15px] font-medium">{c.v}</dd>
          <dd className="text-subtle mt-1 text-[12.5px] leading-snug">{c.hint}</dd>
        </div>
      ))}
    </dl>
  )
}
