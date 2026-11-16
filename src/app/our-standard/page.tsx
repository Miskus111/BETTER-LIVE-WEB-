import type { Metadata } from 'next'
import Link from 'next/link'
import { Fish, Leaf, Tag } from 'lucide-react'
import { PRODUCTS } from '@/data/products'
import { SRC } from '@/data/sources'
import { SampleDataLabel } from '@/components/layout/SampleDataLabel'
import { isVerifiedOrganic } from '@/lib/nutrition'

export const metadata: Metadata = {
  title: 'Our standard — organic first',
  description:
    'Why FLX prioritises certified EU organic food, when we say pasture-raised, and how every product is labelled.',
  alternates: { canonical: '/our-standard' },
}

const PRINCIPLES = [
  {
    t: 'Certified EU organic wherever it exists',
    d: 'Dairy, eggs, meat, vegetables and fruit are sourced certified organic under Regulation (EU) 2018/848: no synthetic pesticides, no routine antibiotics, outdoor access for animals, organic feed and annual inspection.',
  },
  {
    t: 'Pasture-raised and grass-fed — only when verified',
    d: 'These words have no legal definition, so we use them only when grazing is checked at the annual inspection and recorded in the product data (pasture: verified).',
  },
  {
    t: 'Natural fermentation, traditional preparation',
    d: 'Fermented foods are made by fermentation — not acidified with vinegar — and labelled “live cultures” only when unpasteurised after fermentation.',
  },
  {
    t: 'Nothing unnecessary',
    d: 'No artificial colours, no sweeteners, no thickeners in dairy, no excessive processing. Every product lists how it was processed.',
  },
]

export default function StandardPage() {
  const organic = PRODUCTS.filter(isVerifiedOrganic).length
  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 md:px-8">
      <p className="eyebrow">Our standard</p>
      <h1 className="display mt-3 text-[48px] md:text-[68px]">Organic first. Honest always.</h1>
      <p className="text-muted mt-4 max-w-3xl text-[16px]">
        Organic certification is not a health claim. It is a verifiable production standard — and the most
        reliable one Europe has. That is why we start there, and why we label everything else plainly.
      </p>
      <p className="text-subtle mt-4 font-mono text-[13px]">
        {organic} of {PRODUCTS.length} products in the current range are certified EU organic.
      </p>

      <ol className="mt-12 grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <li key={p.t} className="card p-6">
            <span className="text-bio font-mono text-[12px]">0{i + 1}</span>
            <h2 className="mt-3 text-[20px] font-medium">{p.t}</h2>
            <p className="text-muted mt-2 text-[15px]">{p.d}</p>
          </li>
        ))}
      </ol>

      <section className="border-line mt-16 border-t pt-8">
        <h2 className="display text-[34px]">How products are labelled</h2>
        <ul className="mt-6 grid grid-cols-1 gap-3">
          <Label icon={<Leaf size={18} className="text-bio" />} name="EU BIO">
            Shown only when certification is verified and a control-body code is on record (e.g. CZ-BIO-000).
            Organic ingredients are marked with * in the ingredient list.
          </Label>
          <Label
            icon={<Fish size={18} className="text-[#9cc9ff]" />}
            name="Wild-caught · not eligible for organic certification"
          >
            EU rules allow organic aquaculture, but wild fish cannot be certified. We say so rather than imply
            otherwise.
          </Label>
          <Label icon={<Tag size={18} className="text-muted" />} name="Conventional">
            Anything not certified organic — including products that contain some organic ingredients. Never
            &ldquo;natural&rdquo;.
          </Label>
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <SampleDataLabel />
          <p className="text-subtle text-[13.5px]">
            Producers, prices and control-body codes in this prototype are placeholders. An automated check (
            <code className="font-mono">npm run check:data</code>) blocks any product that claims organic
            without a verified code.
          </p>
        </div>
      </section>

      <section className="border-line mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-8">
        <a href={SRC.organicReg.url} target="_blank" rel="noreferrer noopener" className="link text-[15px]">
          {SRC.organicReg.title}
        </a>
        <Link href="/shop?bio=1" className="btn btn-primary">
          Shop EU BIO products
        </Link>
      </section>
    </div>
  )
}

function Label({ icon, name, children }: { icon: React.ReactNode; name: string; children: React.ReactNode }) {
  return (
    <li className="card flex gap-4 p-5">
      <span className="mt-0.5 shrink-0" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="font-mono text-[14px]">{name}</p>
        <p className="text-muted mt-1 text-[14.5px]">{children}</p>
      </div>
    </li>
  )
}
