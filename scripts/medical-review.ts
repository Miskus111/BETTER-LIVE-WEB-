/**
 * Generates the checklist for the physician who reviews the health content, as
 * docs/lekarska-kontrola.md and a printable docs/lekarska-kontrola.docx: every guide's numbers,
 * recommendations (with evidence level), myths and sources, plus the supplement doses and upper limits,
 * with a box to tick on each item, room for notes and a sign-off block.
 *
 *   npm run review:doc
 *
 * Regenerate after any content change so the reviewer always signs off on what is live.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'
import { BODY_GUIDES } from '../src/data/body-guides'
import { SUPPLEMENTS } from '../src/data/supplement-library'
import { FOODS } from '../src/data/foods'
import { foodPicksForGuide } from '../src/lib/foods/guides'
import { UPPER_LIMITS, upperLimitHits } from '../src/lib/foods/upper-limits'
import { notRecommendedReason } from '../src/lib/nutrition'
import { portionText } from '../src/lib/foods/query'
import type { FoodsFile } from '../src/lib/foods/types'

const LEVEL: Record<string, string> = {
  established: 'Prokázané',
  plausible: 'Pravděpodobné',
  preliminary: 'Předběžné',
}
/** Czech number format; billions of CFU as "mld." so probiotics read 1–10 mld. CFU */
const num = (v: number) =>
  v >= 1e9
    ? `${(v / 1e9).toLocaleString('cs-CZ')} mld.`
    : v.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })

// ── content model (shared by both outputs) ───────────────────────────────────
type Item = { bold?: string; text: string; note?: string }
type Block = { title: string; items: Item[]; plain?: boolean }
type Section = { title: string; url: string; blocks: Block[] }

const today = new Date().toISOString().slice(0, 10)
const INTRO =
  'U každé položky zaškrtněte, že je věcně správná a bezpečná pro laického čtenáře. Když ne, napište ' +
  'k ní krátkou poznámku. U doporučení je uvedená úroveň důkazů, kterou web čtenáři ukazuje ' +
  '(Prokázané / Pravděpodobné / Předběžné) — posuďte prosím i ji.'

const sections: Section[] = BODY_GUIDES.map((g) => ({
  title: g.title,
  url: `/jak-funguje-telo/${g.slug}`,
  blocks: [
    { title: 'Ve zkratce', items: g.tldr.map((t) => ({ text: t })) },
    { title: 'Čísla', items: g.numbers.map((n) => ({ bold: n.value, text: n.label })) },
    { title: 'Jak to funguje', items: g.how.map((h) => ({ bold: h.title + ':', text: h.text })) },
    { title: 'Doporučení', items: g.helps.map((h) => ({ text: h.text, note: LEVEL[h.level] })) },
    { title: 'Mýty', items: g.myths.map((m) => ({ text: `„${m.myth}“ → ${m.fact}` })) },
    {
      title: 'Potraviny k tématu (vypočteno z dat, na běžnou porci)',
      items: (() => {
        const p = foodPicksForGuide(g.slug, FOODS)
        return p
          ? [
              { text: p.title },
              ...p.items.map((x) => ({
                text: `${x.food.name} — ${num(Math.round(x.amount * 10) / 10)} ${p.unit} (${portionText(x.food.portion)})`,
              })),
            ]
          : []
      })(),
    },
    { title: 'Zdroje', plain: true, items: g.sources.map((s) => ({ text: `${s.title} — ${s.url}` })) },
  ].filter((b) => b.items.length),
}))

