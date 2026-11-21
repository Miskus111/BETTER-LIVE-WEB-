# Better Live with Biohacking — web

Veřejný vzdělávací web: interaktivní mapa těla, co jednotlivé orgány potřebují (s hodnocením důkazů), které potraviny
to dodají (vypočteno z USDA), průvodci „Jak funguje tělo“, referenční hodnoty EFSA, vstřebatelnost forem doplňků a
doporučené produkty přes partnerské (affiliate) odkazy. FLX nic neprodává.

Web je **čistě statický** (žádné přihlášení ani databáze) a servíruje se z CDN. Aplikace — trénink, jídelníček, AI
kouč, osobní data — je samostatný projekt
[BETTER-LIVE-WITH-BIOHACKIN-APP-](https://github.com/Miskus111/BETTER-LIVE-WITH-BIOHACKIN-APP-) na vlastní adrese
(`NEXT_PUBLIC_APP_URL`). Odkazy do aplikace (`/login`, `/today`…) vede komponenta `@/components/ui/Link` rovnou na
její adresu a staré adresy aplikace na tomto webu přesměrovává `next.config.ts`.

> Vzdělávací obsah, ne lékařská rada.

```bash
npm install
npm run dev            # http://localhost:3000
```

| Skript                     | Co dělá                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `npm run check`            | Vše, co spouští CI: lint, typecheck, unit testy, kontroly dat a e2e                              |
| `npm run dev`              | Vývojový server                                                                                  |
| `npm run build` / `start`  | Produkční build (vše staticky generované)                                                        |
| `npm run lint`             | ESLint                                                                                           |
| `npm run typecheck`        | `tsc --noEmit` (strict)                                                                          |
| `npm run check:data`       | Validace dat a vědeckých pravidel (zakázaná tvrzení CZ/EN, reference, formy)                     |
| `npm run check:sources`    | Každá citace z PubMed vede na studii, kterou jmenuje (autor a rok; internet)                     |
| `npm run review:doc`       | Podklad pro lékařskou kontrolu (`docs/lekarska-kontrola.md` + `.docx`); CI hlídá, že je aktuální |
| `npm run check:links`      | Ověří, že všechny odkazy na obchody fungují (vyžaduje internet)                                  |
| `npm run foods:build`      | Postaví databázi potravin z USDA FDC podle `scripts/foods/selection.csv`                         |
| `npm run foods:validate`   | Validace databáze potravin (provenience, Atwater, kJ, sůl, nemožné hodnoty)                      |
| `npm run gen:placeholders` | Znovu vygeneruje ilustrace potravin                                                              |
| `npm run images:todo`      | Vygeneruje IMAGES_TODO.md                                                                        |
| `npm test`                 | Vitest unit tests                                                                                |
| `npm run test:e2e`         | Playwright: smoke testy + screenshoty 390/768/1440 (build do `.next-test`)                       |

První běh Playwrightu: `npx playwright install chromium`.

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
  foods.ts         448 potravin pro klienta (lehký index z foods.lite.generated.json)
  food-details.ts  plný panel 50 živin na 100 g (server-only, foods.generated.json)
  food-notes.ts    ručně psané poznámky a ilustrace k vybraným potravinám
scripts/foods/     pipeline: fdc.ts (stažení datasetů), build.ts, recipes.ts, rules.ts, validate.ts
lib/foods/         panel.ts (živiny + RHP EU), units.ts, query.ts, variants.ts, validate.ts
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

**Orgán** — viz `organs.ts`.

**Potravinu** — přidejte řádek do `scripts/foods/selection.csv`: FDC ID, dataset (`Foundation`/`SR Legacy`), přesný
popis z FDC (build ho porovná), český a anglický název, kategorie, stav (`raw`, `cooked`…), porce
(`popisek=klíčové slovo FDC porce` nebo `popisek==gramy` pro domácí míru) a alergeny. Syrovou a vařenou podobu
přidejte jako dva řádky s vlastními FDC ID. Pak `npm run foods:build` (stáhne datasety do `.cache/fdc`, vypíše
rozdíl proti současným datům, nic nemění, když se nic nezměnilo) a `npm run foods:validate`. Hodnoty nikdy
nezapisujte ručně; neznámá hodnota je `null` → „bez údajů“. Zdroje a licence: `docs/data-sources.md`, audit:
`docs/food-data-audit.md`. Porce z FDC: přesný název míry má přednost, „dry … yields“ se nepoužívá, počet
v popisku („6 ústřic“) se násobí; validace odmítne porci z FDC nad 400 g.

**Průvodce nebo stránku doplňku** — přidejte datum prvního zveřejnění do `src/data/published.ts` (jinak selže test;
jde do `datePublished` ve strukturovaných datech). Slova, kterými lidé téma hledají a průvodce je nemusí obsahovat
(„nespavost“ → Spánek), patří do `GUIDE_ALIASES` v `src/lib/search.ts`. Po větší změně obsahu posuňte datum
skupiny v `src/app/sitemap.ts`.

**Texty o živinách** — pojmy „zdroj“ / „vysoký obsah“ používejte jen podle prahů EU (nařízení 1924/2006): zdroj
≥ 15 % RHP na 100 g, vysoký obsah ≥ 30 % (u nápojů polovina). Shrnutí „V kostce“ (`src/lib/foods/summary.ts`) i
varování o horních limitech EFSA (`src/lib/foods/upper-limits.ts`) se počítají z dat, ne ručně.

## Sdílená data s aplikací

`src/data` (potraviny, doplňky, orgány, živiny, průvodci) vzniká tady — pipeline USDA, `check:data` a podklad pro
lékařskou kontrolu. Aplikace si data převezme `npm run sync:data -- <cesta k tomuto repozitáři>`. Cviky a mobilita
(`exercises`, `mobility.ts`) patří jen aplikaci.

## Bezpečnost

- Hlavičky v `next.config.ts`: nosniff, zákaz vkládání do rámců, referrer a permissions policy a CSP —
  web smí načítat a posílat data jen na vlastní doménu a Open Food Facts. Nová externí služba
  (platební brána, analytika, mapy) se musí do CSP přidat, jinak ji prohlížeč zablokuje. Inline skripty jsou
  povolené (Next je potřebuje; nonce by vypnul statické stránky).
- E2E test spouští axe (přístupnost) na hlavních stránkách a v prázdném vyhledávání.

## Před spuštěním

- Registrace v affiliate programech a nastavení env proměnných.
- Ilustrace potravin nahradit licencovanými fotografiemi (`IMAGES_TODO.md`).
- Vercel: `NEXT_PUBLIC_APP_URL` = adresa aplikace, `NEXT_PUBLIC_SITE_URL` = adresa webu.
- Odborná revize textů (nutriční terapeut) a právní stránky (GDPR, cookies, obchodní podmínky).
- `NEXT_PUBLIC_SITE_URL` při vlastní doméně.
