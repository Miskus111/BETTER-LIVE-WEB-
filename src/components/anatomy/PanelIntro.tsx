import { Layers, MousePointerClick, Search, ZoomIn } from 'lucide-react'
import type { OrganId } from '@/data/types'
import { ORGAN_BY_ID } from '@/data/organs'
import { EvidenceLegend } from '@/components/ui/EvidenceBadge'

const STEPS = [
  {
    icon: MousePointerClick,
    t: 'Vyberte orgán',
    d: 'Klikněte na něj na těle nebo ho zvolte v seznamu vlevo.',
  },
  {
    icon: ZoomIn,
    t: 'Přibližte a posuňte',
    d: 'Dvojklikem přiblížíte, tažením posunete, ⤢ vrátí celé tělo.',
  },
  {
    icon: Layers,
    t: 'Filtrujte pohled',
    d: 'Zobrazte jednu soustavu nebo zapínejte orgány, kostru a svaly.',
  },
  { icon: Search, t: 'Hledejte cokoli', d: 'Zkratkou ⌘K najdete orgán, živinu, potravinu nebo produkt.' },
]

const QUICK: OrganId[] = ['brain', 'heart', 'intestines', 'bones']

export function PanelIntro({ onSelect }: { onSelect: (id: OrganId) => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <span className="eyebrow">Jak to funguje</span>
      <h2 className="display mt-3 text-[32px]">Co který orgán potřebuje — a proč?</h2>
      <p className="text-muted mt-3 text-[14.5px]">
        Každé propojení živiny s orgánem má hodnocení důkazů. Každé propojení s potravinou je vypočtené z dat
        USDA, nikdy vybrané ručně.
      </p>

      <ol className="mt-6 grid gap-4">
        {STEPS.map(({ icon: Icon, t, d }, i) => (
          <li key={t} className="flex gap-3">
            <span className="border-line text-cyan grid h-9 w-9 shrink-0 place-items-center rounded-xl border">
              <Icon size={16} aria-hidden />
            </span>
            <span>
              <span className="block text-[14.5px] font-medium">
                <span className="text-subtle mr-1.5 font-mono text-[12px]">0{i + 1}</span>
                {t}
              </span>
              <span className="text-muted block text-[13.5px]">{d}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-subtle font-mono text-[12px]">Začněte</span>
        {QUICK.map((id) => (
          <button key={id} type="button" onClick={() => onSelect(id)} className="chip">
            {ORGAN_BY_ID[id].shortName}
          </button>
        ))}
      </div>

      <div className="border-line mt-auto border-t pt-6">
        <h3 className="eyebrow !text-subtle mb-3">Úrovně důkazů</h3>
        <EvidenceLegend />
      </div>
    </div>
  )
}
