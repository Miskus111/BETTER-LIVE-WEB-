import { OPERATOR, SITE } from '@/lib/site'

export const LEGAL_UPDATED = '2026-11-17'

export function LegalHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-3 text-[44px] md:text-[56px]">{title}</h1>
      <p className="text-subtle mt-3 text-[13.5px]">
        Platné od {new Date(LEGAL_UPDATED).toLocaleDateString('cs-CZ')}
      </p>
    </header>
  )
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="display text-[26px] md:text-[28px]">{title}</h2>
      <div className="text-fg/90 mt-3 space-y-3 text-[15.5px] leading-relaxed">{children}</div>
    </section>
  )
}

/** Who runs the site — name, IČO, address and e-mail from OPERATOR (src/lib/site.ts). */
export function OperatorCard() {
  return (
    <div className="card p-5 text-[15px]" data-testid="operator">
      <p className="font-medium">{OPERATOR.name || SITE.name}</p>
      {OPERATOR.id && <p className="text-muted mt-1">IČO: {OPERATOR.id}</p>}
      {OPERATOR.address && <p className="text-muted mt-1">{OPERATOR.address}</p>}
      {OPERATOR.email && (
        <p className="mt-2">
          E-mail:{' '}
          <a href={`mailto:${OPERATOR.email}`} className="link">
            {OPERATOR.email}
          </a>
        </p>
      )}
    </div>
  )
}
