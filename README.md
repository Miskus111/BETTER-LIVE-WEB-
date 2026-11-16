# FLX — Human Body × Nutrition

An interactive anatomy explorer joined to an evidence-graded nutrition database and an organic-first demo store.
Select an organ to see what it does, which nutrients it depends on (graded **established / plausible / preliminary**),
which foods supply them (computed from USDA data) and which products contain them.

> Educational content, not medical advice. All products, prices, producers and control-body codes are **sample data**.

```bash
npm install
npm run dev            # http://localhost:3000
```

| Script                            | What it does                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                                    |
| `npm run build` / `start`         | Production build (all 76 pages are statically generated)                              |
| `npm run lint`                    | ESLint (Next core-web-vitals + TypeScript + Prettier compat)                          |
| `npm run typecheck`               | `tsc --noEmit` (strict)                                                               |
| `npm run check:data`              | Validates data and scientific/certification rules — fails CI on violations            |
| `npm run check:data -- --verbose` | Also prints the computed organ → food and product → organ links                       |
| `npm run gen:placeholders`        | Regenerates placeholder SVG images for foods and products                             |
| `npm run images:todo`             | Regenerates IMAGES_TODO.md from the data                                              |
| `npm run test:e2e`                | Playwright: smoke tests + screenshots at 390/768/1440 px (builds and serves on :3100) |
| `npm run format`                  | Prettier                                                                              |

### Deploy to Vercel

Import the GitHub repository in Vercel (Framework preset: Next.js, default build settings). No environment variables are required; optionally set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) when using a custom domain.

First Playwright run: `npx playwright install chromium`. Screenshots land in `test-results/screens/`.

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · Zustand (cart, persisted to `localStorage`) ·
lucide-react · next/font (Instrument Serif, Geist, Geist Mono) · Playwright.

## Architecture

```
src/
  data/                 typed content — the single source of truth
    types.ts            domain model (Organ, Nutrient, Food, Product, Certification …)
    organs.ts           11 organs: physiology text, nutrient links + evidence, science, zoom/anchor geometry
    nutrients.ts        25 nutrients: reference values, "source of" rules, EU-authorised claim wording
    foods.ts            32 foods, per-100 g values from USDA FoodData Central
    products.ts         20 sample products with certification, origin, processing, ingredients
    sources.ts          citations, evidence-level definitions, body systems
    fermentation.ts     fermented food vs live cultures vs probiotic (ISAPP)
  lib/
    nutrition.ts        ALL derived relationships: isSource, foodsForOrgan, organsForFood,
                        productNutrition (food / blend / manual), productOrgans, isVerifiedOrganic …
    search.ts           ⌘K index across organs, nutrients, foods, products
    commerce/           CommerceProvider interface + mock implementation + shipping rules
    store/              Zustand stores: cart (persisted), toasts, UI
  components/
    anatomy/            AnatomyExplorer (state) → BodyCanvas (zoom/pan) → BodySvg (layers) + LeaderLabel,
                        ExplorerControls (systems, layers, organ list), useViewBox (animated viewBox), geometry
    organ/              OrganPanel + one file per tab, FermentationExplainer
    food/               FoodExplorer, FoodDetail, MacroSplitBar
    shop/               ProductCard, CertBadge, ShopView (filters), gallery, buy box, quantity
    cart/               CartView, CheckoutForm, OrderSummary, ShippingProgress
    home/               homepage sections, NutrientIndex
    layout/             Nav, Footer, CommandPalette, Toaster, SampleDataLabel
    ui/                 EvidenceBadge, NrvBar, OrganDots, OrganLink, Thumb
  app/                  routes: /, /organ/[id], /food/[id], /shop, /product/[id], /cart, /checkout,
                        /science, /our-standard, sitemap.ts, robots.ts, opengraph-image.tsx
scripts/                check-data.ts, gen-placeholders.tsx
tests/                  smoke.spec.ts, screens.spec.ts
```

### Anatomy viewer

Hand-built SVG in a 400 × 920 coordinate space (`components/anatomy/geometry.ts`). The figure is symmetric: half-paths
are mirrored for bones and muscles. Layers: skin outline (selectable), skeleton, muscles (clipped to the silhouette) and
organs. Each organ has a `zoom` viewBox and a leader-line `anchor` in `organs.ts`. `useViewBox` animates the SVG
`viewBox` (instant under `prefers-reduced-motion`), handles drag-to-pan with a click threshold, double-click zoom and
⌘/Ctrl + wheel zoom. Organs are `role="button"` with `tabIndex=0` (Tab + Enter/Space). Selection is mirrored to
`?organ=` on the homepage and to `/organ/:id` on organ pages, without navigation. On mobile the panel is a bottom sheet
and the zoom target is fitted into the area above it.

No 3D model is used: no properly licensed anatomical model was available, and the brief forbids presenting a static
image as interactive. `BodyCanvas` is the seam where an R3F scene could replace `BodySvg` later.

### Data model and scientific rules

- **Evidence**: every `OrganNutrient` has `level`. `established` = EU-authorised claim (Reg. 432/2012) or textbook
  physiology; `plausible` = sound mechanism, not an authorised claim for that organ; `preliminary` = emerging research.
- **Relation**: `relation: 'handles'` marks nutrients an organ absorbs, stores or activates (B12 in the ileum, vitamin
  D in the kidneys). These are shown as physiology but are **not** used to link foods, so we never imply "eat X for
  your kidneys" because the kidney activates vitamin D.
