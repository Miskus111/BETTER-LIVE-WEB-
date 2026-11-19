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

/**
 * The point to measure a `days`-long change from: the latest weigh-in at or just before the cutoff
 * (at most half a window older), else the oldest weigh-in inside the window if it covers ≥ 60 % of it.
 * Never a weigh-in from months ago — after a logging gap that would mislabel a long change as "30 days".
 */
function trendBase(points: TrendPoint[], days: number): TrendPoint | null {
  if (points.length < 2) return null
  const last = points[points.length - 1]
  const cutoff = t(last.date) - days * DAY
  let base: TrendPoint | null = null
  for (const p of points) if (t(p.date) <= cutoff && t(p.date) >= cutoff - days * 0.5 * DAY) base = p
  if (base) return base
  const firstInWindow = points.find((p) => t(p.date) > cutoff)
  if (!firstInWindow || firstInWindow === last) return null
  return t(last.date) - t(firstInWindow.date) >= days * DAY * 0.6 ? firstInWindow : null
}

/** Change of the trend over the last `days` days, or null when the data don't cover that period. */
export function trendChange(points: TrendPoint[], days: number): number | null {
  const base = trendBase(points, days)
  return base ? r1(points[points.length - 1].trend - base.trend) : null
}

/** Weekly rate (kg/week) of the trend over the last `days` days. Negative = losing. */
export function weeklyRate(points: TrendPoint[], days = 28): number | null {
  const base = trendBase(points, days)
  if (!base) return null
  const last = points[points.length - 1]
  // the change and the time it took are measured between the same two points
  const span = Math.max(7, (t(last.date) - t(base.date)) / DAY)
  return r1(((last.trend - base.trend) / span) * 7)
}
