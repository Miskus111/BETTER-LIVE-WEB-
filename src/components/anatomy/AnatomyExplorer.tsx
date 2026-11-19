'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ORGAN_BY_ID, ORGAN_IDS } from '@/data/organs'
import type { OrganId, SystemId } from '@/data/types'
import { OrganPanel } from '@/components/organ/OrganPanel'
import { ORGAN_EVENT } from '@/lib/organEvents'
import { cx } from '@/lib/format'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { BodyCanvas } from './BodyCanvas'
import type { Layers } from './BodySvg'
import { ExplorerControls } from './ExplorerControls'
import { PanelIntro } from './PanelIntro'

interface Props {
  initial?: OrganId | null
  /** how the selection is reflected in the URL: '?organ=' on the homepage, '/organ/:id' on organ pages */
  urlMode?: 'query' | 'path'
  /** on mobile: bottom sheet (homepage) or inline below the body (organ page) */
  mobilePanel?: 'sheet' | 'inline'
}

export function AnatomyExplorer({ initial = null, urlMode = 'query', mobilePanel = 'sheet' }: Props) {
  const [selected, setSelected] = useState<OrganId | null>(initial)
  const [system, setSystem] = useState<SystemId | null>(null)
  const [layers, setLayers] = useState<Layers>({ organs: true, skeleton: true, muscles: false })
  const [resetKey, setResetKey] = useState(0)
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // homepage: restore ?organ= on load (shareable state)
  useEffect(() => {
    if (urlMode !== 'query') return
    const id = new URLSearchParams(window.location.search).get('organ') as OrganId | null
    // reading the URL is only possible after hydration; this syncs from an external source once
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id && ORGAN_BY_ID[id]) setSelected(id)
  }, [urlMode])

  const select = useCallback(
    (id: OrganId | null) => {
      setSelected(id)
      setSheetExpanded(false)
      // mobile: bring the body frame to the top so the organ is visible above the bottom sheet
      if (id && mobilePanel === 'sheet' && !window.matchMedia('(min-width: 1024px)').matches)
        frameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (id) {
        const layer = ORGAN_BY_ID[id].layer
        if (layer === 'skeleton' || layer === 'muscles' || layer === 'organs')
          setLayers((l) => (l[layer] ? l : { ...l, [layer]: true }))
      }
      if (urlMode === 'path') {
        // organ pages: another organ is another page (title, breadcrumb, related guides, metadata)
        if (id && id !== initial) router.push(`/organ/${id}`, { scroll: false })
        return
      }
      // homepage: reflect selection in the URL without a navigation
      const url = new URL(window.location.href)
      if (id) url.searchParams.set('organ', id)
      else url.searchParams.delete('organ')
      window.history.replaceState(window.history.state, '', url)
    },
    [urlMode, mobilePanel, initial, router],
  )

  // cross-links elsewhere on the page (food explorer, nutrient index) select organs via an event
  useEffect(() => {
    const on = (e: Event) => select((e as CustomEvent<OrganId>).detail)
    window.addEventListener(ORGAN_EVENT, on)
    return () => window.removeEventListener(ORGAN_EVENT, on)
  }, [select])

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = selected ? ORGAN_IDS.indexOf(selected) : dir === 1 ? -1 : 0
      select(ORGAN_IDS[(i + dir + ORGAN_IDS.length) % ORGAN_IDS.length])
    },
    [selected, select],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input,textarea,select,[role="dialog"]')) return
      if (e.key === 'Escape' && selected && urlMode === 'query') select(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, select, urlMode])

  const organ = selected ? ORGAN_BY_ID[selected] : null
  const sheet = mobilePanel === 'sheet'
  const desktop = useMediaQuery('(min-width: 1024px)')
  // the collapsed sheet covers ~52 % of the viewport; the body frame is ~72 %, so ≈ 45 % of the frame
  const bottomInset = sheet && organ && !desktop ? (sheetExpanded ? 0.8 : 0.45) : 0

  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-4 md:px-8 lg:h-[calc(100svh-64px)] lg:min-h-[700px] lg:grid-cols-[250px_minmax(0,1fr)_420px] lg:gap-6 lg:py-4 xl:grid-cols-[270px_minmax(0,1fr)_460px]">
      {/* body — first on mobile */}
      <div
        ref={frameRef}
        className="relative order-1 h-[72svh] min-h-[480px] scroll-mt-16 lg:order-2 lg:h-auto lg:min-h-0"
      >
        <BodyCanvas
          selected={selected}
          system={system}
          layers={layers}
          onSelect={select}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          resetKey={resetKey}
          onReset={() => setResetKey((k) => k + 1)}
          bottomInset={bottomInset}
        />
      </div>

      {/* controls */}
      <div className="order-2 lg:order-1 lg:min-h-0 lg:overflow-y-auto">
        <ExplorerControls
          selected={selected}
          onSelect={select}
          system={system}
          onSystem={setSystem}
          layers={layers}
          onLayers={setLayers}
          titleAs="p"
        />
      </div>

      {/* panel — side column on desktop; bottom sheet or inline on mobile */}
      <div
        className={cx(
          'lg:border-line lg:bg-ink-2/70 order-3 lg:static lg:flex lg:max-h-none lg:min-h-0 lg:flex-col lg:overflow-hidden lg:rounded-3xl lg:border lg:shadow-none lg:backdrop-blur-xl',
          sheet && organ
            ? cx(
                'fade-up border-line-strong bg-ink-2/95 fixed inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-3xl border-t shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-[max-height] duration-300',
                sheetExpanded ? 'max-h-[88svh]' : 'max-h-[52svh]',
              )
            : sheet
              ? 'hidden'
              : 'border-line bg-ink-2/70 rounded-3xl border',
        )}
      >
        {sheet && organ && (
          <button
            type="button"
            onClick={() => setSheetExpanded((x) => !x)}
            className="flex w-full shrink-0 flex-col items-center gap-1 pt-2 lg:hidden"
            aria-label={sheetExpanded ? 'Sbalit panel' : 'Rozbalit panel'}
            aria-expanded={sheetExpanded}
          >
            <span className="h-1 w-10 rounded-full bg-white/25" />
            <ChevronUp
              size={14}
              className={cx('text-subtle transition', sheetExpanded && 'rotate-180')}
              aria-hidden
            />
          </button>
        )}
        {organ ? (
          <OrganPanel
            organ={organ}
            onClose={urlMode === 'query' ? () => select(null) : undefined}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            variant={urlMode === 'path' ? 'page' : 'panel'}
          />
        ) : (
          <PanelIntro onSelect={select} />
        )}
      </div>
    </div>
  )
}
