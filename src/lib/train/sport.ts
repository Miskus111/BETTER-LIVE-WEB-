import { z } from 'zod'

export const SPORT_TYPES = [
  'running',
  'cycling',
  'swimming',
  'martial_arts',
  'football',
  'hockey',
  'basketball',
  'climbing',
  'yoga',
  'tennis',
  'hiking',
  'rowing',
  'other',
] as const

export const sportSessionSchema = z.object({
  sport: z.enum(SPORT_TYPES),
  durationMin: z.coerce.number().int().min(1).max(1440),
  distanceKm: z
    .union([z.literal(''), z.coerce.number().min(0).max(1000)])
    .transform((v) => (v === '' ? null : v)),
  avgHr: z
    .union([z.literal(''), z.coerce.number().int().min(30).max(230)])
    .transform((v) => (v === '' ? null : v)),
  rpe: z.coerce.number().min(1).max(10),
  notes: z.string().max(500),
})

/** Pace in min/km as "m:ss", or null when there's no distance. */
export function pace(durationMin: number, distanceKm: number | null): string | null {
  if (!distanceKm || distanceKm <= 0) return null
  const minPerKm = durationMin / distanceKm
  const m = Math.floor(minPerKm)
  const s = Math.round((minPerKm - m) * 60)
  return s === 60 ? `${m + 1}:00` : `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Heart-rate zones (% of max HR, 5-zone model). Max HR estimated with Tanaka (208 − 0.7 × age) when unknown.
 */
export function hrZones(age: number, maxHr?: number) {
  const max = Math.round(maxHr ?? 208 - 0.7 * age)
  const z = (lo: number, hi: number) => [Math.round(max * lo), Math.round(max * hi)] as const
  return { max, zones: [z(0.5, 0.6), z(0.6, 0.7), z(0.7, 0.8), z(0.8, 0.9), z(0.9, 1)] }
}
