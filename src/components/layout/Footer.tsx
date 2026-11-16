import Link from 'next/link'
import { ORGANS } from '@/data/organs'
import { SHOP_CATEGORIES } from '@/data/products'
import { Logo } from './Logo'
import { SampleDataLabel } from './SampleDataLabel'

export function Footer() {
  return (
    <footer className="border-line bg-ink-2 mt-24 border-t">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div className="max-w-sm">
          <Logo />
          <p className="text-muted mt-4 text-[14.5px]">
            An interactive map of the human body and the nutrients each organ depends on — with organic food
            chosen to the same standard of evidence.
          </p>
          <SampleDataLabel className="mt-5" />
        </div>
        <FooterCol title="Body">
          {ORGANS.map((o) => (
            <Link key={o.id} href={`/organ/${o.id}`} className="hover:text-fg">
              {o.shortName}
            </Link>
          ))}
        </FooterCol>
        <FooterCol title="Shop">
          <Link href="/shop" className="hover:text-fg">
            All products
          </Link>
          {SHOP_CATEGORIES.map((c) => (
            <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`} className="hover:text-fg">
              {c}
            </Link>
          ))}
        </FooterCol>
        <FooterCol title="About">
          <Link href="/science" className="hover:text-fg">
            Science &amp; evidence
          </Link>
          <Link href="/our-standard" className="hover:text-fg">
            Our standard
          </Link>
          <Link href="/#foods" className="hover:text-fg">
            Food explorer
          </Link>
          <Link href="/#nutrients" className="hover:text-fg">
            Nutrient index
          </Link>
          <Link href="/cart" className="hover:text-fg">
            Cart
          </Link>
        </FooterCol>
      </div>
      <div className="border-line border-t">
        <div className="text-subtle mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-[13px] md:flex-row md:items-center md:justify-between md:px-8">
          <p className="max-w-3xl">
            <strong className="text-muted font-medium">Educational content, not medical advice.</strong> FLX
            explains general physiology and nutrition science. It does not diagnose, treat or prevent disease.
            Talk to a doctor or registered dietitian about your own health. Nutrient values: USDA FoodData
            Central; health-claim wording: EU Reg. 432/2012.
          </p>
          <p className="font-mono text-[12px]">© {new Date().getFullYear()} FLX · prototype</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow !text-subtle mb-4">{title}</h2>
      <div className="text-muted flex flex-col gap-2 text-[14.5px]">{children}</div>
    </div>
  )
}
