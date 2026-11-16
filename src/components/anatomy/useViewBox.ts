'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ViewBox } from '@/data/types'
import { FULL } from './geometry'

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const MIN_W = 60
const MAX_W = 520

/** Keep the view within reasonable bounds of the 400 × 920 body canvas. */
function clamp([x, y, w, h]: ViewBox): ViewBox {
  const nw = Math.max(MIN_W, Math.min(MAX_W, w))
  const nh = (nw / w) * h
  return [Math.max(-120, Math.min(400 - nw + 120, x)), Math.max(-80, Math.min(920 - nh + 80, y)), nw, nh]
}

/** Expand a target box so it matches the frame's aspect ratio (centred). */
export function fit(t: ViewBox, aspect: number): ViewBox {
  let [x, y, w, h] = t
  if (w / h > aspect) {
    const nh = w / aspect
    y -= (nh - h) / 2
    h = nh
  } else {
    const nw = h * aspect
    x -= (nw - w) / 2
    w = nw
  }
  return [x, y, w, h]
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Animated, pannable, zoomable SVG viewBox.
 * - animateTo(): eased transition (instant with prefers-reduced-motion)
 * - zoomBy(): zoom around a point in body coordinates
 * - pointer handlers: drag to pan (with a 6 px threshold so clicks still work)
 */
export function useViewBox(frame: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 400, h: 800 })
  const aspect = size.w / Math.max(1, size.h)
  const [vb, setVb] = useState<ViewBox>(FULL)
  const vbRef = useRef(vb)
  const raf = useRef(0)
  const drag = useRef<{ x: number; y: number; vb: ViewBox; moved: boolean; id: number } | null>(null)
  /** true right after a drag, so the click that ends a pan does not select/deselect */
  const justDragged = useRef(false)

  const commit = useCallback((v: ViewBox) => {
    vbRef.current = v
    setVb(v)
  }, [])

  useEffect(() => {
    const el = frame.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [frame])

  const animateTo = useCallback(
    (target: ViewBox, dur = 700) => {
      cancelAnimationFrame(raf.current)
      if (prefersReducedMotion()) return commit(target)
      const from = vbRef.current
      const t0 = performance.now()
      const step = (t: number) => {
        const k = ease(Math.min(1, (t - t0) / dur))
        commit(from.map((v, i) => v + (target[i] - v) * k) as ViewBox)
        if (k < 1) raf.current = requestAnimationFrame(step)
      }
      raf.current = requestAnimationFrame(step)
    },
    [commit],
  )

  const zoomBy = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      const [x, y, w, h] = vbRef.current
      const px = cx ?? x + w / 2
      const py = cy ?? y + h / 2
      animateTo(clamp([px - (px - x) * factor, py - (py - y) * factor, w * factor, h * factor]), 380)
    },
    [animateTo],
  )

  const toBody = useCallback(
    (clientX: number, clientY: number) => {
      const r = frame.current!.getBoundingClientRect()
      const [x, y, w, h] = vbRef.current
      // preserveAspectRatio="xMidYMid meet" — account for letterboxing
      const scale = Math.min(r.width / w, r.height / h)
      const ox = (r.width - w * scale) / 2
      const oy = (r.height - h * scale) / 2
      return [x + (clientX - r.left - ox) / scale, y + (clientY - r.top - oy) / scale] as const
    },
    [frame],
  )

  const pointer = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0) return
      drag.current = { x: e.clientX, y: e.clientY, vb: vbRef.current, moved: false, id: e.pointerId }
    },
    onPointerMove: (e: React.PointerEvent) => {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (!d.moved && Math.hypot(dx, dy) < 6) return
      if (!d.moved) {
        d.moved = true
        ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
      }
      const r = frame.current!.getBoundingClientRect()
      const s = Math.max(d.vb[2] / r.width, d.vb[3] / r.height)
      cancelAnimationFrame(raf.current)
      commit(clamp([d.vb[0] - dx * s, d.vb[1] - dy * s, d.vb[2], d.vb[3]]))
    },
    onPointerUp: () => {
      justDragged.current = !!drag.current?.moved
      drag.current = null
      setTimeout(() => (justDragged.current = false), 0)
    },
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  /** body units per screen pixel — used to keep labels a constant on-screen size */
  const unitsPerPx = Math.max(vb[2] / Math.max(1, size.w), vb[3] / Math.max(1, size.h))

  return {
    vb,
    aspect,
    unitsPerPx,
    animateTo,
    zoomBy,
    toBody,
    pointer,
    justDragged,
    isDragging: () => !!drag.current?.moved,
  }
}
