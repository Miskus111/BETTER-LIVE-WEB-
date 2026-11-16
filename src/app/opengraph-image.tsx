import { ImageResponse } from 'next/og'

export const alt = 'FLX — Human body × nutrition'
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
      <div style={{ display: 'flex', fontSize: 30, letterSpacing: 12, color: '#5ee7ff' }}>FLX</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 84, lineHeight: 1.02 }}>Your body, decoded.</div>
        <div style={{ fontSize: 32, marginTop: 24, color: '#a3b0bd' }}>
          Interactive anatomy · evidence-graded nutrition · organic food
        </div>
      </div>
    </div>,
    size,
  )
}
