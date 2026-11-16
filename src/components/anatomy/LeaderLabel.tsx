import type { Organ, ViewBox } from '@/data/types'

/**
 * Leader-line label drawn in body coordinates; `k` (body units per screen pixel) keeps text and strokes
 * a constant on-screen size at any zoom level.
 */
export function LeaderLabel({
  organ,
  vb,
  k,
  selected,
}: {
  organ: Organ
  vb: ViewBox
  k: number
  selected: boolean
}) {
  const [ax, ay] = organ.anchor
  const [x, y, w, h] = vb
  const left = ax < x + w / 2
  // visible area edges in body coords (frame may be letterboxed)
  const margin = 18 * k
  const lx = left ? Math.max(x, ax - 260 * k) + margin : Math.min(x + w, ax + 260 * k) - margin
  const ly = Math.min(Math.max(ay - 36 * k, y + 34 * k), y + h - 34 * k)
  const elbow = lx + (left ? 48 : -48) * k
  const anchor = left ? 'start' : 'end'
  return (
    <g className="pointer-events-none" style={{ color: organ.accent }} aria-hidden>
      <circle cx={ax} cy={ay} r={3.2 * k} fill="currentColor" />
      <circle
        cx={ax}
        cy={ay}
        r={8 * k}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.55}
        strokeWidth={1 * k}
        className="ping"
      />
      <path
        d={`M${ax},${ay} L${elbow},${ly} L${lx},${ly}`}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.75}
        strokeWidth={1 * k}
      />
      <text
        x={lx}
        y={ly - 7 * k}
        textAnchor={anchor}
        fontSize={17 * k}
        fill="#fff"
        fontFamily="var(--font-geist)"
        fontWeight={500}
        paintOrder="stroke"
        stroke="#07090c"
        strokeWidth={4 * k}
        strokeOpacity={0.7}
      >
        {organ.shortName}
      </text>
      <text
        x={lx}
        y={ly + 15 * k}
        textAnchor={anchor}
        fontSize={11 * k}
        fill="currentColor"
        fontFamily="var(--font-geist-mono)"
        letterSpacing={1 * k}
        paintOrder="stroke"
        stroke="#07090c"
        strokeWidth={3 * k}
        strokeOpacity={0.7}
      >
        {selected ? 'VYBRÁNO' : 'KLIKNĚTE PRO DETAIL'}
      </text>
    </g>
  )
}
