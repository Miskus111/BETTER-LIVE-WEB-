import { useId } from 'react'

export function Logo({ size = 28 }: { size?: number }) {
  // unique per instance: a hidden copy (e.g. desktop sidebar) must not own the gradient
  const g = `logo-g-${useId().replace(/:/g, '')}`
  return (
    <span className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5ee7ff" />
            <stop offset="100%" stopColor="#4aa3ff" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="14.5" fill="none" stroke={`url(#${g})`} strokeOpacity="0.5" />
        <circle cx="16" cy="10" r="3.2" fill={`url(#${g})`} />
        <path
          d="M16 14.5 V26 M10.5 17 L16 15.5 L21.5 17 M12.5 26 L16 20.5 L19.5 26"
          stroke={`url(#${g})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="text-fg font-mono text-[15px] font-semibold tracking-[0.28em]">BLWB</span>
    </span>
  )
}
