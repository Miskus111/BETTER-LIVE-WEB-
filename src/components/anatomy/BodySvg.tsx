'use client'

import type { ReactNode } from 'react'
import { ORGAN_BY_ID } from '@/data/organs'
import type { OrganId, SystemId, ViewBox } from '@/data/types'
import { BODY_PATH, BONES_HALF, MUSCLES_HALF, ORGAN_SHAPES as S, RIBS, VERTEBRAE } from './geometry'
import { LeaderLabel } from './LeaderLabel'

export interface Layers {
  organs: boolean
  skeleton: boolean
  muscles: boolean
}

interface Props {
  vb: ViewBox
  unitsPerPx: number
  selected: OrganId | null
  hover: OrganId | null
  system: SystemId | null
  layers: Layers
  onHover: (id: OrganId | null) => void
  onActivate: (id: OrganId | null) => void
  onDoubleClick: (e: React.MouseEvent) => void
}

/** Back-to-front paint order for the internal organs. */
const ORGAN_ORDER: OrganId[] = [
  'kidneys',
  'intestines',
  'liver',
  'stomach',
  'lungs',
  'heart',
  'brain',
  'eyes',
]

export function BodySvg({
  vb,
  unitsPerPx,
  selected,
  hover,
  system,
  layers,
  onHover,
  onActivate,
  onDoubleClick,
}: Props) {
  const inSystem = (id: OrganId) => !system || ORGAN_BY_ID[id].system === system
  const state = (id: OrganId) =>
    selected === id
      ? 'sel'
      : hover === id
        ? 'hov'
        : (selected && selected !== id) || !inSystem(id)
          ? 'dim'
          : 'idle'

  const interactive = (id: OrganId) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `${ORGAN_BY_ID[id].shortName}${selected === id ? ' (selected)' : ''}`,
    'aria-pressed': selected === id,
    'data-organ': id,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      onActivate(id)
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        onActivate(id)
      }
    },
    onPointerEnter: () => onHover(id),
    onPointerLeave: () => onHover(null),
    onFocus: () => onHover(id),
    onBlur: () => onHover(null),
    className: `organ cursor-pointer organ-${state(id)}`,
    style: { ['--c' as string]: ORGAN_BY_ID[id].accent } as React.CSSProperties,
  })

  // organs in the active system paint last so they sit on top
  const order = [...ORGAN_ORDER].sort(
    (a, b) =>
      Number(!!system && inSystem(a)) - Number(!!system && inSystem(b)) ||
      Number(a === selected) - Number(b === selected),
  )

  const organNode: Partial<Record<OrganId, ReactNode>> = {
    brain: (
      <g key="brain" {...interactive('brain')}>
        <path d={S.brain.hit} className="o-fill" />
        {S.brain.detail.map((d, i) => (
          <path key={i} d={d} className="o-line" />
        ))}
      </g>
    ),
    eyes: (
      <g key="eyes" {...interactive('eyes')}>
        {[S.eyes.l, S.eyes.r].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={11} className="o-hit" />
            <circle cx={x} cy={y} r={8} className="o-fill" />
            <circle cx={x} cy={y} r={3.2} className="o-line" />
          </g>
        ))}
      </g>
    ),
    lungs: (
      <g key="lungs" {...interactive('lungs')}>
        <g className="breathe">
          <path d={S.lungs.hit} className="o-fill" />
          {S.lungs.detail.map((d, i) => (
            <path key={i} d={d} className="o-line" />
          ))}
        </g>
      </g>
    ),
    heart: (
      <g key="heart" {...interactive('heart')}>
        <g className="beat">
          <path d={S.heart.hit} className="o-fill" />
          {S.heart.detail.map((d, i) => (
            <path key={i} d={d} className="o-line" />
          ))}
        </g>
      </g>
    ),
    liver: (
      <g key="liver" {...interactive('liver')}>
        <path d={S.liver.hit} className="o-fill" />
        {S.liver.detail.map((d, i) => (
          <path key={i} d={d} className="o-line" />
        ))}
      </g>
    ),
    stomach: (
      <g key="stomach" {...interactive('stomach')}>
        <path d={S.stomach.hit} className="o-fill" />
        {S.stomach.detail.map((d, i) => (
          <path key={i} d={d} className="o-line" />
        ))}
      </g>
    ),
    kidneys: (
      <g key="kidneys" {...interactive('kidneys')}>
        <path d={S.kidneys.hit} className="o-fill" />
        {S.kidneys.detail.map((d, i) => (
          <path key={i} d={d} className="o-line" />
        ))}
      </g>
    ),
    intestines: (
      <g key="intestines" {...interactive('intestines')}>
        <path d={S.intestines.hit} className="o-hit" />
        <path d={S.intestines.tube} className="o-tube" strokeWidth={12} />
        <path d={S.intestines.coil} className="o-tube" strokeWidth={6} />
      </g>
    ),
  }

  const boneHalf = (
    <>
      {BONES_HALF.map((d, i) => (
        <path key={i} d={d} />
      ))}
      {RIBS.map((d, i) => (
        <path key={'r' + i} d={d} />
      ))}
    </>
  )
  const skinState = state('skin')
  const skinLit = skinState === 'sel' || skinState === 'hov'
  const label = hover ?? selected

  return (
    <svg
      viewBox={vb.join(' ')}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      onClick={() => onActivate(null)}
      onDoubleClick={onDoubleClick}
      role="group"
      aria-label="Interactive human body. Use Tab to move between organs and Enter to select."
    >
      <defs>
        <radialGradient id="aura" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#3aa8ff" stopOpacity="0.2" />
          <stop offset="60%" stopColor="#1b4b8a" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="skin-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fe8ff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#4aa3ff" stopOpacity="0.065" />
          <stop offset="100%" stopColor="#4aa3ff" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="scan-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ee7ff" stopOpacity="0" />
          <stop offset="90%" stopColor="#5ee7ff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#bff6ff" stopOpacity="0.5" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id="body-clip">
          <path d={BODY_PATH} />
        </clipPath>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20,0 L0,0 0,20" fill="none" stroke="#9fdcff" strokeOpacity="0.05" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* backdrop */}
      <rect x={-600} y={-600} width={1600} height={2200} fill="url(#grid)" />
      <ellipse cx={200} cy={360} rx={260} ry={420} fill="url(#aura)" />
      <g fill="none" stroke="#5ee7ff" strokeOpacity="0.12" className="hud" aria-hidden>
        <circle cx={200} cy={290} r={150} strokeDasharray="2 6" />
        <circle cx={200} cy={290} r={176} strokeOpacity="0.06" />
        <path d="M200,110 L200,124 M200,456 L200,470 M20,290 L34,290 M366,290 L380,290" strokeOpacity="0.3" />
      </g>
      <g fill="#7fd8ff" fillOpacity="0.4" fontSize={7} fontFamily="var(--font-geist-mono)" aria-hidden>
        {[0, 200, 400, 600, 800].map((y) => (
          <text key={y} x={6} y={y + 40}>
            {`${String(Math.round((y / 920) * 180)).padStart(3, '0')} cm`}
          </text>
        ))}
      </g>

      {/* skin silhouette (fill is decorative; the outline is the hit target) */}
      <path d={BODY_PATH} fill="url(#skin-g)" className="pointer-events-none" />
      <path
        d={BODY_PATH}
        fill="none"
        stroke="#5ee7ff"
        strokeOpacity="0.22"
        strokeWidth={6}
        filter="url(#soft)"
        className="pointer-events-none"
      />
      <g
        {...interactive('skin')}
        className={`cursor-pointer transition-opacity ${skinState === 'dim' ? 'opacity-50' : ''}`}
        filter={skinLit ? 'url(#glow)' : undefined}
      >
        <path d={BODY_PATH} fill="none" stroke="transparent" strokeWidth={12} pointerEvents="stroke" />
        <path
          d={BODY_PATH}
          fill="none"
          stroke={skinLit ? '#ffd4b8' : '#8fe9ff'}
          strokeOpacity={skinLit ? 0.95 : 0.42}
          strokeWidth={skinState === 'sel' ? 1.8 : 1.1}
          pointerEvents="none"
        />
      </g>

      <g clipPath="url(#body-clip)">
        {layers.muscles && (
          <g {...interactive('muscles')}>
            <g>
              {MUSCLES_HALF.map((d, i) => (
                <path key={i} d={d} className="o-fill m-fill" />
              ))}
            </g>
            <g transform="translate(400,0) scale(-1,1)">
              {MUSCLES_HALF.map((d, i) => (
                <path key={i} d={d} className="o-fill m-fill" />
              ))}
            </g>
          </g>
        )}
        {layers.skeleton && (
          <g {...interactive('bones')}>
            <g className="bone">
              <ellipse cx={200} cy={86} rx={38} ry={46} />
              <path d="M174,118 Q200,152 226,118" />
              <path d="M200,200 L200,300" strokeWidth={5} />
              <path d="M184,512 Q200,522 216,512" />
              {VERTEBRAE.map((y) => (
                <rect key={y} x={195} y={y} width={10} height={7} rx={2} />
              ))}
              {boneHalf}
              <g transform="translate(400,0) scale(-1,1)">{boneHalf}</g>
              <circle cx={172} cy={762} r={6} />
              <circle cx={228} cy={762} r={6} />
            </g>
          </g>
        )}
        <rect
          x={0}
          y={-140}
          width={400}
          height={140}
          fill="url(#scan-g)"
          className="scan pointer-events-none"
        />
      </g>

      {layers.organs && <g>{order.map((id) => organNode[id])}</g>}

      {label && (
        <LeaderLabel organ={ORGAN_BY_ID[label]} vb={vb} k={unitsPerPx} selected={selected === label} />
      )}
    </svg>
  )
}
