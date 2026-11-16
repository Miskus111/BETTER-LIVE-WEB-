'use client'

import { Bone, Dumbbell, HeartPulse } from 'lucide-react'
import { ORGANS } from '@/data/organs'
import { SYSTEMS } from '@/data/sources'
import type { OrganId, SystemId } from '@/data/types'
import { cx } from '@/lib/format'
import type { Layers } from './BodySvg'

interface Props {
  selected: OrganId | null
  onSelect: (id: OrganId) => void
  system: SystemId | null
  onSystem: (s: SystemId | null) => void
  layers: Layers
  onLayers: (l: Layers) => void
  /** the homepage hero owns the page h1; organ pages use the panel title instead */
  titleAs?: 'h1' | 'p'
}

const LAYERS: { key: keyof Layers; label: string; icon: typeof Bone }[] = [
  { key: 'organs', label: 'Organs', icon: HeartPulse },
  { key: 'skeleton', label: 'Skeleton', icon: Bone },
  { key: 'muscles', label: 'Muscles', icon: Dumbbell },
]

export function ExplorerControls({
  selected,
  onSelect,
  system,
  onSystem,
  layers,
  onLayers,
  titleAs = 'h1',
}: Props) {
  const Title = titleAs
  const organs = system ? ORGANS.filter((o) => o.system === system) : ORGANS
  return (
    <div className="flex flex-col gap-6 lg:py-2">
      <div className="hidden lg:block">
        <span className="eyebrow">FLX · Body × Nutrition</span>
        <Title className="display mt-3 text-[40px] xl:text-[46px]">
          Your body,
          <br />
          <em className="text-cyan">decoded.</em>
        </Title>
        <p className="text-muted mt-3 text-[14.5px]">
          What each organ does, the nutrients it depends on, and the foods that supply them.
        </p>
      </div>

      <fieldset className="min-w-0">
        <legend className="eyebrow !text-subtle mb-2.5">System</legend>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
          <SysBtn active={!system} onClick={() => onSystem(null)}>
            All systems
          </SysBtn>
          {SYSTEMS.map((s) => (
            <SysBtn
              key={s.id}
              active={system === s.id}
              onClick={() => onSystem(system === s.id ? null : s.id)}
            >
              {s.name}
            </SysBtn>
          ))}
        </div>
      </fieldset>

      <fieldset className="min-w-0">
        <legend className="eyebrow !text-subtle mb-2.5">Layers</legend>
        <div className="flex flex-wrap gap-2">
          {LAYERS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              aria-pressed={layers[key]}
              onClick={() => onLayers({ ...layers, [key]: !layers[key] })}
              className="chip"
            >
              <Icon size={14} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="min-w-0">
        <legend className="eyebrow !text-subtle mb-2.5">Organs{system && ` · ${organs.length}`}</legend>
        <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-2 lg:px-0">
          {organs.map((o) => (
            <li key={o.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(o.id)}
                aria-current={selected === o.id}
                data-testid={`organ-btn-${o.id}`}
                className={cx(
                  'flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-[14px] transition',
                  selected === o.id
                    ? 'border-cyan/60 bg-cyan/10 text-fg'
                    : 'border-line text-muted hover:border-line-strong hover:text-fg',
                )}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: o.accent }}
                  aria-hidden
                />
                {o.shortName}
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  )
}

function SysBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        'shrink-0 rounded-full border px-3.5 py-1.5 text-left text-[14px] transition lg:rounded-lg lg:border-transparent lg:px-3',
        active
          ? 'border-cyan bg-cyan text-ink lg:bg-cyan/12 lg:text-cyan'
          : 'border-line text-muted hover:text-fg lg:hover:bg-white/[0.03]',
      )}
    >
      {children}
    </button>
  )
}
