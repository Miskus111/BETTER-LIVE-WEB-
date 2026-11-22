import { BreadcrumbLd } from '@/components/seo/BreadcrumbLd'
import { withShare } from '@/lib/share-meta'
import type { Metadata } from 'next'
import Link from '@/components/ui/Link'
import { LegalHeader, LegalSection, OperatorCard } from '@/components/legal/Legal'
import { OPERATOR } from '@/lib/site'

export const metadata: Metadata = withShare(
  {
    title: 'Zásady ochrany osobních údajů',
    description: 'Jaké údaje BLWB zpracovává, proč, jak dlouho a jaká máte práva.',
    alternates: { canonical: '/privacy' },
  },
  '/privacy',
)

const PROCESSORS = [
  {
    name: 'Supabase Inc.',
    role: 'Databáze, přihlášení a úložiště souborů',
    where: 'EU — Frankfurt (AWS eu-central-1)',
  },
  {
    name: 'Vercel Inc.',
    role: 'Hosting webu a anonymní statistiky návštěvnosti',
    where: 'EU/USA — standardní smluvní doložky a EU-US Data Privacy Framework',
  },
  {
    name: 'Anthropic PBC',
    role: 'AI kouč a čtení laboratorních výsledků (jen když funkci použijete)',
    where: 'USA — standardní smluvní doložky; data se nepoužívají k trénování modelů',
  },
]

