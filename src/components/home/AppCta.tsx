import Link from 'next/link'
import { Activity, ArrowRight, Dumbbell, FlaskConical, MessageCircle, Pill, Utensils } from 'lucide-react'

const FEATURES = [
  {
    icon: Dumbbell,
    title: 'Trénink',
    text: 'Zapisujte série, váhy a osobní rekordy. Funguje i offline v posilovně.',
  },
  { icon: Utensils, title: 'Jídelníček', text: 'Kalorie, bílkoviny a vitamíny oproti vašim osobním cílům.' },
  { icon: Pill, title: 'Doplňky', text: 'Váš stack s hlídáním horních limitů a interakcí s léky.' },
  {
    icon: FlaskConical,
    title: 'Krevní testy',
    text: 'Vložte výsledky z laboratoře a sledujte, jak se hodnoty mění.',
  },
  {
    icon: Activity,
    title: 'Bolest a mobilita',
    text: 'Mapa bolesti, varovné příznaky a krátké rutiny na míru.',
  },
  {
    icon: MessageCircle,
    title: 'AI kouč',
    text: 'Zeptejte se na svá data — trénink, jídlo, doplňky i výsledky.',
  },
]

/** Bridge from the education site to the personal app (diary, training, labs). */
export function AppCta({ compact = false }: { compact?: boolean }) {
  if (compact)
    return (
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/login?mode=signup" className="btn btn-primary">
          Začít zapisovat zdarma <ArrowRight size={16} aria-hidden />
        </Link>
        <Link href="/today" className="btn btn-ghost">
          Moje aplikace
        </Link>
      </div>
    )

  return (
    <section id="aplikace" aria-labelledby="aplikace-title" className="scroll-mt-16 pt-20 md:pt-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="card border-cyan/25 relative overflow-hidden p-6 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_80%_0%,rgba(58,168,255,0.12),transparent_70%)]"
            aria-hidden
          />
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <p className="eyebrow">Aplikace BLWB · zdarma</p>
              <h2 id="aplikace-title" className="display mt-3 text-[38px] md:text-[54px]">
                Od teorie k&nbsp;<em className="text-cyan">vašim datům.</em>
              </h2>
              <p className="text-muted mt-4 max-w-xl text-[15.5px]">
                Všechno, co se tady dozvíte, si můžete rovnou zapisovat a sledovat. Jeden účet, data uložená
                v&nbsp;EU, kdykoli si je stáhnete nebo smažete.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/login?mode=signup" className="btn btn-primary" data-testid="cta-signup">
                  Vytvořit účet zdarma <ArrowRight size={16} aria-hidden />
                </Link>
                <Link href="/today" className="btn btn-ghost">
                  Už mám účet — otevřít aplikaci
                </Link>
              </div>
              <p className="text-subtle mt-3 text-[13px]">
                Pro dospělé (18+). Nenahrazuje lékaře ani trenéra.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="border-line rounded-2xl border p-4">
                  <Icon size={18} className="text-cyan" aria-hidden />
                  <p className="mt-2 text-[15px] font-medium">{title}</p>
                  <p className="text-muted mt-1 text-[13.5px]">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
