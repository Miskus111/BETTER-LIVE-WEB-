# Better Live with Biohacking (BLWB)

All-in-one app for living healthier and performing better: nutrition, training for any sport, mobility and pain,
recovery, healthy appearance and an AI coach — plus the public education pages (interaktivní anatomie, co jednotlivé orgány potřebují (s hodnocením důkazů), které
potraviny to dodají (vypočteno z USDA), referenční hodnoty EFSA, vstřebatelnost forem doplňků a doporučené produkty
přes partnerské (affiliate) odkazy. FLX nic neprodává.

> Vzdělávací obsah, ne lékařská rada.

```bash
npm install
npm run dev            # http://localhost:3000
```

| Skript                     | Co dělá                                                                      |
| -------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`              | Vývojový server                                                              |
| `npm run build` / `start`  | Produkční build (vše staticky generované)                                    |
| `npm run lint`             | ESLint                                                                       |
| `npm run typecheck`        | `tsc --noEmit` (strict)                                                      |
| `npm run check:data`       | Validace dat a vědeckých pravidel (zakázaná tvrzení CZ/EN, reference, formy) |
| `npm run check:links`      | Ověří, že všechny odkazy na obchody fungují (vyžaduje internet)              |
| `npm run gen:placeholders` | Znovu vygeneruje ilustrace potravin                                          |
| `npm run images:todo`      | Vygeneruje IMAGES_TODO.md                                                    |
| `npm test`                 | Vitest unit tests                                                            |
| `npm run test:rls`         | RLS isolation test against the Supabase project                              |
| `npm run seed:demo`        | Create/refresh the demo user                                                 |
| `npm run gen:seed`         | Regenerate `supabase/seed.sql` from `src/data`                               |
| `npm run test:e2e`         | Playwright: smoke testy + screenshoty 390/768/1440 (build do `.next-test`)   |

První běh Playwrightu: `npx playwright install chromium`.

## Supabase setup (EU)

1. Create a project at supabase.com — region **Central EU (Frankfurt)**.
2. Copy `.env.example` to `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
   `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API).
3. Apply the schema: SQL Editor → paste `supabase/migrations/*.sql` in order → Run. Then run `supabase/seed.sql`
   (regenerate with `npm run gen:seed`).
4. Auth → URL Configuration: Site URL = your domain; add `http://localhost:3000/auth/callback` and
   `https://<domain>/auth/callback` to Redirect URLs.
5. Google sign-in (optional): create an OAuth client in Google Cloud Console, enable the Google provider in
   Supabase → Auth → Providers with its client id/secret.
6. `npm run seed:demo` (demo user from `DEMO_USER_EMAIL`/`DEMO_USER_PASSWORD`) and `npm run test:rls`
   (verifies one user can never read or change another user's data).

Without these variables the public pages work and app routes show a setup screen.

## Affiliate (partnerské odkazy)

1. Zaregistrujte se v partnerském programu BrainMarket a Vilgain.
2. Ve Vercelu (Settings → Environment Variables) nastavte query string, který vám program přidělí:
   - `NEXT_PUBLIC_AFF_BRAINMARKET` — např. `a_aid=XXXX`
   - `NEXT_PUBLIC_AFF_VILGAIN` — např. `utm_source=flx&ref=XXXX`
3. Redeploy. `src/data/affiliate.ts` parametry přidá ke všem odkazům.

Odkazy mají `rel="sponsored"` a u každého bloku je viditelné upozornění (zákon o ochraně spotřebitele). Kritéria
výběru jsou na `/jak-doporucujeme`. Bez proměnných odkazy fungují, jen bez provize.

## Architektura

```
src/data/
  types.ts         doménový model (Organ, Nutrient, Food)
  organs.ts        11 orgánů: fyziologie, živiny + úroveň důkazů, věda, geometrie zoomu
  nutrients.ts     25 živin: RHP, prahy „zdroj“, znění tvrzení EU
  reference.ts     doporučení EFSA (PRI/AI, muži/ženy) a horní limity (UL) — ověřeno 11/2026
  absorption.ts    formy živin podle vstřebatelnosti, kdy má doplněk smysl, tipy, studie
  supplements.ts   pořadí živin na /doplnky
  retailers.ts     doporučené produkty (BrainMarket, Vilgain) s formou a dávkou
  affiliate.ts     affiliate parametry z env + text upozornění
  foods.ts         32 potravin (USDA FDC, na 100 g)
  looksmaxing.ts   pilíře a mýty pro /looksmaxing
lib/nutrition.ts   výpočty: isSource, foodsForOrgan, organsForFood, topFoodsFor …
app/               /, /organ/[id], /food/[id], /doplnky, /jak-doporucujeme, /looksmaxing, /science
```

Staré adresy obchodu (`/shop`, `/product/*`, `/cart`, `/checkout`, `/our-standard`) se přesměrovávají
(`next.config.ts`).

### Pravidla obsahu

- Žádná potravina orgán neléčí, nedetoxikuje ani neopravuje (`check:data` to hlídá i česky).
- Každé propojení živiny s orgánem má úroveň důkazů; kde existuje tvrzení EU, používá se jeho české znění.
- Potravina je propojená s orgánem jen při ≥ 15 % referenční hodnoty na 100 g (vypočteno z dat).
- U doplňků: nejdřív strava; forma podle důkazů; dávka vůči EFSA a hornímu limitu; vysoké dávky označené.

## Jak přidat …

**Živinu do doplňků** — doplňte `reference.ts` (EFSA + UL), `absorption.ts` (formy s hodnocením, kdy, tipy,
zdroje), případně produkty v `retailers.ts`, a přidejte id do `supplements.ts`. Spusťte `check:data` a `check:links`.

**Doporučený produkt** — v `retailers.ts` přes `bm()`/`vg()` s polem `why` (forma, dávka). Doporučujte jen formy
hodnocené „nejlepší“ nebo „dobrá“ a dávky pod horním limitem; vysoké dávky označte `note`.

**Orgán / potravinu** — viz `organs.ts`, `foods.ts` (+ `npm run gen:placeholders`).

## Před spuštěním

- Registrace v affiliate programech a nastavení env proměnných.
- Ilustrace potravin nahradit licencovanými fotografiemi (`IMAGES_TODO.md`).
- Doplnit číselná FDC ID u potravin.
- Odborná revize textů (nutriční terapeut) a právní stránky (GDPR, cookies, obchodní podmínky).
- `NEXT_PUBLIC_SITE_URL` při vlastní doméně.
