/**
 * npm run check:sources — every PubMed citation must point to the study it names.
 * Fetches author and year for each PMID from NCBI E-utilities and compares them with the citation text
 * ("Drake a kol. (2013) …"). Group authors (societies, consensus panels) are skipped. Needs internet.
 */
import * as guides from '../src/data/body-guides'
import * as absorption from '../src/data/absorption'
import * as compounds from '../src/data/compounds'
import * as organs from '../src/data/organs'
import * as reference from '../src/data/reference'
import * as sources from '../src/data/sources'
import * as glossary from '../src/data/glossary'
import * as looks from '../src/data/looksmaxing'

const cites = new Map<string, string>() // pmid → citation title
const walk = (x: unknown, seen = new Set<unknown>()) => {
  if (!x || typeof x !== 'object' || seen.has(x)) return
  seen.add(x)
  if (Array.isArray(x)) return x.forEach((y) => walk(y, seen))
  const o = x as Record<string, unknown>
  const id = typeof o.url === 'string' ? /pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/.exec(o.url)?.[1] : undefined
  if (id) cites.set(id, String(o.title ?? ''))
  for (const v of Object.values(o)) walk(v, seen)
}
for (const m of [guides, absorption, compounds, organs, reference, sources, glossary, looks]) walk(m)

const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
type Summary = { pubdate?: string; authors?: { name: string; authtype?: string }[]; error?: string }

async function main() {
  const ids = [...cites.keys()]
  const meta: Record<string, Summary> = {}
  for (let i = 0; i < ids.length; i += 150) {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.slice(i, i + 150).join(',')}`
    const json = (await (await fetch(url)).json()) as { result: Record<string, Summary> }
    Object.assign(meta, json.result)
    await new Promise((r) => setTimeout(r, 400)) // NCBI: max 3 requests/s without a key
  }

  const problems: string[] = []
  for (const [id, title] of cites) {
    const m = meta[id]
    if (!m || m.error) {
      problems.push(`${id}: not in PubMed — "${title}"`)
      continue
    }
    const year = Number(m.pubdate?.slice(0, 4))
    const citedYear = Number(/\((\d{4})\)/.exec(title)?.[1])
    // first personal author ("Consensus Conference Panel" is listed as a CollectiveName)
    const first = m.authors?.find((a) => a.authtype !== 'CollectiveName')?.name.split(' ')[0] ?? ''
    const personal = /^\p{Lu}\p{Ll}+ (a kol\.|et al\.|\()/u.test(title) // "Drake a kol. (2013)" — not a society
    if (citedYear && year && Math.abs(citedYear - year) > 1)
      problems.push(`${id}: PubMed year ${year}, cited ${citedYear} — "${title}"`)
    if (personal && first && !fold(title).includes(fold(first).slice(0, 5)))
      problems.push(`${id}: PubMed first author ${first} — "${title}"`)
  }

  if (problems.length) {
    console.error(problems.join('\n'))
    console.error(`\n✗ ${problems.length} of ${cites.size} PubMed citations don't match`)
    process.exit(1)
  }
  console.log(`✓ ${cites.size} PubMed citations match their study (author and year)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
