'use client' // error boundaries must be client components

import Link from 'next/link'
import { useEffect } from 'react'

/** Something failed while showing a page: say so plainly and offer a retry, keeping the menu and footer. */
export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center" role="alert">
      <p className="eyebrow">Chyba</p>
      <h1 className="display mt-3 text-[44px]">Tuhle stránku se nepodařilo zobrazit.</h1>
      <p className="text-muted mt-3">Může jít o výpadek připojení. Zkuste to prosím znovu.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Zkusit znovu
        </button>
        <Link href="/" className="btn btn-ghost">
          Na úvodní stránku
        </Link>
      </div>
    </div>
  )
}