// food pages: rules computed from the data (summary, upper-limit warnings, foods never recommended)
const full = (JSON.parse(readFileSync('src/data/foods.generated.json', 'utf8')) as FoodsFile).foods
const nameOf = Object.fromEntries(FOODS.map((f) => [f.id, f.name]))
sections.push({
  title: 'Stránky potravin: automatická shrnutí a varování',
  url: '/food/…',
  blocks: [
    {
      title: '„V kostce“ — prahy (kladné podle EU 1924/2006, záporné podle semaforu UK FSA)',
      items: [
        { text: 'Nízký obsah energie ≤ 40 kcal/100 g (nápoje ≤ 20 kcal/100 ml).' },
        {
          text: 'Zdroj / vysoký obsah bílkovin: ≥ 12 / ≥ 20 % energie z bílkovin a zároveň ≥ 5 g/100 g (nápoje 2,5 g).',
        },
        { text: 'Zdroj / vysoký obsah vlákniny: ≥ 3 / ≥ 6 g na 100 g.' },
        {
          text: 'Zdroj / vysoký obsah vitamínu či minerálu: ≥ 15 / ≥ 30 % referenční hodnoty na 100 g (nápoje polovina).',
        },
        {
          text: 'Vysoký obsah cukrů > 22,5 g, tuku > 17,5 g, nasycených tuků > 5 g, soli > 1,5 g na 100 g (nápoje polovina); u ovoce poznámka „přirozené cukry“.',
        },
      ],
    },
    {
      title: 'Varování o horním limitu (zobrazí se, když jedna porce dá ≥ 50 % limitu EFSA pro dospělé)',
      items: [
        ...UPPER_LIMITS.map((u) => ({
          text: `Limit ${u.name}: ${num(u.ul)} ${u.unit} denně${u.note ? ` — ${u.note}` : ''}`,
        })),
        ...full.flatMap((f) =>
          upperLimitHits(f.nutrients, f.portions[0].grams).map((h) => ({
            text: `${nameOf[f.id] ?? f.id} (${f.portions[0].label}): ${num(Math.round(h.amount))} ${h.unit} ${h.name} = ${h.pct} % limitu`,
          })),
        ),
      ],
    },
    {
      title: 'Nikdy nedoporučujeme jako zdroj živin (stránka vysvětlí proč)',
      items: FOODS.filter((f) => notRecommendedReason(f)).map((f) => ({
        text: `${f.name} — ${notRecommendedReason(f)}`,
      })),
    },
  ],
})

const suppRows = SUPPLEMENTS.map((s) => [
  s.name.cs,
  `${num(s.dose.min)}–${num(s.dose.max)} ${s.dose.unit}`,
  s.ul ? `${num(s.ul.value)} ${s.dose.unit}${s.ul.scope === 'supplements' ? ' (z doplňků)' : ''}` : '—',
])
const itemCount =
  sections.reduce((n, s) => n + s.blocks.filter((b) => !b.plain).reduce((m, b) => m + b.items.length, 0), 0) +
  suppRows.length

// ── Markdown ─────────────────────────────────────────────────────────────────
const md: string[] = [
  '# Odborná kontrola zdravotního obsahu — BLWB',
  '',
  `Vygenerováno ${today} přímo z dat webu (\`npm run review:doc\`).`,
  '',
  `**Jak kontrolovat:** ${INTRO}`,
  '',
  `Obsah: ${BODY_GUIDES.length} průvodců, stránky potravin, ${SUPPLEMENTS.length} doplňků — ${itemCount} položek ke kontrole.`,
  '',
  '---',
  '',
]
sections.forEach((s, i) => {
  md.push(`## ${i + 1}. ${s.title}`, '', `Web: ${s.url}`, '')
  for (const b of s.blocks) {
    md.push(`**${b.title}**`, '')
    for (const it of b.items) {
      const body = `${it.bold ? `**${it.bold}** ` : ''}${it.text}${it.note ? ` _(${it.note})_` : ''}`
      md.push(`${b.plain ? '- ' : '- [ ] '}${body}`)
    }
    md.push('')
  }
  md.push('Poznámky lékaře:', '', '&nbsp;', '', '---', '')
})
md.push('## Doplňky: běžné dávky a horní limity', '')
md.push('| Doplněk | Běžná denní dávka | Horní bezpečný limit | OK |', '|---|---|---|---|')
for (const r of suppRows) md.push(`| ${r.join(' | ')} | ☐ |`)
md.push(
  '',
  '---',
  '',
  'Kontrolu provedl(a): ______________________  Odbornost: ______________________',
  '',
  'Datum: ____________  Podpis: ______________________',
  '',
)

// ── Word ─────────────────────────────────────────────────────────────────────
const FONT = 'Arial'
const ink = '1F2937'
const muted = '6B7280'
const para = (runs: TextRun[], opts: Record<string, unknown> = {}) =>
  new Paragraph({ children: runs, spacing: { after: 80 }, ...opts })
const check = (it: Item) =>
  para(
    [
      new TextRun({ text: '☐  ', font: 'Segoe UI Symbol', size: 22 }),
      ...(it.bold ? [new TextRun({ text: it.bold + ' ', bold: true })] : []),
      new TextRun(it.text),
      ...(it.note ? [new TextRun({ text: `  (${it.note})`, italics: true, color: muted })] : []),
    ],
    { indent: { left: 360, hanging: 360 }, keepLines: true },
  )
const rule = () =>
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D1D5DB', space: 1 } },
    spacing: { after: 160 },
  })
