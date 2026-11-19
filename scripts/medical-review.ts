/**
 * Generates docs/lekarska-kontrola.md — a checklist for the physician who reviews the health content.
 * Every guide's numbers, recommendations (with evidence level), myths and sources, plus the supplement
 * upper limits, in one printable document with a box to tick or comment on each item.
 *
 *   npm run review:doc
 *
 * Regenerate after any content change so the reviewer always signs off on what is live.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { BODY_GUIDES } from '../src/data/body-guides'
import { SUPPLEMENTS } from '../src/data/supplement-library'

const LEVEL: Record<string, string> = {
  established: 'Prokázané',
  plausible: 'Pravděpodobné',
  preliminary: 'Předběžné',
}
const box = '- [ ] '
/** Czech number format; billions of CFU as "mld." so probiotics read 1–10 mld. CFU */
const num = (v: number) =>
  v >= 1e9
    ? `${(v / 1e9).toLocaleString('cs-CZ')} mld.`
    : v.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })
const out: string[] = []

out.push(
  '# Odborná kontrola zdravotního obsahu — BLWB',
  '',
  `Vygenerováno ${new Date().toISOString().slice(0, 10)} přímo z dat webu (\`npm run review:doc\`).`,
  '',
  '**Jak kontrolovat:** u každé položky zaškrtněte, že je věcně správná a bezpečná pro laického čtenáře. ' +
    'Když ne, napište pod ni krátkou poznámku. U doporučení je uvedená úroveň důkazů, kterou web čtenáři ukazuje ' +
    '(Prokázané / Pravděpodobné / Předběžné) — posuďte prosím i ji.',
  '',
  `Obsah: ${BODY_GUIDES.length} průvodců, ${SUPPLEMENTS.length} doplňků s dávkami a horními limity.`,
  '',
  '---',
  '',
)

for (const [i, g] of BODY_GUIDES.entries()) {
  out.push(`## ${i + 1}. ${g.title}`, '', `Web: /jak-funguje-telo/${g.slug}`, '')
  out.push('**Ve zkratce**', '')
  for (const t of g.tldr) out.push(box + t)
  if (g.numbers.length) {
    out.push('', '**Čísla**', '')
    for (const n of g.numbers) out.push(`${box}**${n.value}** — ${n.label}`)
  }
  out.push('', '**Jak to funguje**', '')
  for (const h of g.how) out.push(`${box}**${h.title}:** ${h.text}`)
  out.push('', '**Doporučení**', '')
  for (const h of g.helps) out.push(`${box}${h.text} _(${LEVEL[h.level]})_`)
  out.push('', '**Mýty**', '')
  for (const m of g.myths) out.push(`${box}„${m.myth}“ → ${m.fact}`)
  out.push('', '**Zdroje**', '')
  for (const s of g.sources) out.push(`- ${s.title} — ${s.url}`)
  out.push('', 'Poznámky lékaře:', '', '&nbsp;', '', '---', '')
}

out.push('## Doplňky: běžné dávky a horní limity', '')
out.push('| Doplněk | Běžná denní dávka | Horní bezpečný limit | OK |', '|---|---|---|---|')
for (const s of SUPPLEMENTS) {
  const ul = s.ul
    ? `${num(s.ul.value)} ${s.dose.unit}${s.ul.scope === 'supplements' ? ' (z doplňků)' : ''}`
    : '—'
  out.push(`| ${s.name.cs} | ${num(s.dose.min)}–${num(s.dose.max)} ${s.dose.unit} | ${ul} | ☐ |`)
}
out.push(
  '',
  '---',
  '',
  'Kontrolu provedl(a): ______________________  Odbornost: ______________________',
  '',
  'Datum: ____________  Podpis: ______________________',
  '',
)

mkdirSync('docs', { recursive: true })
writeFileSync('docs/lekarska-kontrola.md', out.join('\n'))
console.log(`✓ docs/lekarska-kontrola.md — ${BODY_GUIDES.length} guides, ${SUPPLEMENTS.length} supplements`)
