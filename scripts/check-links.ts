/** Ověří, že všechny odkazy na obchody vracejí 2xx/3xx. `npm run check:links` (vyžaduje internet). */
import { ALL_SHOP_LINKS } from '../src/data/retailers'

async function main() {
  const res = await Promise.all(
    ALL_SHOP_LINKS.map(async (l) => {
      try {
        const r = await fetch(l.url, {
          redirect: 'follow',
          headers: { 'user-agent': 'Mozilla/5.0 (link check)' },
        })
        return { l, status: r.status, final: r.url }
      } catch (e) {
        return { l, status: 0, final: String(e) }
      }
    }),
  )
  let bad = 0
  for (const { l, status, final } of res) {
    const ok = status >= 200 && status < 400
    if (!ok) bad++
    console.log(`${ok ? '✓' : '✗'} ${status} ${l.url}${final !== l.url ? ` → ${final}` : ''}`)
  }
  if (bad) {
    console.error(`\n✗ ${bad} nefunkčních odkazů`)
    process.exit(1)
  }
  console.log(`\n✓ všech ${res.length} odkazů funguje`)
}
void main()
