'use client'

import { useTranslations } from 'next-intl'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const COLORS = ['#5ee7ff', '#ff7d8b', '#f5c46a', '#8fd16a', '#a5beff', '#ffcf70', '#b49cff', '#e39a6b']

export function PainChart({
  reports,
}: {
  reports: { region: string; score: number; reported_at: string }[]
}) {
  const t = useTranslations('mob')
  const regions = [...new Set(reports.map((r) => r.region))]
  if (!reports.length) return <p className="text-muted">{t('noReports')}</p>
  const days = [...new Set(reports.map((r) => r.reported_at.slice(0, 10)))].sort()
  const data = days.map((d) => {
    const row: Record<string, number | string> = { day: d.slice(5) }
    for (const r of reports.filter((x) => x.reported_at.startsWith(d))) row[r.region] = r.score
    return row
  })
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -16, right: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="day" stroke="#7f8e9c" fontSize={12} />
          <YAxis domain={[0, 10]} stroke="#7f8e9c" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: '#10161d',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
            }}
          />
          <Legend formatter={(v) => t(`regions.${v}`)} />
          {regions.map((r, i) => (
            <Line
              key={r}
              type="monotone"
              dataKey={r}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              connectNulls
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