const noteLines = () => [
  para([new TextRun({ text: 'Poznámky lékaře:', bold: true, color: muted })], {
    spacing: { before: 120, after: 60 },
  }),
  ...[0, 1, 2].map(
    () =>
      new Paragraph({
        border: { bottom: { style: BorderStyle.DOTTED, size: 4, color: '9CA3AF', space: 1 } },
        spacing: { after: 240 },
      }),
  ),
]

const children: (Paragraph | Table)[] = [
  new Paragraph({
    heading: HeadingLevel.TITLE,
    children: [new TextRun('Odborná kontrola zdravotního obsahu')],
  }),
  para([new TextRun({ text: `Better Live with Biohacking (BLWB) · vygenerováno ${today}`, color: muted })]),
  para([new TextRun({ text: 'Jak kontrolovat: ', bold: true }), new TextRun(INTRO)], {
    spacing: { before: 200, after: 120 },
  }),
  para([
    new TextRun(
      `Obsah: ${BODY_GUIDES.length} průvodců, stránky potravin a ${SUPPLEMENTS.length} doplňků — celkem ${itemCount} položek. Zdroje u každého průvodce jsou odkazy na PubMed, EFSA nebo WHO.`,
    ),
  ]),
]
sections.forEach((s, i) => {
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      children: [new TextRun(`${i + 1}. ${s.title}`)],
    }),
  )
  children.push(para([new TextRun({ text: `Web: ${s.url}`, color: muted, size: 18 })]))
  for (const b of s.blocks) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(b.title)] }))
    for (const it of b.items)
      children.push(
        b.plain
          ? para([new TextRun({ text: it.text, size: 17, color: muted })], { indent: { left: 360 } })
          : check(it),
      )
  }
  children.push(...noteLines())
})

// supplements table
const widths = [3000, 2400, 2800, 826] // sums to 9026 = A4 width minus 1" margins
const cell = (text: string, w: number, header = false) =>
  new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: header ? { type: ShadingType.CLEAR, fill: 'F3F4F6', color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: w === widths[3] ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({ text, bold: header, font: w === widths[3] && !header ? 'Segoe UI Symbol' : FONT }),
        ],
      }),
    ],
  })
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    children: [new TextRun('Doplňky: běžné dávky a horní limity')],
  }),
)
children.push(
  new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: ['Doplněk', 'Běžná denní dávka', 'Horní bezpečný limit', 'OK'].map((t, i) =>
          cell(t, widths[i], true),
        ),
      }),
      ...suppRows.map((r) => new TableRow({ children: [...r, '☐'].map((t, i) => cell(t, widths[i])) })),
    ],
  }),
)
children.push(rule())
for (const line of [
  'Kontrolu provedl(a): ______________________________   Odbornost: ______________________________',
  'Datum: ____________________   Podpis: ______________________________',
])
  children.push(para([new TextRun(line)], { spacing: { before: 360, after: 120 } }))

const doc = new Document({
  creator: 'BLWB',
  title: 'Odborná kontrola zdravotního obsahu — BLWB',
  styles: {
    default: { document: { run: { font: FONT, size: 20, color: ink } } },
    paragraphStyles: [
      { id: 'Normal', name: 'Normal', run: { font: FONT, size: 20, color: ink } },
      {
        id: 'Title',
        name: 'Title',
        basedOn: 'Normal',
        run: { font: FONT, size: 40, bold: true },
        paragraph: { spacing: { before: 0, after: 120 }, keepNext: true },
      },
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        run: { font: FONT, size: 30, bold: true },
        paragraph: { spacing: { before: 0, after: 80 }, keepNext: true, outlineLevel: 0 },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        run: { font: FONT, size: 22, bold: true, color: '0E7490' },
        paragraph: { spacing: { before: 200, after: 80 }, keepNext: true, outlineLevel: 1 },
      },
    ],
  },
  sections: [
    {
      properties: { page: { margin: { top: 1134, bottom: 1134, left: 1440, right: 1440 } } },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: 'BLWB · odborná kontrola · strana ', color: muted, size: 16 }),
                new TextRun({ children: [PageNumber.CURRENT], color: muted, size: 16 }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
})

mkdirSync('docs', { recursive: true })
writeFileSync('docs/lekarska-kontrola.md', md.join('\n'))
Packer.toBuffer(doc).then((buf) => {
  writeFileSync('docs/lekarska-kontrola.docx', buf)
  console.log(
    `✓ docs/lekarska-kontrola.{md,docx} — ${BODY_GUIDES.length} guides + food pages, ${SUPPLEMENTS.length} supplements, ${itemCount} items`,
  )
})
