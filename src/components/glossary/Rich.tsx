import { splitTerms, type Piece } from '@/data/glossary'
import { Term } from './Term'

/** Render pre-split text (plain strings + glossary terms). */
export function Pieces({ pieces, here }: { pieces: Piece[]; here?: string }) {
  return (
    <>
      {pieces.map((p, i) =>
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

/**
 * Text with glossary terms underlined. Pass one `seen` set per page so each term is explained
 * once (at its first appearance), not on every mention. Server components only — client
 * components render twice in development, so they should split with `splitTerms` in a useMemo
 * and render <Pieces>.
 */
export function Rich({ text, seen, here }: { text: string; seen: Set<string>; here?: string }) {
  return <Pieces pieces={splitTerms(text, seen)} here={here} />
}
