import type { ArtKind } from '@/data/types'

/** Stylised, studio-lit illustrations used in place of photography in this prototype. */
export function FoodArt({
  kind,
  a,
  b,
  className = '',
}: {
  kind: ArtKind
  a: string
  b: string
  className?: string
}) {
  const id = `g${kind}${a.slice(1)}`
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" className={className} aria-hidden>
      <defs>
        <radialGradient id={id + 'bg'} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={a} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0a0d12" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={b} />
          <stop offset="100%" stopColor={a} />
        </linearGradient>
        <radialGradient id={id + 'sh'} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill={`url(#${id}bg)`} />
      <ellipse cx="100" cy="132" rx="62" ry="9" fill={`url(#${id}sh)`} />
      {render(kind, `url(#${id})`, a, b)}
    </svg>
  )
}

function render(kind: ArtKind, g: string, a: string, b: string) {
  const hi = (
    <ellipse cx="80" cy="62" rx="14" ry="6" fill="#fff" opacity="0.25" transform="rotate(-20 80 62)" />
  )
  switch (kind) {
    case 'steak':
      return (
        <g>
          <path
            d="M48,92 C40,64 70,44 104,48 C140,52 160,72 152,98 C146,118 112,126 84,120 C64,116 52,106 48,92 Z"
            fill={g}
          />
          <path
            d="M70,70 C90,64 112,72 128,66 M66,92 C86,84 116,96 138,86"
            stroke={b}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M48,92 C52,106 64,116 84,120 C112,126 146,118 152,98"
            stroke="#fff"
            strokeOpacity="0.5"
            strokeWidth="5"
            fill="none"
          />
          {hi}
        </g>
      )
    case 'liver':
      return (
        <g>
          <path
            d="M44,90 C40,66 76,50 112,54 C148,58 162,80 150,100 C136,120 96,118 72,112 C56,108 46,100 44,90 Z"
            fill={g}
          />
          {hi}
        </g>
      )
    case 'poultry':
      return (
        <g>
          <path
            d="M50,96 C44,70 74,48 112,54 C146,60 158,84 146,104 C132,122 82,122 62,114 C54,110 51,104 50,96 Z"
            fill={g}
          />
          <path d="M76,78 C96,74 118,80 134,92" stroke={a} strokeWidth="3" fill="none" opacity="0.5" />
          {hi}
        </g>
      )
    case 'fish':
      return (
        <g>
          <path
            d="M36,84 C60,52 120,50 150,78 L176,60 L170,84 L178,108 L150,92 C120,118 62,118 36,84 Z"
            fill={g}
          />
          <circle cx="58" cy="80" r="4" fill="#0a0d12" />
          <path
            d="M78,70 C84,80 84,92 78,100 M100,66 C106,80 106,94 100,106 M122,68 C127,80 127,94 122,104"
            stroke="#fff"
            strokeOpacity="0.35"
            strokeWidth="2"
            fill="none"
          />
          {hi}
        </g>
      )
    case 'egg':
      return (
        <g>
          <ellipse cx="82" cy="86" rx="30" ry="40" fill="#f3e9da" />
          <ellipse cx="74" cy="70" rx="8" ry="12" fill="#fff" opacity="0.6" />
          <path
            d="M112,104 C108,78 124,66 142,70 C162,74 166,98 156,112 C146,124 116,124 112,104 Z"
            fill="#fffaf2"
          />
          <circle cx="138" cy="96" r="14" fill={a} />
          <circle cx="134" cy="92" r="4" fill="#fff" opacity="0.5" />
        </g>
      )
    case 'bowl':
      return (
        <g>
          <ellipse cx="100" cy="74" rx="56" ry="14" fill={a} />
          <path d="M44,74 C48,112 72,126 100,126 C128,126 152,112 156,74 Z" fill={b} />
          <path
            d="M70,70 C84,62 108,66 128,74"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.6"
            fill="none"
          />
          <path
            d="M52,86 C64,112 90,118 100,118"
            stroke="#fff"
            strokeOpacity="0.3"
            strokeWidth="3"
            fill="none"
          />
        </g>
      )
    case 'bottle':
      return (
        <g>
          <rect x="80" y="34" width="40" height="14" rx="3" fill={b} />
          <path
            d="M78,52 L122,52 C130,60 132,70 132,80 L132,118 C132,124 128,128 122,128 L78,128 C72,128 68,124 68,118 L68,80 C68,70 70,60 78,52 Z"
            fill={a}
          />
          <rect x="72" y="82" width="56" height="30" rx="3" fill={b} opacity="0.85" />
          <rect x="76" y="58" width="6" height="64" rx="3" fill="#fff" opacity="0.4" />
        </g>
      )
    case 'jar':
      return (
        <g>
          <rect x="64" y="38" width="72" height="14" rx="4" fill="#cfd6dd" />
          <rect
            x="60"
            y="50"
            width="80"
            height="78"
            rx="12"
            fill="#e9f3f7"
            opacity="0.18"
            stroke="#fff"
            strokeOpacity="0.4"
          />
          <rect x="64" y="64" width="72" height="60" rx="9" fill={g} />
          <path
            d="M70,80 C86,72 100,88 116,78 C124,74 130,80 132,84 M70,100 C84,92 102,108 118,98"
            stroke="#fff"
            strokeOpacity="0.45"
            strokeWidth="2.5"
            fill="none"
          />
          <rect x="66" y="54" width="6" height="66" rx="3" fill="#fff" opacity="0.35" />
        </g>
      )
    case 'cheese':
      return (
        <g>
          <path d="M44,106 L148,72 L158,112 L54,128 Z" fill={a} />
          <path d="M44,106 L148,72 L136,58 Z" fill={b} />
          <circle cx="90" cy="108" r="7" fill="#d9a83a" />
          <circle cx="122" cy="100" r="5" fill="#d9a83a" />
          <circle cx="70" cy="118" r="4" fill="#d9a83a" />
        </g>
      )
    case 'banana':
      return (
        <g>
          <path
            d="M40,70 C60,118 132,128 164,84 C166,80 160,76 156,80 C126,108 76,104 52,64 C48,58 38,62 40,70 Z"
            fill={g}
          />
          <path d="M156,80 L166,72" stroke="#5a4a1a" strokeWidth="5" strokeLinecap="round" />
          <path
            d="M60,80 C80,100 120,104 148,88"
            stroke="#fff"
            strokeOpacity="0.35"
            strokeWidth="3"
            fill="none"
          />
        </g>
      )
    case 'citrus':
      return (
        <g>
          <circle cx="80" cy="86" r="36" fill={g} />
          <circle cx="70" cy="74" r="8" fill="#fff" opacity="0.3" />
          <circle cx="136" cy="96" r="26" fill={b} />
          <circle cx="136" cy="96" r="21" fill={a} opacity="0.85" />
          {Array.from({ length: 8 }, (_, i) => {
            const t = (i * Math.PI) / 4
            return (
              <line
                key={i}
                x1="136"
                y1="96"
                x2={136 + Math.cos(t) * 20}
                y2={96 + Math.sin(t) * 20}
                stroke={b}
                strokeWidth="2"
              />
            )
          })}
        </g>
      )
    case 'berries':
      return (
        <g>
          {[
            [70, 92, 18],
            [100, 78, 20],
            [128, 96, 18],
            [96, 108, 16],
            [124, 70, 13],
            [66, 68, 12],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={g} />
              <circle cx={x - r / 3} cy={y - r / 3} r={r / 4} fill="#fff" opacity="0.35" />
            </g>
          ))}
        </g>
      )
    case 'leaf':
      return (
        <g>
          <path d="M44,116 C40,70 80,40 150,42 C152,92 120,124 64,122 Z" fill={g} />
          <path d="M50,118 C80,96 110,72 146,46" stroke={b} strokeWidth="3" fill="none" />
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${70 + i * 18},${102 - i * 16} l${10 + i},${-22 + i * 2}`}
              stroke={b}
              strokeWidth="1.6"
              opacity="0.8"
            />
          ))}
        </g>
      )
    case 'carrot':
      return (
        <g>
          <path d="M52,58 C60,50 72,52 78,60 L156,118 C160,122 156,126 152,124 Z" fill={g} />
          <path
            d="M54,58 C42,40 40,30 46,26 M58,54 C56,34 62,26 70,28 M62,56 C70,40 80,36 86,40"
            stroke={b}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M90,78 l8,-4 M108,92 l8,-4 M126,104 l7,-3"
            stroke="#fff"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
        </g>
      )
    case 'potato':
      return (
        <g>
          <path
            d="M48,92 C44,66 70,52 100,56 C134,60 156,72 152,98 C148,120 108,124 82,118 C62,114 50,106 48,92 Z"
            fill={g}
          />
          {[
            [76, 80],
            [112, 74],
            [128, 100],
            [92, 104],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill={a} />
          ))}
          {hi}
        </g>
      )
    case 'seeds':
      return (
        <g>
          {Array.from({ length: 14 }, (_, i) => {
            const x = 56 + (i % 5) * 22 + (Math.floor(i / 5) % 2) * 10,
              y = 78 + Math.floor(i / 5) * 18
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="11"
                ry="6"
                transform={`rotate(${((i * 37) % 80) - 40} ${x} ${y})`}
                fill={g}
                stroke={b}
                strokeOpacity="0.5"
              />
            )
          })}
        </g>
      )
    case 'nut':
      return (
        <g>
          {[
            [72, 84, -20],
            [104, 76, 10],
            [134, 92, 30],
            [92, 106, -5],
            [122, 112, 20],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <path
                d={`M${x - 18},${y} C${x - 14},${y - 14} ${x + 8},${y - 14} ${x + 20},${y} C${x + 8},${y + 12} ${x - 14},${y + 12} ${x - 18},${y} Z`}
                fill={g}
              />
              <path
                d={`M${x - 10},${y - 2} C${x - 2},${y - 6} ${x + 6},${y - 4} ${x + 12},${y}`}
                stroke={b}
                strokeWidth="1.2"
                fill="none"
              />
            </g>
          ))}
        </g>
      )
    case 'walnut':
      return (
        <g>
          {[
            [80, 88],
            [126, 94],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="28" fill={g} />
              <path
                d={`M${x},${y - 26} C${x - 8},${y - 10} ${x + 8},${y + 10} ${x},${y + 26} M${x - 18},${y - 12} C${x - 8},${y - 4} ${x - 14},${y + 8} ${x - 20},${y + 14} M${x + 18},${y - 12} C${x + 8},${y - 4} ${x + 14},${y + 8} ${x + 20},${y + 14}`}
                stroke={a}
                strokeWidth="2.5"
                fill="none"
              />
            </g>
          ))}
        </g>
      )
    case 'pulses':
      return (
        <g>
          <ellipse cx="100" cy="104" rx="58" ry="14" fill="#1b2027" />
          {Array.from({ length: 26 }, (_, i) => {
            const x = 54 + ((i * 37) % 92),
              y = 74 + ((i * 53) % 34)
            return <ellipse key={i} cx={x} cy={y} rx="7" ry="5" fill={g} stroke={a} strokeOpacity="0.4" />
          })}
        </g>
      )
    case 'oats':
      return (
        <g>
          <ellipse cx="100" cy="100" rx="60" ry="18" fill={a} opacity="0.4" />
          {Array.from({ length: 24 }, (_, i) => {
            const x = 52 + ((i * 41) % 96),
              y = 70 + ((i * 29) % 40)
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="9"
                ry="6"
                transform={`rotate(${((i * 47) % 90) - 45} ${x} ${y})`}
                fill={g}
                stroke="#fff"
                strokeOpacity="0.25"
              />
            )
          })}
        </g>
      )
    case 'oil':
      return (
        <g>
          <rect x="90" y="22" width="20" height="16" rx="3" fill="#2b2f36" />
          <path
            d="M92,38 L108,38 L110,54 C128,62 134,74 134,88 L134,122 C134,126 130,130 126,130 L74,130 C70,130 66,126 66,122 L66,88 C66,74 72,62 90,54 Z"
            fill={g}
            opacity="0.95"
          />
          <rect x="74" y="86" width="52" height="28" rx="3" fill="#0d1116" opacity="0.6" />
          <rect x="72" y="64" width="6" height="58" rx="3" fill="#fff" opacity="0.35" />
        </g>
      )
  }
}
