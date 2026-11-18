import { FlaskConical, Images, LineChart, MessageCircle } from 'lucide-react'
import { BODY_PATH } from '@/components/anatomy/geometry'

/**
 * What Pro looks like — small, honest illustrations of the Pro tools with SAMPLE data
 * (clearly labelled), so visitors see the value before they sign up.
 */
export function ProPreview({ coachLive }: { coachLive: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2" data-testid="pro-preview">
      <Card
        icon={LineChart}
        title="Grafy progresu"
        text="Vidíte, jestli síla opravdu roste — po cvicích, týdnech i měsících."
      >
        <ProgressChart />
      </Card>
      <Card
        icon={Images}
        title="Fotky pokroku"
        text="Soukromé fotky vedle sebe ve stejném světle a úhlu. Změny, které v zrcadle nevidíte."
      >
        <PhotoCompare />
      </Card>
      <Card
        icon={FlaskConical}
        title="Čtení laboratorních výsledků"
        text="Vyfoťte výsledky krevních testů — hodnoty se samy přepíšou do tabulky a grafu."
      >
        <LabTable />
      </Card>
      <Card
        icon={MessageCircle}
        title="AI kouč nad vašimi daty"
        text="Ptejte se na svůj trénink, jídlo a výsledky. Odpovídá s ohledem na to, co jste zapsali."
        badge={coachLive ? undefined : 'brzy'}
      >
        <Chat />
      </Card>
    </div>
  )
}

function Card({
  icon: Icon,
  title,
  text,
  badge,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  text: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <figure className="card flex flex-col overflow-hidden">
      <div className="border-line relative border-b bg-white/[0.015] p-4">
        {children}
        <span className="text-subtle absolute top-2 right-3 font-mono text-[10.5px] tracking-wider uppercase">
          ukázka
        </span>
      </div>
      <figcaption className="p-5">
        <p className="flex items-center gap-2 text-[16px] font-medium">
          <Icon size={17} className="text-cyan" />
          {title}
          {badge && (
            <span className="border-line text-subtle rounded-full border px-2 py-0.5 font-mono text-[11px]">
              {badge}
            </span>
          )}
        </p>
        <p className="text-muted mt-1.5 text-[14.5px]">{text}</p>
      </figcaption>
    </figure>
  )
}

/** sample: estimated 1RM on the bench press over 12 weeks */
function ProgressChart() {
  const data = [60, 61, 61, 63, 64, 64, 66, 67, 68, 68, 70, 72]
  const w = 460
  const h = 120
  const x = (i: number) => 24 + (i / (data.length - 1)) * (w - 40)
  const y = (v: number) => h - 18 - ((v - 56) / (76 - 56)) * (h - 34)
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-[132px] w-full"
      role="img"
      aria-label="Ukázkový graf: odhad maxima na bench pressu za 12 týdnů stoupl z 60 na 72 kg"
    >
      {[60, 65, 70, 75].map((v) => (
        <g key={v}>
          <line x1={24} x2={w - 16} y1={y(v)} y2={y(v)} stroke="#9fdcff" strokeOpacity={0.08} />
          <text x={2} y={y(v) + 3} fontSize={8} fill="#7f8b96" fontFamily="var(--font-geist-mono)">
            {v}
          </text>
        </g>
      ))}
      <path
        d={`${line} L${x(data.length - 1)},${h - 18} L${x(0)},${h - 18} Z`}
        fill="#5ee7ff"
        fillOpacity={0.08}
      />
      <path
        d={line}
        fill="none"
        stroke="#5ee7ff"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={x(data.length - 1)} cy={y(72)} r={3.5} fill="#5ee7ff" />
      <text
        x={x(data.length - 1) - 4}
        y={y(72) - 8}
        fontSize={9}
        textAnchor="end"
        fill="#eef3f7"
        fontFamily="var(--font-geist-mono)"
      >
        +12 kg
      </text>
      <text x={24} y={h - 4} fontSize={8} fill="#7f8b96" fontFamily="var(--font-geist-mono)">
        Bench press · odhad 1RM · 12 týdnů
      </text>
    </svg>
  )
}

function PhotoCompare() {
  // the site's anatomical silhouette; "after" is a touch leaner at the waist and broader at the shoulders
  const frame = (x: number, label: string, sx: number) => (
    <g>
      <rect x={x} y={4} width={150} height={124} rx={8} fill="#0f1720" />
      <svg x={x} y={10} width={150} height={114} viewBox="0 0 400 920">
        <path
          d={BODY_PATH}
          fill="#9fdcff"
          fillOpacity={0.16}
          stroke="#9fdcff"
          strokeOpacity={0.45}
          strokeWidth={5}
          transform={`translate(${200 - 200 * sx},0) scale(${sx},1)`}
        />
      </svg>
      <text x={x + 10} y={20} fontSize={9} fill="#a3b0bd" fontFamily="var(--font-geist-mono)">
        {label}
      </text>
    </g>
  )
  return (
    <svg
      viewBox="0 0 330 132"
      className="h-[132px] w-full"
      role="img"
      aria-label="Ukázka porovnání fotek: leden a duben"
    >
      {frame(6, 'leden', 1.04)}
      <line x1={165} x2={165} y1={10} y2={122} stroke="#5ee7ff" strokeOpacity={0.5} strokeDasharray="3 3" />
      {frame(174, 'duben', 0.97)}
    </svg>
  )
}

function LabTable() {
  const rows: [string, string, string, 'ok' | 'low'][] = [
    ['Feritin', '24 µg/l', '30–400', 'low'],
    ['Vitamín D (25-OH)', '68 nmol/l', '50–125', 'ok'],
    ['Vitamín B12', '410 pmol/l', '150–650', 'ok'],
  ]
  return (
    <table className="w-full font-mono text-[12px]" aria-label="Ukázka přečtených výsledků">
      <thead className="sr-only">
        <tr>
          <th scope="col">Ukazatel</th>
          <th scope="col">Hodnota</th>
          <th scope="col">Referenční rozmezí</th>
        </tr>
      </thead>
      <tbody className="divide-line divide-y">
        {rows.map(([name, val, ref, st]) => (
          <tr key={name}>
            <td className="text-muted py-2 font-sans text-[13px]">{name}</td>
            <td className={`py-2 text-right ${st === 'low' ? 'text-warn' : 'text-fg'}`}>{val}</td>
            <td className="text-subtle py-2 pl-3 text-right">{ref}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Chat() {
  return (
    <div className="space-y-2 pt-5 text-[13px]">
      <p className="bg-cyan/10 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md px-3 py-2">
        Proč mi poslední 2 týdny stojí bench?
      </p>
      <p className="text-muted w-fit max-w-[90%] rounded-2xl rounded-bl-md border border-white/10 px-3 py-2">
        Za 14 dní jste spali v průměru 6 h 10 min a bílkovin jste měli 1,1 g/kg. Obojí je pod tím, co nárůst
        síly podporuje — zkuste nejdřív spánek…
      </p>
    </div>
  )
}
