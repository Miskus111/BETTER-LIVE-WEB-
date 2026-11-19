'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minus, Move, Plus } from 'lucide-react'
import { ORGAN_BY_ID } from '@/data/organs'
import type { OrganId, SystemId } from '@/data/types'
import { BodySvg, type Layers } from './BodySvg'
import { FULL } from './geometry'
import { fit, useViewBox } from './useViewBox'

interface Props {
  selected: OrganId | null
  system: SystemId | null
  layers: Layers
  onSelect: (id: OrganId | null) => void
  onPrev: () => void
  onNext: () => void
  /** bumping this number forces the view back to the selected organ (or full body) */
  resetKey: number
  onReset: () => void
  /** share of the frame hidden behind the mobile bottom sheet */
  bottomInset?: number
}

export function BodyCanvas({
  selected,
  system,
  layers,
  onSelect,
  onPrev,
  onNext,
  resetKey,
  onReset,
  bottomInset = 0,
}: Props) {
  const frame = useRef<HTMLDivElement>(null)
  const { vb, aspect, unitsPerPx, animateTo, zoomBy, toBody, pointer, justDragged } = useViewBox(frame)
  const [hover, setHover] = useState<OrganId | null>(null)

  // zoom to the selected organ (or full body); re-fit on resize
  useEffect(() => {
    animateTo(
      selected ? fit(ORGAN_BY_ID[selected].zoom, aspect, { pad: 1.45, bottomInset }) : fit(FULL, aspect),
    )
  }, [selected, aspect, resetKey, animateTo, bottomInset])

  const activate = (id: OrganId | null) => {
    if (justDragged.current) return
    // clicking empty space keeps the current selection; clicking the selected organ again deselects
    if (id === null) return
    onSelect(id === selected ? null : id)
  }

  // pinch-zoom / ⌘+wheel zooms the body. React's onWheel is passive (preventDefault would be ignored
  // and the whole page would zoom too), so attach a native non-passive listener.
  const wheelRef = useRef({ toBody, zoomBy })
  useEffect(() => {
    wheelRef.current = { toBody, zoomBy }
  })
  useEffect(() => {
    const el = frame.current
    if (!el) return
    const on = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return // plain wheel scrolls the page
      e.preventDefault()
      const [x, y] = wheelRef.current.toBody(e.clientX, e.clientY)
      wheelRef.current.zoomBy(e.deltaY > 0 ? 1.15 : 0.87, x, y)
    }
    el.addEventListener('wheel', on, { passive: false })
    return () => el.removeEventListener('wheel', on)
  }, [])

  // at full-body view a vertical swipe scrolls the page (phones); once zoomed in, drags pan the body
  const zoomedIn = vb[2] < 380

  return (
    <div className="relative h-full w-full">
      <div
        ref={frame}
        data-testid="body-canvas"
        className={`relative h-full w-full cursor-grab select-none active:cursor-grabbing ${zoomedIn ? 'touch-none' : 'touch-pan-y'}`}
        onPointerDown={pointer.onPointerDown}
        onPointerMove={pointer.onPointerMove}
        onPointerUp={pointer.onPointerUp}
        onPointerCancel={pointer.onPointerUp}
      >
        <BodySvg
          vb={vb}
          unitsPerPx={unitsPerPx}
          selected={selected}
          hover={hover}
          system={system}
          layers={layers}
          onHover={setHover}
          onActivate={activate}
          onDoubleClick={(e) => {
            const [x, y] = toBody(e.clientX, e.clientY)
            zoomBy(0.6, x, y)
          }}
        />
      </div>

      {/* zoom controls */}
      <div
        className="absolute right-3 bottom-3 flex flex-col gap-1.5"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <CtrlBtn label="Přiblížit" onClick={() => zoomBy(0.7)}>
          <Plus size={16} />
        </CtrlBtn>
        <CtrlBtn label="Oddálit" onClick={() => zoomBy(1.4)}>
          <Minus size={16} />
        </CtrlBtn>
        <CtrlBtn
          label="Celé tělo"
          onClick={() => {
            onSelect(null)
            onReset()
          }}
        >
          <Maximize2 size={15} />
        </CtrlBtn>
      </div>

      {/* prev / next */}
      <div
        className="border-line bg-ink/70 absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border p-1 backdrop-blur-md"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <CtrlBtn label="Předchozí orgán" onClick={onPrev} round>
          <ChevronLeft size={17} />
        </CtrlBtn>
        <span className="text-muted min-w-[92px] px-1 text-center font-mono text-[12px] tracking-wider uppercase">
          {selected ? ORGAN_BY_ID[selected].shortName : 'Celé tělo'}
        </span>
        <CtrlBtn label="Další orgán" onClick={onNext} round>
          <ChevronRight size={17} />
        </CtrlBtn>
      </div>

      <p className="text-subtle pointer-events-none absolute top-3 left-3 hidden items-center gap-1.5 font-mono text-[12px] md:flex">
        <Move size={12} aria-hidden /> Tažením posunete · dvojklikem přiblížíte
      </p>
    </div>
  )
}

function CtrlBtn({
  children,
  label,
  onClick,
  round,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  round?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center ${round ? 'rounded-full' : 'border-line bg-ink/60 rounded-lg border backdrop-blur-md'} text-fg/85 hover:border-cyan/40 hover:text-cyan transition`}
    >
      {children}
    </button>
  )
}
