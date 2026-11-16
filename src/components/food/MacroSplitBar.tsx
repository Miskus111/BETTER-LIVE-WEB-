import { energySplit } from '@/lib/nutrition'

const PARTS = [
  { key: 'protein', label: 'Bílkoviny', color: '#5ee7ff' },
  { key: 'fat', label: 'Tuky', color: '#f5c46a' },
  { key: 'carbs', label: 'Sacharidy', color: '#a5beff' },
] as const

/** Share of energy from protein, fat and carbohydrate. */
export function MacroSplitBar({
  macros,
}: {
  macros: { protein: number; fat: number; carbs: number; fiber: number }
}) {
  const split = energySplit(macros)
  return (
    <div>
      <p className="eyebrow mb-2">Podíl energie</p>
      <div
        className="flex h-2.5 overflow-hidden rounded-full bg-white/[0.06]"
        role="img"
        aria-label={PARTS.map((p) => `${p.label} ${Math.round(split[p.key] * 100)}%`).join(', ')}
      >
        {PARTS.map((p) => (
          <div key={p.key} style={{ width: `${split[p.key] * 100}%`, background: p.color }} />
        ))}
      </div>
      <ul className="text-muted mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12.5px]">
        {PARTS.map((p) => (
          <li key={p.key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden />
            {p.label} {Math.round(split[p.key] * 100)}%
          </li>
        ))}
      </ul>
    </div>
  )
}
