import { ImageResponse } from 'next/og'

export const alt = 'Better Live with Biohacking — Žij zdravěji, podávej lepší výkon'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: 'radial-gradient(ellipse at 70% 40%, #0f2a3f 0%, #07090c 60%)',
        color: '#eef3f7',
      }}
    >
      <div style={{ display: 'flex', fontSize: 30, letterSpacing: 12, color: '#5ee7ff' }}>BLWB</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 84, lineHeight: 1.02 }}>Tvoje tělo, rozluštěné.</div>
        <div style={{ fontSize: 32, marginTop: 24, color: '#a3b0bd' }}>
          Interaktivní anatomie · průvodci o těle · doplňky podle důkazů
        </div>
      </div>
    </div>,
    size,
  )
}
