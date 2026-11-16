import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zásady ochrany osobních údajů',
  alternates: { canonical: '/privacy' },
}

const PROCESSORS = [
  {
    name: 'Supabase Inc.',
    role: 'Databáze, přihlášení a úložiště souborů',
    where: 'EU — Frankfurt (AWS eu-central-1)',
  },
  { name: 'Vercel Inc.', role: 'Hosting webu', where: 'EU/USA, standardní smluvní doložky' },
  {
    name: 'Anthropic PBC',
    role: 'AI kouč (zpracování dotazů; data se nepoužívají k trénování modelů)',
    where: 'USA, standardní smluvní doložky',
  },
  { name: 'Stripe Payments Europe Ltd.', role: 'Platby (až po spuštění předplatného)', where: 'EU — Irsko' },
]

/** PLACEHOLDER legal text — must be reviewed by a lawyer before launch (see README). */
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 md:px-8">
      <p className="eyebrow">Právní informace · návrh</p>
      <h1 className="display mt-3 text-[44px] md:text-[56px]">Zásady ochrany osobních údajů</h1>
      <p className="border-warn/30 bg-warn/[0.06] mt-6 rounded-xl border p-4 text-[14px]">
        Pracovní verze — před spuštěním ji musí zkontrolovat právník. Doplňte identifikaci správce a kontakt.
      </p>
      <Section title="Jaké údaje zpracováváme">
        Účet (e-mail), profil (jméno, datum narození, výška, hmotnost), cíle a preference, záznamy tréninků,
        jídla, spánku a regenerace, a s vaším výslovným souhlasem údaje o zdraví (bolest, léky, krevní testy,
        složení těla).
      </Section>
      <Section title="Právní základ">
        Plnění smlouvy (čl. 6 odst. 1 písm. b GDPR) pro provoz účtu; výslovný souhlas (čl. 9 odst. 2 písm. a)
        pro údaje o zdraví. Souhlas můžete kdykoli odvolat v Nastavení.
      </Section>
      <Section title="Minimalizace a bezpečnost">
        Data ukládáme v EU, šifrovaná v klidu i při přenosu, s řízením přístupu na úrovni řádků (RLS). AI
        kouči posíláme jen údaje nezbytné pro konkrétní odpověď. Vaše data neprodáváme a nepoužíváme k
        trénování AI modelů.
      </Section>
      <Section title="Vaše práva">
        Přístup a přenositelnost (Nastavení → Stáhnout moje data), oprava (úprava profilu), výmaz (Nastavení →
        Smazat účet — odstraní všechna data i soubory), odvolání souhlasu, stížnost u ÚOOÚ.
      </Section>
      <section className="mt-10">
        <h2 className="display text-[28px]">Zpracovatelé</h2>
        <div className="border-line mt-4 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead className="text-subtle bg-white/[0.03] font-mono text-[12px]">
              <tr>
                <th className="px-4 py-3 font-normal">Zpracovatel</th>
                <th className="px-4 py-3 font-normal">Účel</th>
                <th className="px-4 py-3 font-normal">Umístění</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {PROCESSORS.map((p) => (
                <tr key={p.name}>
                  <td className="px-4 py-2.5">{p.name}</td>
                  <td className="text-muted px-4 py-2.5">{p.role}</td>
                  <td className="text-muted px-4 py-2.5">{p.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="display text-[28px]">{title}</h2>
      <p className="text-fg/90 mt-3 text-[15.5px]">{children}</p>
    </section>
  )
}
