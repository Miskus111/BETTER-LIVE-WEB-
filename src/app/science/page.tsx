import type { Metadata } from 'next'
import Link from 'next/link'
import { NUTRIENT_LIST } from '@/data/nutrients'
import { ORGANS } from '@/data/organs'
import { ALL_SOURCES } from '@/data/sources'
import { EvidenceBadge, EvidenceLegend } from '@/components/ui/EvidenceBadge'
import { FermentationExplainer } from '@/components/organ/FermentationExplainer'
import { thresholdBasis, thresholdOf } from '@/lib/nutrition'

export const metadata: Metadata = {
  title: 'Science & methodology',
  description:
    'How FLX grades evidence, computes food–organ relevance from USDA data and uses EU-authorised health-claim wording.',
  alternates: { canonical: '/science' },
}

export default function SciencePage() {
  const counts = ORGANS.flatMap((o) => o.nutrients).reduce<Record<string, number>>((acc, n) => {
    acc[n.level] = (acc[n.level] ?? 0) + 1
    return acc
  }, {})
  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 md:px-8">
      <p className="eyebrow">Science &amp; methodology</p>
      <h1 className="display mt-3 text-[48px] md:text-[68px]">How we know what we say.</h1>
      <p className="text-muted mt-4 max-w-3xl text-[16px]">
        FLX is an educational tool. It describes normal physiology and what nutrition research supports — and
        is explicit about what it does not. It is not medical advice.
      </p>

      <Block title="1 · Evidence levels">
        <EvidenceLegend />
        <p className="text-muted mt-4 text-[14px]">
          Across the {ORGANS.length} organs in the model there are {counts.established ?? 0} established,{' '}
          {counts.plausible ?? 0} plausible and {counts.preliminary ?? 0} preliminary nutrient links. A
          nutrient the organ only absorbs, stores or activates (e.g. vitamin D in the kidneys) is shown as
          physiology, but never used to link foods.
        </p>
      </Block>

      <Block title="2 · When is a food relevant to an organ?">
        <p className="text-fg/90 text-[15px]">
          A food is linked to an organ only if 100 g supplies at least the EU &ldquo;source of&rdquo; level of
          a nutrient that organ depends on — 15 % of the Nutrient Reference Value for vitamins and minerals
          (Reg. 1924/2006). Links that rest only on preliminary evidence are dropped. Everything is computed
          from the data at build time; nothing is hand-picked.
        </p>
        <div className="border-line mt-5 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <caption className="sr-only">Reference values and source-of thresholds</caption>
            <thead className="text-subtle bg-white/[0.03] font-mono text-[12px]">
              <tr>
                <th className="px-4 py-3 font-normal">Nutrient</th>
                <th className="px-4 py-3 font-normal">Reference / day</th>
                <th className="px-4 py-3 font-normal">Threshold / 100 g</th>
                <th className="px-4 py-3 font-normal">Rule</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {NUTRIENT_LIST.map((n) => {
                const t = thresholdOf(n.id)
                return (
                  <tr key={n.id}>
                    <td className="px-4 py-2.5">
                      <Link href={`/#nutrient-${n.id}`} className="hover:text-cyan">
                        {n.name}
                      </Link>
                    </td>
                    <td className="text-muted px-4 py-2.5 font-mono text-[13px]">
                      {n.ref ? `${n.ref.value} ${n.unit} (${n.ref.kind})` : '—'}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[13px]">
                      {n.qualitative ? 'qualitative' : t !== undefined ? `${+t.toFixed(3)} ${n.unit}` : '—'}
                    </td>
                    <td className="text-muted px-4 py-2.5 text-[13px]">{thresholdBasis(n.id)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Block>

      <Block title="3 · Health-claim wording">
        <p className="text-fg/90 text-[15px]">
          Where the EU has authorised a health claim (Reg. 432/2012) we use its wording — e.g. &ldquo;Vitamin
          C contributes to normal collagen formation for the normal function of skin&rdquo;. Where none exists
          we say so, for example for lutein: its role in the macular pigment is real physiology, but
          supplement benefit has only been shown in people with intermediate age-related macular degeneration
          (AREDS2).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <EvidenceBadge level="established" />
          <EvidenceBadge level="plausible" />
          <EvidenceBadge level="preliminary" />
        </div>
      </Block>

      <Block title="4 · Fermented foods, live cultures, probiotics">
        <FermentationExplainer />
      </Block>

      <Block title="5 · Nutrient data">
        <p className="text-fg/90 text-[15px]">
          Values per 100 g edible portion from USDA FoodData Central (SR Legacy / Foundation Foods), rounded.
          Only nutrients relevant to the organ model are tracked; a missing value means &ldquo;not
          tracked&rdquo;, not zero. Iodine in milk and fish varies widely with feed, season and processing.
        </p>
      </Block>

      <Block title="Sources">
        <ul className="space-y-2">
          {ALL_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer noopener" className="link text-[15px]">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </Block>
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line mt-14 border-t pt-8">
      <h2 className="display mb-5 text-[30px] md:text-[36px]">{title}</h2>
      {children}
    </section>
  )
}
