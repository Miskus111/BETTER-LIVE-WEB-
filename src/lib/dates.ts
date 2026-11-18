/** ISO timestamp `days` days before now (server components, once per request). */
export const isoDaysAgo = (days: number) => new Date(Date.now() - days * 864e5).toISOString()
/** YYYY-MM-DD `days` days before today (UTC). */
export const dayDaysAgo = (days: number) => isoDaysAgo(days).slice(0, 10)