- **"Source of" threshold** (`thresholdOf`): 15 % of the EU NRV per 100 g by default. Explicit overrides, each with a
  documented basis: fibre 3 g and omega-3 (40 mg EPA+DHA / 0.3 g ALA) from Reg. 1924/2006; protein ≥ 10 g and lutein
  ≥ 1 mg as app rules (see `/science`). Live cultures and essential amino acids are qualitative.
- **Food ↔ organ**: `linkVia` — a food is relevant to an organ only if 100 g reaches the threshold for a nutrient the
  organ depends on, and at least one such match is established or plausible. Nothing is hand-curated.
- **Product ↔ organ**: computed from the product's nutrition (its reference food, a weighted `blend`, or — only where
  neither applies — manual `nutrition`/`organs`).
- **Certification**: `certification: { status: 'eu-bio' | 'conventional' | 'wild', controlBody?, verified }`. The EU BIO
  badge renders only when `isVerifiedOrganic` (status `eu-bio`, `verified === true`, control-body code present). Wild
  fish: "Wild-caught · not eligible for organic certification". Everything else: "Conventional".

`npm run check:data` enforces: organic claims need `verified: true` and a valid `CC-BIO-NNN` code; organic ingredient
lists use `*`; non-organic products cannot carry codes; `pasture: 'verified'` only on certified products; banned claim
wording (cure, detox, heal, repair, cleanse, boost, superfood, miracle) in claim-bearing copy; referential integrity
(organs, foods, nutrients, categories, blends summing to 1); every organ has sources and a "does NOT show" list;
images exist; every product has nutrition and at least one organ.

## How to add …

**An organ** — add the id to `OrganId` in `types.ts`, an entry in `organs.ts` (text, `nutrients` with evidence and
optional `relation`, `science`, `zoom`, `anchor`, `layer`), and a shape in `ORGAN_SHAPES` + a node in `BodySvg.tsx`
(`ORGAN_ORDER` controls paint order). Run `npm run check:data -- --verbose` to review the computed foods.

**A nutrient** — add to `NutrientId` and `nutrients.ts` with `ref` (EU NRV if one exists), any `threshold` override
with its `basis`, and EU-authorised `functions` (empty array if there is none — the UI then says so).

**A food** — add to `foods.ts` with per-100 g values from USDA FDC (`fdc` describes the matched entry), then run
`npm run gen:placeholders` (or drop a licensed photo into `public/images/foods/` and set `image`).

**A product** — add to `products.ts`. Link a `food` (or a `blend`) so nutrition and organs are computed. For EU organic
products set `certification: { status: 'eu-bio', controlBody, verified: true }` only after checking the certificate,
and mark organic ingredients with `*`. Run `npm run check:data`.

**A real commerce backend** — implement `CommerceProvider` (`src/lib/commerce/types.ts`: `quote`, `createOrder`) for
Stripe Checkout or the Shopify Storefront API and export it from `src/lib/commerce/index.ts`. UI code only talks to
that interface.

## Before launch: placeholders to replace

- **All products**: names, producers, origins, sizes, prices (EUR) and descriptions are samples.
- **Control-body codes**: all are `CC-BIO-000` placeholders. Replace with the real code from each supplier's organic
  certificate and keep `verified: true` only for checked certificates.
- **Pasture claims** (eggs, beef): need documented verification from the control body.
- **Algae omega-3 nutrition**: manual sample values — replace with the manufacturer's analysis.
- **Images**: every food and product image is a generated SVG placeholder — see [`IMAGES_TODO.md`](IMAGES_TODO.md).
- **USDA FDC IDs**: `fdc` currently describes the matched entry by name; add the numeric FDC IDs and re-verify values.
- **Site URL**: on Vercel the production domain is picked up automatically; set `NEXT_PUBLIC_SITE_URL` to use a custom domain for canonical URLs, sitemap and OG tags.
- **Legal**: imprint, privacy policy, terms, cookie notice and an EU-compliant checkout are not included.
- **Medical/regulatory review**: have a registered dietitian and a food-law specialist review copy and claims.

## Decisions

- **SVG, not 3D** — no licensed anatomical model; the SVG is fully interactive, keyboard-accessible and themable.
- **Computed relevance over curation** — the prototype's hand-written organ food lists were replaced by `linkVia`, so
  the UI cannot drift from the data.
- **"Handles" vs "supports"** — added to stop physiology facts (B12 absorption, vitamin D activation) from turning into
  implied food benefits.
- **Stomach / zinc** — the prototype tagged the general zinc acid-base claim as an _established_ stomach link; it is
  now _plausible_ with an explanation.
- **Product renamed** "Natural Live Yogurt" → "Plain Live Yogurt"; sardines in organic oil stay **Conventional**.
- **Thresholds** use EU nutrition-claim rules where they exist; app rules are labelled as such on `/science`.
- **Mixed product** ("Seed & Nut Mix") nutrition is calculated from its recipe rather than borrowed from one food.
- **Sockeye** uses Atlantic salmon as its reference food; the product page says so.
- **Clicking empty space** keeps the selection (prevents accidental resets while panning); "Full body" and Escape reset.
- **Page wheel scroll is not hijacked** — zoom with ⌘/Ctrl + wheel, buttons, or double-click.
- **Product images** use plain `<img>` for local SVG placeholders; switch `Thumb` to `next/image` with real photos.
- **Playwright** runs against a production build on port 3100 with `reducedMotion: 'reduce'` (the beating heart never
  "settles" for click stability checks; this also exercises the reduced-motion path).
- **No prices with VAT logic, stock, or accounts** — out of scope for the demo.
