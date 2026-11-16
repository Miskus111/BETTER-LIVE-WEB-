import { Fragment, type ReactNode } from 'react'

/** Tiny, safe Markdown subset for coach replies: paragraphs, bullet/numbered lists, **bold**, *italic*, headings. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) out.push(<strong key={i++}>{tok.slice(2, -2)}</strong>)
    else if (tok.startsWith('`'))
      out.push(
        <code key={i++} className="font-mono text-[0.92em]">
          {tok.slice(1, -1)}
        </code>,
      )
    else out.push(<em key={i++}>{tok.slice(1, -1)}</em>)
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  const lines = text.replace(/\r/g, '').split('\n')
  let list: { ordered: boolean; items: string[] } | null = null
  let para: string[] = []
  const flushPara = () => {
    if (para.length) blocks.push(<p key={blocks.length}>{inline(para.join(' '))}</p>)
    para = []
  }
  const flushList = () => {
    if (!list) return
    const items = list.items.map((it, i) => <li key={i}>{inline(it)}</li>)
    blocks.push(
      list.ordered ? (
        <ol key={blocks.length} className="list-decimal space-y-1 pl-5">
          {items}
        </ol>
      ) : (
        <ul key={blocks.length} className="list-disc space-y-1 pl-5">
          {items}
        </ul>
      ),
    )
    list = null
  }
  for (const raw of lines) {
    const line = raw.trimEnd()
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line)
    const num = /^\s*\d+[.)]\s+(.*)$/.exec(line)
    const head = /^#{1,4}\s+(.*)$/.exec(line)
    if (bullet || num) {
      flushPara()
      const ordered = !!num
      if (list && list.ordered !== ordered) flushList()
      list ??= { ordered, items: [] }
      list.items.push((bullet ?? num)![1])
    } else if (head) {
      flushPara()
      flushList()
      blocks.push(
        <p key={blocks.length} className="font-medium">
          {inline(head[1])}
        </p>,
      )
    } else if (!line.trim()) {
      flushPara()
      flushList()
    } else {
      flushList()
      para.push(line.trim())
    }
  }
  flushPara()
  flushList()
  return (
    <div className="space-y-2.5">
      {blocks.map((b, i) => (
        <Fragment key={i}>{b}</Fragment>
      ))}
    </div>
  )
}
