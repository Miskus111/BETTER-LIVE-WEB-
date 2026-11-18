import { splitTerms } from '@/data/glossary'
import { Term } from './Term'

/**
 * Text with glossary terms underlined. Pass one `seen` set per page so each term is explained
 * once (at its first appearance), not on every mention.
 */
export function Rich({ text, seen, here }: { text: string; seen: Set<string>; here?: string }) {
  return (
    <>
      {splitTerms(text, seen).map((p, i) =>
        typeof p === 'string' ? (
          p
        ) : (
          <Term key={i} id={p.id} here={here}>
            {p.text}
          </Term>
        ),
      )}
    </>
  )
}
