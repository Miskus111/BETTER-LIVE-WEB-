'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { QUIZ, QUIZ_LENGTH, type QuizItem } from '@/data/quiz'
import { BODY_GUIDE_BY_SLUG } from '@/data/body-guides'
import { cx } from '@/lib/format'
import { ShareButton } from './ShareButton'

function shuffle<T>(a: T[]) {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

/** half myths, half facts, in random order */
function pickRound(): QuizItem[] {
  const half = Math.floor(QUIZ_LENGTH / 2)
  const myths = shuffle(QUIZ.filter((q) => !q.fact)).slice(0, QUIZ_LENGTH - half)
  const facts = shuffle(QUIZ.filter((q) => q.fact)).slice(0, half)
  return shuffle([...myths, ...facts])
}

function verdict(score: number, total: number) {
  const r = score / total
  if (r === 1) return 'Bez chyby. Mýty na vás neplatí.'
  if (r >= 0.8) return 'Výborně — víte víc než většina internetu.'
  if (r >= 0.6) return 'Dobrý základ. Pár mýtů vás ještě dostalo.'
  return 'Mýty umí být přesvědčivé. Průvodci vám pomůžou.'
}

type Answer = { item: QuizItem; said: boolean }

export function MythQuiz() {
  const [round, setRound] = useState<QuizItem[] | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)

  const start = () => {
    setRound(pickRound())
    setAnswers([])
    setRevealed(false)
    setFinished(false)
  }

  if (!round) {
    return (
      <div className="card p-6 md:p-8" data-testid="quiz">
        <p className="text-[16px]">
          {QUIZ_LENGTH} výroků o těle. U každého tipněte, jestli jde o <strong>fakt</strong>, nebo{' '}
          <strong>mýtus</strong>. Po odpovědi uvidíte vysvětlení a odkaz na průvodce se zdroji.
        </p>
        <button type="button" className="btn btn-primary mt-6" onClick={start} data-testid="quiz-start">
          Začít kvíz <ArrowRight size={16} aria-hidden />
        </button>
      </div>
    )
  }

  const score = answers.filter((a) => a.said === a.item.fact).length

  if (finished) {
    const missed = answers.filter((a) => a.said !== a.item.fact)
    return (
      <div className="card p-6 md:p-8" data-testid="quiz-result">
        <p className="eyebrow">Výsledek</p>
        <p className="display mt-2 text-[56px] leading-none">
          {score}
          <span className="text-subtle text-[32px]"> / {round.length}</span>
        </p>
        <p className="mt-3 text-[17px]">{verdict(score, round.length)}</p>

        {missed.length > 0 && (
          <div className="mt-6">
            <h2 className="eyebrow mb-3">Na tyhle si posvítit</h2>
            <ul className="grid gap-2">
              {missed.map(({ item }) => (
                <li key={item.id}>
                  <Link
                    href={`/jak-funguje-telo/${item.guide}`}
                    className="card hover:border-cyan/40 flex items-center gap-3 p-3 transition"
                  >
                    <span className="flex-1 text-[14.5px]">
                      „{item.statement}“ <span className="text-subtle">— {item.fact ? 'fakt' : 'mýtus'}</span>
                    </span>
                    <ArrowRight size={15} className="text-cyan shrink-0" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={start}>
            <RotateCcw size={15} aria-hidden /> Hrát znovu
          </button>
          <ShareButton
            title="Mýtus, nebo fakt? — kvíz o těle"
            text={`Mám ${score}/${round.length} v kvízu Mýtus, nebo fakt? Zkus to taky:`}
            label="Sdílet výsledek"
          />
        </div>
      </div>
    )
  }

  const idx = revealed ? answers.length - 1 : answers.length
  const item = round[idx]
  const last = answers[answers.length - 1]
  const correct = revealed && last.said === item.fact
  const guide = BODY_GUIDE_BY_SLUG[item.guide]

  const answer = (said: boolean) => {
    if (revealed) return
    setAnswers((a) => [...a, { item, said }])
    setRevealed(true)
  }

  return (
    <div className="card p-6 md:p-8" data-testid="quiz">
      <div className="flex items-center justify-between gap-3">
        <p className="text-subtle font-mono text-[13px]">
          {idx + 1} / {round.length}
        </p>
        <p className="text-subtle font-mono text-[13px]">skóre {score}</p>
      </div>
      <div className="bg-line mt-2 h-1 overflow-hidden rounded-full" aria-hidden>
        <div
          className="bg-cyan h-full transition-all"
          style={{ width: `${((idx + (revealed ? 1 : 0)) / round.length) * 100}%` }}
        />
      </div>

      <p
        className="display mt-6 min-h-[2.4em] text-[28px] leading-tight md:text-[36px]"
        data-testid="quiz-statement"
      >
        „{item.statement}“
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          { said: true, label: 'Fakt' },
          { said: false, label: 'Mýtus' },
        ].map((b) => {
          const chosen = revealed && last.said === b.said
          const right = revealed && item.fact === b.said
          return (
            <button
              key={b.label}
              type="button"
              onClick={() => answer(b.said)}
              disabled={revealed}
              aria-pressed={chosen}
              className={cx(
                'flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-[17px] font-medium transition',
                !revealed && 'border-line hover:border-cyan/60 hover:bg-cyan/[0.05]',
                revealed && right && 'border-[#4ade80]/60 bg-[#4ade80]/10',
                revealed && chosen && !right && 'border-[#ff9b9b]/60 bg-[#ff9b9b]/10',
                revealed && !right && !chosen && 'border-line opacity-50',
              )}
            >
              {revealed && right && <Check size={18} aria-hidden />}
              {revealed && chosen && !right && <X size={18} aria-hidden />}
              {b.label}
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {revealed && (
          <div className="mt-6" data-testid="quiz-explain">
            <p className="text-[16px] font-medium">
              {correct ? 'Správně!' : 'Vedle.'} Je to {item.fact ? 'fakt' : 'mýtus'}.
            </p>
            <p className="text-muted mt-1.5 text-[15px]">{item.explain}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => (answers.length === round.length ? setFinished(true) : setRevealed(false))}
                data-testid="quiz-next"
                autoFocus
              >
                {answers.length === round.length ? 'Zobrazit výsledek' : 'Další otázka'}{' '}
                <ArrowRight size={16} aria-hidden />
              </button>
              {guide && (
                <Link href={`/jak-funguje-telo/${guide.slug}`} className="link text-[14px]">
                  Průvodce: {guide.short}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
