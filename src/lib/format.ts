/** Cena v Kč, např. „1 299 Kč“ (ceny jsou ukázkové). */
export const czk = (n: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: n % 1 ? 2 : 0,
  }).format(n)

export const pct = (x: number) => `${Math.round(x * 100)} %`

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** Krátký název živiny pro štítky: „Vitamín B1 (thiamin)“ → „Vit. B1“. */
export const shortNutrient = (name: string) => name.replace(/ \(.+\)/, '').replace(/^Vitamín /, 'Vit. ')

/** Shorten to at most n characters at a word boundary, with "…" (no dangling comma or dash). */
export function clip(s: string, n: number): string {
  if (s.length <= n) return s
  const cut = s.lastIndexOf(' ', n - 1)
  let out = s.slice(0, cut > 0 ? cut : n - 1)
  // don't leave a parenthesis open: "energie (závislou na…" → "energie…"
  const open = out.lastIndexOf('(')
  if (open > out.lastIndexOf(')') && open > n / 2) out = out.slice(0, open)
  return `${out.replace(/[\s,;:—–-]+$/, '')}…`
}
