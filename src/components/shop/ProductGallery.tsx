'use client'

/* eslint-disable @next/next/no-img-element -- local SVG placeholders */
import { useState } from 'react'
import { cx } from '@/lib/format'

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0)
  return (
    <div>
      <div className="card overflow-hidden">
        <img
          src={images[i]}
          alt={`${name} — image ${i + 1} of ${images.length} (placeholder)`}
          className="aspect-[10/9] w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2" aria-label="Choose image">
          {images.map((src, k) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setI(k)}
                aria-label={`Show image ${k + 1}`}
                aria-current={i === k}
                className={cx(
                  'block w-20 overflow-hidden rounded-xl border-2 transition',
                  i === k ? 'border-cyan' : 'border-transparent opacity-70 hover:opacity-100',
                )}
              >
                <img src={src} alt="" className="aspect-square w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
