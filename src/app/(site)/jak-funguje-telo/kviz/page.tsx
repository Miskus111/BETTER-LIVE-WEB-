import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { MythQuiz } from '@/components/guides/MythQuiz'
import { QUIZ } from '@/data/quiz'

export const metadata: Metadata = {
  title: 'Mýtus, nebo fakt? Kvíz o tom, jak funguje tělo',
  description:
    'Dehydratuje káva? Mění se svaly v tuk? Používáme jen 10 % mozku? Otestujte se v krátkém kvízu — u každé odpovědi vysvětlení a zdroje.',
  alternates: { canonical: '/jak-funguje-telo/kviz' },
}

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 pt-8 pb-16 md:px-8 md:pt-12">
      <nav
        aria-label="Drobečková navigace"
        className="text-subtle flex flex-wrap items-center gap-1 text-[13.5px]"
      >
        <Link href="/" className="hover:text-fg">
          Domů
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link href="/jak-funguje-telo" className="hover:text-fg">
          Jak funguje tělo
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page" className="text-muted">
          Kvíz
        </span>
      </nav>
      <header className="mt-5">
        <p className="eyebrow">Kvíz</p>
        <h1 className="display mt-3 text-[44px] leading-[1.05] md:text-[64px]">
          Mýtus, <em className="text-cyan">nebo fakt?</em>
        </h1>
        <p className="text-muted mt-3 text-[16.5px]">
          Internet je plný rad o těle. Kolik z nich poznáte? Každá hra vybere jiné výroky z {QUIZ.length}{' '}
          ověřených.
        </p>
      </header>
      <div className="mt-8">
        <MythQuiz />
      </div>
    </div>
  )
}
