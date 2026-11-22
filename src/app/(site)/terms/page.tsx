import { BreadcrumbLd } from '@/components/seo/BreadcrumbLd'
import { withShare } from '@/lib/share-meta'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalHeader, LegalSection, OperatorCard } from '@/components/legal/Legal'
import { AFFILIATE_DISCLOSURE } from '@/data/affiliate'
import { SITE } from '@/lib/site'

export const metadata: Metadata = withShare(
  {
    title: 'Podmínky užívání',
    description: 'Pravidla pro používání webu a aplikace Better Live with Biohacking.',
    alternates: { canonical: '/terms' },
  },
  '/terms',
)

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 md:px-8">
      <BreadcrumbLd items={[['Podmínky užívání', '/terms']]} />
      <LegalHeader eyebrow="Právní informace" title="Podmínky užívání" />

      <LegalSection title="Provozovatel">
        <p>Web a aplikaci {SITE.name} (dále „BLWB“) provozuje:</p>
        <OperatorCard />
      </LegalSection>

      <LegalSection title="Co BLWB je — a co není">
        <p>
          BLWB je vzdělávací web a osobní deník pro výživu, trénink, spánek a regeneraci. Obsah vychází z
          vědeckých zdrojů, které u každého tématu uvádíme, a u rad značíme sílu důkazů.
        </p>
        <p>
          <strong className="font-medium">BLWB není zdravotnický prostředek ani lékařská služba.</strong>{' '}
          Nediagnostikuje, nepředepisuje léčbu a nenahrazuje lékaře, fyzioterapeuta ani nutričního terapeuta.
          Při zdravotních potížích, užívání léků, v těhotenství nebo při varovných příznacích se obraťte na
          lékaře. V naléhavé situaci volejte 155 nebo 112.
        </p>
      </LegalSection>

      <LegalSection title="Účet">
        <p>
          Účet si může založit osoba starší 18 let. Za bezpečnost přihlašovacích údajů odpovídáte vy. Účet
          můžete kdykoli zrušit v Nastavení — smažeme tím i všechna vaše data.
        </p>
      </LegalSection>

      <LegalSection title="AI kouč">
        <p>
          Odpovědi AI kouče generuje umělá inteligence. Jsou to obecné informace, mohou být nepřesné nebo
          neúplné a vždy je posuzujte s rozvahou. Kouč odmítá témata mimo výživu, trénink, regeneraci,
          mobilitu a zdravý vzhled. Počet zpráv za den může být omezený.
        </p>
      </LegalSection>

      <LegalSection title="Zakázané použití">
        <p>
          BLWB nesmíte používat k získávání informací o anabolických steroidech, SARMs, peptidech, výzkumných
          chemikáliích, sebepoškozování ani jiných nebezpečných praktikách, k narušování provozu služby,
          automatizovanému stahování obsahu ani k porušování práv druhých. Při porušení můžeme účet omezit
          nebo zrušit.
        </p>
      </LegalSection>

      <LegalSection title="Partnerské odkazy">
        <p>{AFFILIATE_DISCLOSURE}</p>
        <p>
          Podrobnosti:{' '}
          <Link href="/jak-doporucujeme" className="link">
            Jak doporučujeme
          </Link>
          . Za produkty, ceny a dodání odpovídá prodejce.
        </p>
      </LegalSection>

      <LegalSection title="Cena">
        <p>
          Web i aplikace jsou nyní zdarma. Pokud později spustíme placené funkce, budou předem jasně označené
          a nikdy vám nic nenaúčtujeme bez vašeho výslovného objednání.
        </p>
      </LegalSection>

      <LegalSection title="Obsah a autorská práva">
        <p>
          Texty, grafika a aplikace jsou chráněné autorským právem. Odkazovat a citovat krátké úryvky s
          uvedením zdroje můžete; kopírování celých textů bez souhlasu ne. Data, která do aplikace zapíšete,
          zůstávají vaše.
        </p>
      </LegalSection>

      <LegalSection title="Odpovědnost">
        <p>
          Obsah průběžně kontrolujeme a aktualizujeme, ale nemůžeme zaručit, že je vždy úplný a bez chyb. Za
          rozhodnutí o vašem zdraví odpovídáte vy, ideálně po poradě s odborníkem. Službu poskytujeme tak, jak
          je, a může být dočasně nedostupná. Tím nejsou dotčena vaše práva spotřebitele podle českého práva.
        </p>
      </LegalSection>

      <LegalSection title="Změny a rozhodné právo">
        <p>
          Podmínky se mohou měnit; o podstatných změnách vás upozorníme v aplikaci. Řídí se právem České
          republiky. Zpracování osobních údajů popisují{' '}
          <Link href="/privacy" className="link">
            Zásady ochrany osobních údajů
          </Link>
          .
        </p>
      </LegalSection>
    </article>
  )
}
