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
