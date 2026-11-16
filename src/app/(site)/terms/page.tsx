import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Podmínky užívání', alternates: { canonical: '/terms' } }

const POINTS = [
  ['Pro koho', 'Aplikace je určena pouze osobám starším 18 let.'],
  [
    'Není to zdravotnický prostředek',
    'Better Live with Biohacking slouží ke vzdělávání a wellness. Nediagnostikuje, nepředepisuje léčbu a nenahrazuje lékaře, fyzioterapeuta ani nutričního terapeuta. Při varovných příznacích vyhledejte lékařskou pomoc.',
  ],
  [
    'AI kouč',
    'Odpovědi AI kouče jsou obecné informace, mohou být nepřesné a vždy je posuzujte s rozvahou. Kouč odmítá témata mimo výživu, trénink, regeneraci, mobilitu a zdravý vzhled.',
  ],
  [
    'Zakázané použití',
    'Aplikaci nelze používat k získání informací o anabolických steroidech, SARMs, peptidech, výzkumných chemikáliích, sebepoškozování ani jiných nebezpečných praktikách.',
  ],
  [
    'Partnerské odkazy',
    'Některé odkazy na obchody jsou partnerské (affiliate). Výběr produktů na nich nezávisí.',
  ],
  ['Předplatné', 'Všechny funkce jsou nyní zdarma. Případné placené funkce budou předem jasně označené.'],
] as const

/** PLACEHOLDER legal text — must be reviewed by a lawyer before launch (see README). */
export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 md:px-8">
      <p className="eyebrow">Právní informace · návrh</p>
      <h1 className="display mt-3 text-[44px] md:text-[56px]">Podmínky užívání</h1>
      <p className="border-warn/30 bg-warn/[0.06] mt-6 rounded-xl border p-4 text-[14px]">
        Pracovní verze — před spuštěním ji musí zkontrolovat právník.
      </p>
      {POINTS.map(([t, d]) => (
        <section key={t} className="mt-8">
          <h2 className="display text-[26px]">{t}</h2>
          <p className="text-fg/90 mt-2 text-[15.5px]">{d}</p>
        </section>
      ))}
    </article>
  )
}
