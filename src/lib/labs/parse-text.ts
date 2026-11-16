import { normalizeRow, type LabCandidate } from './markers'

const num = (s: string) => Number(s.replace(/\s/g, '').replace(',', '.'))

// name (must contain a letter) · value · optional unit · optional range "a - b" or "< b"
const LINE =
  /^\s*(?=[^\n]*?\p{L})(.*?[\p{L})\d])\s*[:\s]\s*([<>]?)\s*(-?\d+(?:[.,]\d+)?)\s*(?:([^\s\d<>()[\]][^\s()[\]]*))?\s*[([]?\s*(?:(\d+(?:[.,]\d+)?)\s*[-–—]\s*(\d+(?:[.,]\d+)?)|([<>≤≥])\s*(\d+(?:[.,]\d+)?))?/u

/**
 * Deterministic parser for lab results pasted as text (one result per line).
 * Used when no AI key is configured and as a cross-check for AI extraction.
 * Only rows that match a known marker are returned.
 */
export function parseLabText(text: string): LabCandidate[] {
  const out: LabCandidate[] = []
  const seen = new Set<string>()
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\t/g, ' ').trim()
    if (line.length < 3) continue
    const m = LINE.exec(line)
    if (!m) continue
    const [, name, , value, unit, lo, hi, op, bound] = m
    let refLow: number | null = lo ? num(lo) : null
    let refHigh: number | null = hi ? num(hi) : null
    if (op && bound) {
      if (op === '<' || op === '≤') refHigh = num(bound)
      else refLow = num(bound)
    }
    // a unit that is really a flag ("H", "L", "*") is not a unit
    const u = unit && /^[HL*↑↓!]+$/.test(unit) ? '' : (unit ?? '')
    const row = normalizeRow({ name, value: num(value), unit: u, ref_low: refLow, ref_high: refHigh })
    if (!row.marker || seen.has(row.marker)) continue
    seen.add(row.marker)
    out.push(row)
  }
  return out
}
