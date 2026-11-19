'use client'

import type { ReactNode } from 'react'
import { ORGAN_BY_ID, ORGANS } from '@/data/organs'
import type { OrganId, SystemId, ViewBox } from '@/data/types'
import {
  BODY_PATH,
  CLAVICLES,
  COSTAL_MARGIN,
  DIAPHRAGM,
  LIMB_BONES,
  MUSCLES,
  MUSCLE_FIBRES,
  ORGAN_SHAPES as S,
  PARTICLES,
  PATELLAE,
  PELVIS,
  RIBS,
  SACRUM,
  SCAPULAE,
  SKULL,
  STERNUM,
  SUPPORT_ORGANS,
  VERTEBRAE,
  VESSELS,
} from './geometry'
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
    'aria-label': `${ORGAN_BY_ID[id].shortName}${selected === id ? ' (vybráno)' : ''}`,
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
    style: {
      ['--c' as string]: ORGAN_BY_ID[id].accent,
      ['--g' as string]: `url(#og-${id})`,
    } as React.CSSProperties,
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
            <circle cx={x} cy={y} r={10} className="o-hit" />
            <ellipse cx={x} cy={y} rx={7} ry={5.6} className="o-fill" />
            <circle cx={x} cy={y} r={2.8} className="o-line" />
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
          {S.heart.vessels.map((v, i) => (
            <path key={'v' + i} d={v.d} className="o-tube" strokeWidth={v.w} />
          ))}
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
        <path d={S.intestines.coil} className="o-tube" strokeWidth={6} />
        <path d={S.intestines.coil} className="o-line" strokeWidth={0.5} />
        <path d={S.intestines.colon} className="o-tube" strokeWidth={11} />
        <path d={S.intestines.colon} className="o-line haustra" strokeWidth={11} />
        <path d={S.intestines.appendix} className="o-tube" strokeWidth={3} />
      </g>
    ),
  }

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
      aria-label="Interaktivní lidské tělo. Klávesou Tab přecházíte mezi orgány, Enterem orgán vyberete."
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
        {ORGANS.map((o) => (
          <radialGradient key={o.id} id={`og-${o.id}`} cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="40%" stopColor={o.accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor={o.accent} stopOpacity="0.25" />
          </radialGradient>
        ))}
        <linearGradient id="rim-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bff6ff" />
          <stop offset="55%" stopColor="#5ee7ff" />
          <stop offset="100%" stopColor="#3a7bff" />
        </linearGradient>
        <radialGradient id="floor-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5ee7ff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#3aa8ff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#3aa8ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* backdrop */}
      <rect x={-600} y={-600} width={1600} height={2200} fill="url(#grid)" />
      <ellipse cx={200} cy={360} rx={260} ry={420} fill="url(#aura)" />
      <g aria-hidden className="pointer-events-none">
        <ellipse cx={200} cy={922} rx={150} ry={26} fill="url(#floor-g)" />
        <ellipse
          cx={200}
          cy={922}
          rx={120}
          ry={18}
          fill="none"
          stroke="#5ee7ff"
          strokeOpacity="0.35"
          strokeWidth={0.8}
        />
        <ellipse
          cx={200}
          cy={922}
          rx={86}
          ry={12}
          fill="none"
          stroke="#5ee7ff"
          strokeOpacity="0.5"
          strokeWidth={0.8}
          strokeDasharray="3 5"
          className="floor-spin"
        />
        {PARTICLES.map(([x, y, r], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="#9fe9ff"
            opacity={0.18 + (i % 4) * 0.08}
            className="twinkle"
            style={{ animationDelay: `${(i % 7) * 0.6}s` }}
          />
        ))}
      </g>
      <g fill="none" stroke="#5ee7ff" strokeOpacity="0.12" className="hud" aria-hidden>
        <circle cx={200} cy={290} r={150} strokeDasharray="2 6" />
        <circle cx={200} cy={290} r={176} strokeOpacity="0.06" />
        <path d="M200,110 L200,124 M200,456 L200,470 M20,290 L34,290 M366,290 L380,290" strokeOpacity="0.3" />
      </g>
      {/* height ruler: the figure is 178 cm tall, floor at y = 920, crown at y = 33 */}
      <g aria-hidden fontFamily="var(--font-geist-mono)">
        {Array.from({ length: 8 }, (_, i) => i * 25).map((h) => {
          const y = 920 - (h / 178) * 887
          const major = h % 50 === 0
          return (
            <g key={h}>
              <line
                x1={major ? 30 : 34}
                x2={40}
                y1={y}
                y2={y}
                stroke="#7fd8ff"
                strokeOpacity={major ? 0.45 : 0.25}
                strokeWidth={0.6}
              />
              {major && (
                <text x={6} y={y + 2.4} fontSize={7} fill="#7fd8ff" fillOpacity={0.45}>
                  {h} cm
                </text>
              )}
            </g>
          )
        })}
        <line x1={40} x2={40} y1={33} y2={920} stroke="#7fd8ff" strokeOpacity={0.15} strokeWidth={0.6} />
        <line x1={30} x2={40} y1={33} y2={33} stroke="#7fd8ff" strokeOpacity={0.45} strokeWidth={0.6} />
        <text x={6} y={35.4} fontSize={7} fill="#7fd8ff" fillOpacity={0.45}>
          178 cm
        </text>
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
          stroke={skinLit ? '#ffd4b8' : 'url(#rim-g)'}
          strokeOpacity={skinLit ? 0.95 : 0.55}
          strokeWidth={skinState === 'sel' ? 1.8 : 1.1}
          pointerEvents="none"
        />
      </g>

      <g clipPath="url(#body-clip)">
        {layers.muscles && (
          <g {...interactive('muscles')}>
            {MUSCLES.map((d, i) => (
              <path key={i} d={d} className="o-fill m-fill" />
            ))}
            {[false, true].map((mirror) => (
              <g key={String(mirror)} transform={mirror ? 'translate(400,0) scale(-1,1)' : undefined}>
                {MUSCLE_FIBRES.map((d, i) => (
                  <path key={i} d={d} className="m-fibre" />
                ))}
              </g>
            ))}
          </g>
        )}
        {layers.skeleton && (
          <g {...interactive('bones')}>
            <g className="bone">
              <path d={SKULL.cranium} />
              <path d={SKULL.mandible} />
              {[...SKULL.orbits, ...SKULL.cheek].map((d, i) => (
                <path key={'s' + i} d={d} />
              ))}
              <path d={SKULL.nose} />
              <path d={SKULL.teeth} className="fine" />
              {VERTEBRAE.map(([y, w, h]) => (
                <rect key={y} x={200 - w} y={y} width={w * 2} height={h} rx={1.6} />
              ))}
              <path d={SACRUM} />
              {SCAPULAE.map((d, i) => (
                <path key={'sc' + i} d={d} className="behind" />
              ))}
              {[...STERNUM, ...CLAVICLES, ...COSTAL_MARGIN].map((d, i) => (
                <path key={'t' + i} d={d} />
              ))}
              {RIBS.map((r, i) => (
                <g key={'r' + i}>
                  <path d={r.back} className="behind" />
                  <path d={r.back} className="behind" transform="translate(400,0) scale(-1,1)" />
                  <path d={r.front} />
                  <path d={r.front} transform="translate(400,0) scale(-1,1)" />
                  {r.cartilage && (
                    <>
                      <path d={r.cartilage} className="fine" />
                      <path d={r.cartilage} className="fine" transform="translate(400,0) scale(-1,1)" />
                    </>
                  )}
                </g>
              ))}
              {[
                ...PELVIS.ilium,
                ...PELVIS.pubis,
                ...PELVIS.obturator,
                ...PELVIS.acetabulum,
                ...LIMB_BONES,
                ...PATELLAE,
              ].map((d, i) => (
                <path key={'l' + i} d={d} />
              ))}
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

      {layers.organs && (
        <g
          aria-hidden
          className="pointer-events-none transition-opacity duration-300"
          opacity={
            system && system !== 'cardio'
              ? 0.15
              : selected && selected !== 'heart' && selected !== 'lungs'
                ? 0.35
                : 0.9
          }
          clipPath="url(#body-clip)"
        >
          {VESSELS.map((v, i) => (
            <g key={i}>
              <path
                d={v.d}
                fill="none"
                stroke={v.c}
                strokeOpacity={0.28}
                strokeWidth={v.w}
                strokeLinecap="round"
              />
              <path
                d={v.d}
                fill="none"
                stroke={v.c}
                strokeOpacity={0.75}
                strokeWidth={v.w * 0.6}
                strokeLinecap="round"
                strokeDasharray="4 22"
                className="flow"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            </g>
          ))}
        </g>
      )}
      {layers.organs && (
        <path
          d={DIAPHRAGM}
          fill="none"
          stroke="#9fdcff"
          strokeOpacity={system || selected ? 0.06 : 0.16}
          strokeWidth={0.9}
          strokeDasharray="3 3"
          className="pointer-events-none"
          aria-hidden
        />
      )}
      {layers.organs && (
        <g
          aria-hidden
          className="pointer-events-none transition-opacity duration-300"
          opacity={selected ? 0.35 : 1}
        >
          {SUPPORT_ORGANS.map((o) =>
            o.tube ? (
              <path
                opacity={system && o.system !== system ? 0.2 : 1}
                key={o.id}
                d={o.d}
                fill="none"
                stroke={o.color}
                strokeOpacity={0.4}
                strokeWidth={o.tube}
                strokeLinecap="round"
              />
            ) : (
              <path
                opacity={system && o.system !== system ? 0.2 : 1}
                key={o.id}
                d={o.d}
                fill={o.color}
                fillOpacity={0.16}
                stroke={o.color}
                strokeOpacity={0.5}
                strokeWidth={0.9}
              >
                <title>{o.label}</title>
              </path>
            ),
          )}
        </g>
      )}
      {layers.organs && <g>{order.map((id) => organNode[id])}</g>}

      {label && (
        <LeaderLabel organ={ORGAN_BY_ID[label]} vb={vb} k={unitsPerPx} selected={selected === label} />
      )}
    </svg>
  )
}
