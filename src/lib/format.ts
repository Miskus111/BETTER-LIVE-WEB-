export const eur = (n: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(n)

export const pct = (x: number) => `${Math.round(x * 100)} %`

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
