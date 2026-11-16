/**
 * Body-weight trend maths. Daily weight swings ±1–2 kg with water and food, so the app shows a
 * 7-day trailing average as the "real" weight and computes changes from that trend.
 */

export interface WeighIn {
  date: string // YYYY-MM-DD
  weightKg: number
}

export interface TrendPoint extends WeighIn {
  trend: number // trailing average over the last `days` calendar days that have a weigh-in
}

const DAY = 864e5
const t = (d: string) => new Date(`${d}T00:00:00Z`).getTime()
const r1 = (v: number) => Math.round(v * 10) / 10

/** Oldest first; one point per date (the last entry for a date wins). */
export function normalize(entries: WeighIn[]): WeighIn[] {
  const byDate = new Map<string, number>()
  for (const e of entries) if (e.weightKg > 0) byDate.set(e.date, e.weightKg)
  return [...byDate]
    .map(([date, weightKg]) => ({ date, weightKg }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** Trailing average of weigh-ins within the last `days` calendar days (inclusive). */
export function withTrend(entries: WeighIn[], days = 7): TrendPoint[] {
  const pts = normalize(entries)
  return pts.map((p, i) => {
    const from = t(p.date) - (days - 1) * DAY
    let sum = 0
    let n = 0
    for (let j = i; j >= 0 && t(pts[j].date) >= from; j--) {
      sum += pts[j].weightKg
      n++
    }
    return { ...p, trend: r1(sum / n) }
  })
}

/** Change of the trend over the last `days` days, or null when there is no point that far back. */
export function trendChange(points: TrendPoint[], days: number): number | null {
  if (points.length < 2) return null
  const last = points[points.length - 1]
  const cutoff = t(last.date) - days * DAY
  // the latest point on or before the cutoff; fall back to the first point if it is close enough
  let base: TrendPoint | undefined
  for (const p of points) if (t(p.date) <= cutoff) base = p
  if (!base) {
    const first = points[0]
    if (t(last.date) - t(first.date) < days * DAY * 0.6) return null
    base = first
  }
  return r1(last.trend - base.trend)
}

/** Weekly rate (kg/week) of the trend over the last `days` days. Negative = losing. */
export function weeklyRate(points: TrendPoint[], days = 28): number | null {
  const ch = trendChange(points, days)
  if (ch === null) return null
  const last = points[points.length - 1]
  const firstInWindow = points.find((p) => t(p.date) >= t(last.date) - days * DAY) ?? points[0]
  const span = Math.max(7, (t(last.date) - t(firstInWindow.date)) / DAY)
  return r1((ch / span) * 7)
}
