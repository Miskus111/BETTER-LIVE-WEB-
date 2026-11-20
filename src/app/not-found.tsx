import Link from 'next/link'
import { NotFoundSuggestions } from '@/components/layout/NotFoundSuggestions'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-3 text-[52px]">Na této adrese nic není.</h1>
      <p className="text-muted mt-3">Orgán, potravina ani stránka, kterou hledáte, tu neexistuje.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Zpět na tělo
        </Link>
        <Link href="/jak-funguje-telo" className="btn btn-ghost">
          Jak funguje tělo
        </Link>
      </div>
      <NotFoundSuggestions />
    </div>
  )
}