export default function PrivacyPage() {
  const contact = OPERATOR.email ? (
    <a href={`mailto:${OPERATOR.email}`} className="link">
      {OPERATOR.email}
    </a>
  ) : (
    'kontaktní e-mail uvedený výše'
  )
  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 md:px-8">
      <BreadcrumbLd items={[['Ochrana osobních údajů', '/privacy']]} />
      <LegalHeader eyebrow="Právní informace" title="Zásady ochrany osobních údajů" />

      <p className="text-muted mt-6 text-[16px]">
        Krátce: web s průvodci můžete číst bez účtu a bez sledovacích cookies. Když si založíte účet v
        aplikaci, ukládáme jen to, co do ní sami zapíšete — data jsou v EU, neprodáváme je a kdykoli si je
        stáhnete nebo smažete.
      </p>

      <LegalSection title="Kdo je správce">
        <p>Správcem osobních údajů je:</p>
        <OperatorCard />
      </LegalSection>

      <LegalSection title="Čtení webu bez účtu">
        <p>
          Pro statistiky návštěvnosti používáme Vercel Web Analytics. Neukládá cookies, nesleduje vás napříč
          weby a neidentifikuje konkrétní osoby — počítá jen anonymní souhrny (které stránky se čtou, z jaké
          země a jakého typu zařízení). Server hostingu běžně zaznamenává technické údaje (IP adresa, čas
          požadavku) kvůli bezpečnosti a provozu; uchovávají se krátce.
        </p>
        <p>
          Právní základ: oprávněný zájem na bezpečném provozu a zlepšování webu (čl. 6 odst. 1 písm. f GDPR).
        </p>
      </LegalSection>

      <LegalSection title="Účet v aplikaci">
        <p>
          <strong className="font-medium">Co ukládáme:</strong> e-mail pro přihlášení; profil (přezdívka,
          datum narození, pohlaví, výška, hmotnost, zkušenosti a cíle); záznamy, které sami zadáte — tréninky,
          jídlo, doplňky, spánek, regenerace, váhu a míry, mapu bolesti, laboratorní výsledky, fotky pokroku a
          konverzace s AI koučem.
        </p>
        <p>
          <strong className="font-medium">Údaje o zdraví</strong> (bolest, léky, krevní testy, složení těla)
          zpracováváme jen s vaším výslovným souhlasem (čl. 9 odst. 2 písm. a GDPR). Souhlas můžete kdykoli
          odvolat v Nastavení.
        </p>
        <p>
          Ostatní údaje zpracováváme, protože jsou nutné k poskytování aplikace, o kterou jste požádali (čl. 6
          odst. 1 písm. b GDPR).
        </p>
      </LegalSection>

      <LegalSection title="AI kouč">
        <p>
          Když položíte otázku AI kouči nebo nahrajete laboratorní výsledky, pošleme poskytovateli AI jen
          údaje potřebné pro odpověď. Poskytovatel je podle smlouvy nepoužívá k trénování svých modelů.
          Odpovědi AI jsou obecné informace, ne lékařská rada.
        </p>
      </LegalSection>

      <LegalSection title="Jak dlouho údaje uchováváme">
        <p>
          Data účtu uchováváme, dokud účet máte. Smazáním účtu (Nastavení → Smazat účet) odstraníme všechna
          vaše data i nahrané soubory. Ze záloh databáze zmizí nejpozději do 30 dnů.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Používáme jen nezbytné cookies: přihlášení (aby aplikace věděla, že jste to vy) a volbu jazyka.
          Reklamní ani sledovací cookies nepoužíváme, proto web nemá cookie lištu. Některé nastavení (např.
          rozpracovaný trénink) se ukládá jen ve vašem prohlížeči. Patří sem i zdravotní situace, kterou
          můžete zaškrtnout u kontroly doplňků (těhotenství, kojení, nemoc ledvin nebo jater): na náš server
          ji pošleme jen spolu s dotazem na AI kouče, aby doporučení doplňků zohlednilo vaše omezení. Samotnou
          volbu na serveru neukládáme, ale odpověď kouče, která z ní vychází, zůstane v konverzaci.
        </p>
      </LegalSection>

      <LegalSection title="Komu údaje předáváme">
        <p>
          Údaje neprodáváme ani nepředáváme inzerentům. Využíváme tyto zpracovatele, kteří s nimi smí nakládat
          jen podle našich pokynů:
        </p>
        {/* scrolls sideways on phones: focusable so keyboard users can scroll it too */}
        <div
          className="border-line relative overflow-x-auto rounded-2xl border"
          tabIndex={0}
          role="region"
          aria-label="Zpracovatelé osobních údajů"
        >
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead className="text-subtle bg-white/[0.03] font-mono text-[12px]">
              <tr>
                <th className="px-4 py-3 font-normal">Zpracovatel</th>
                <th className="px-4 py-3 font-normal">Účel</th>
                <th className="px-4 py-3 font-normal">Umístění a záruky</th>
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
        <p>
          Odkazy na obchody jsou partnerské. Údaje z vašeho účtu obchodům neposíláme. Když na odkaz kliknete,
          obchod se může dozvědět, že jste přišli od nás, a na svém webu používá vlastní cookies podle svých
          zásad.
        </p>
      </LegalSection>

      <LegalSection title="Vaše práva">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="font-medium">Přístup a přenositelnost</strong> — Nastavení → Stáhnout moje data
            (soubor JSON).
          </li>
          <li>
            <strong className="font-medium">Oprava</strong> — úpravou profilu a záznamů v aplikaci.
          </li>
          <li>
            <strong className="font-medium">Výmaz</strong> — Nastavení → Smazat účet.
          </li>
          <li>
            <strong className="font-medium">Odvolání souhlasu</strong> se zpracováním údajů o zdraví —
            Nastavení.
          </li>
          <li>
            <strong className="font-medium">Námitka a omezení zpracování</strong> — napište nám na {contact}.
          </li>
          <li>
            <strong className="font-medium">Stížnost</strong> u Úřadu pro ochranu osobních údajů (
            <a href="https://uoou.gov.cz" target="_blank" rel="noreferrer noopener" className="link">
              uoou.gov.cz
            </a>
            ).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Věk">
        <p>
          Aplikace s účtem je určena osobám od 18 let. Vzdělávací průvodce na webu může číst kdokoli bez
          registrace.
        </p>
      </LegalSection>

      <LegalSection title="Změny">
        <p>
          Když zásady podstatně změníme, upozorníme na to v aplikaci. Související dokument:{' '}
          <Link href="/terms" className="link">
            Podmínky užívání
          </Link>
          .
        </p>
      </LegalSection>
    </article>
  )
}
