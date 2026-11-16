'use client'

import { useTranslations } from 'next-intl'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

/** Weekly working sets per muscle (secondary muscles count half). 10–20 sets/week is a common hypertrophy range. */
export function MuscleSetsChart({ data }: { data: Record<string, number> }) {
  const m = useTranslations('muscles')
  const rows = Object.entries(data)
    .map(([k, v]) => ({ muscle: m(k), sets: v }))
    .sort((a, b) => b.sets - a.sets)
  if (!rows.length) return null
  return (
    <div style={{ height: Math.max(160, rows.length * 28) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" stroke="#7f8e9c" fontSize={12} allowDecimals />
          <YAxis type="category" dataKey="muscle" stroke="#a3b0bd" fontSize={12.5} width={130} />
          <Tooltip
            contentStyle={{
              background: '#10161d',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
            }}
          />
          <Bar dataKey="sets" fill="#5ee7ff" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
