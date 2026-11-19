/**
 * Drops null/undefined fields. Used for same-day updates and upserts, so a second entry with only some
 * fields filled in adds to the first one instead of erasing it (PostgREST updates only the sent columns).
 */
export function defined<T extends Record<string, unknown>>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined)) as Partial<T>
}
