import type { BodyGuide } from '@/data/body-guides'

/** Lowercase and strip diacritics so "spanek" finds "spánek". */
export const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const fields = (g: BodyGuide) => ({
  title: norm(`${g.title} ${g.short}`),
  lead: norm(`${g.hook} ${g.tldr.join(' ')}`),
  body: norm(
    [
      ...g.how.map((h) => `${h.title} ${h.text}`),
      ...g.today,
      ...g.helps.map((h) => h.text),
      ...g.myths.map((m) => `${m.myth} ${m.fact}`),
    ].join(' '),
  ),
})

/**
 * Every word must appear somewhere in the guide; matches in the title rank highest, then the
 * hook and summary, then the body. An empty query returns the guides unchanged.
 */
export function searchGuides(guides: BodyGuide[], query: string): BodyGuide[] {
  const words = norm(query).split(/\s+/).filter(Boolean)
  if (!words.length) return guides
  return guides
    .map((g, i) => {
      const f = fields(g)
      const all = `${f.title} ${f.lead} ${f.body}`
      if (!words.every((w) => all.includes(w))) return null
      const score = words.reduce((s, w) => s + (f.title.includes(w) ? 10 : f.lead.includes(w) ? 4 : 1), 0)
      return { g, score, i }
    })
    .filter((x): x is { g: BodyGuide; score: number; i: number } => !!x)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.g)
}
