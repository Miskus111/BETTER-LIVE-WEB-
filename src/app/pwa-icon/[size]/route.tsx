import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const generateStaticParams = () => [{ size: '192' }, { size: '512' }, { size: 'maskable-512' }]

/** PNG app icons for the web manifest, drawn from the logo mark. */
export async function GET(_: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params
  const maskable = size.startsWith('maskable')
  const px = Number(size.replace('maskable-', '')) || 512
  const mark = maskable ? px * 0.6 : px * 0.82
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#07090c',
        borderRadius: maskable ? 0 : px * 0.22,
      }}
    >
      <svg width={mark} height={mark} viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14.5" fill="none" stroke="#5ee7ff" strokeOpacity="0.55" />
        <circle cx="16" cy="10" r="3.2" fill="#5ee7ff" />
        <path
          d="M16 14.5 V26 M10.5 17 L16 15.5 L21.5 17 M12.5 26 L16 20.5 L19.5 26"
          stroke="#5ee7ff"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>,
    { width: px, height: px },
  )
}
