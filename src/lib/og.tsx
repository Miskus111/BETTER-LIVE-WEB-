import { ImageResponse } from 'next/og'
import { clip } from '@/lib/format'

export const OG_SIZE = { width: 1200, height: 630 }

/** Shared 1200×630 social card: eyebrow, big title, one-line subtitle, site mark. */
export function ogCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  const t = clip(title, 70)
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: 'radial-gradient(ellipse at 75% 30%, #0f2a3f 0%, #07090c 62%)',
        color: '#eef3f7',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 28, color: '#5ee7ff' }}>
        <span style={{ letterSpacing: 10 }}>BLWB</span>
        <span style={{ color: '#3a4652' }}>·</span>
        <span style={{ color: '#a3b0bd', letterSpacing: 2 }}>{eyebrow}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: t.length > 40 ? 68 : 84, lineHeight: 1.04 }}>{t}</div>
        {subtitle && (
          <div style={{ fontSize: 30, marginTop: 26, color: '#a3b0bd', lineHeight: 1.3 }}>
            {clip(subtitle, 120)}
          </div>
        )}
      </div>
    </div>,
    OG_SIZE,
  )
}
