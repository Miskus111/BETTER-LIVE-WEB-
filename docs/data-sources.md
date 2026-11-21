# Zdroje dat o potravinách

Všechny nutriční hodnoty v aplikaci jsou dohledatelné ke konkrétnímu záznamu ve zdroji. Neznámá hodnota je
`null` a v UI se zobrazí jako „bez údajů“, nikdy jako 0 ani odhad.

| Zdroj                                        | Verze       | Co z něj bereme                    | Licence                                                                           | Stav                                   |
| -------------------------------------------- | ----------- | ---------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------- |
| USDA FoodData Central — **Foundation Foods** | 2026-10-29  | 20 potravin (přednostně)           | Public domain, [CC0 1.0](https://fdc.nal.usda.gov/data-documentation)             | používáme                              |
| USDA FoodData Central — **SR Legacy**        | 2018-04     | 423 potravin                       | Public domain, CC0 1.0                                                            | používáme                              |
| Vypočtené recepty (BLWB)                     | —           | 5 českých jídel ze surovin výše    | vlastní výpočet                                                                   | používáme, `verified: false`           |
| Open Food Facts                              | živé API v2 | balené výrobky podle čárového kódu | [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/) (databáze), obsah DbCL | jen dotaz z prohlížeče, nic neukládáme |
| NutriDatabáze.cz (ÚZEI)                      | —           | —                                  | vlastní licenční podmínky                                                         | **nepoužíváme** (viz níže)             |

## USDA FoodData Central

- Stažené hromadné JSON soubory (`FoodData_Central_sr_legacy_food_json_2018-04.zip`,
  `FoodData_Central_foundation_food_json_2026-10-29.zip`) z
  <https://fdc.nal.usda.gov/download-datasets>. Cache v `.cache/fdc/` (není v gitu), datum stažení se
  ukládá do `provenance.retrievedAt`.
- Licence: data USDA jsou veřejné vlastnictví (CC0 1.0). Uvádíme citaci
  „U.S. Department of Agriculture, Agricultural Research Service. FoodData Central.“ a u každé potraviny
  odkaz na `https://fdc.nal.usda.gov/food-details/<FDC ID>/nutrients`.
- **Výběr datasetu:** Foundation Foods má modernější analýzy, ale menší nutriční panel. Foundation
  použijeme, jen když existuje záznam se stejným popisem a jeho panel pokrývá ≥ 80 % živin záznamu
  SR Legacy (plus 6 ručně spárovaných případů v `selection.csv`). Jinak SR Legacy.
- Značkové výrobky (Branded Foods) záměrně nepoužíváme — jde o etikety výrobců, ne o analýzy.
- Výběr potravin je v `scripts/foods/selection.csv` (FDC ID, dataset, přesný popis v FDC, český název,
  kategorie, stav — syrové/vařené…, porce, alergeny). Syrová a tepelně upravená podoba jsou vždy dvě
  samostatné potraviny se svým FDC ID; hodnoty se nikdy nemíchají ani nepřepočítávají.

### Převody jednotek (`src/lib/foods/units.ts`, pokryto testy)

- Vitamin D: 1 µg = 40 IU (použije se jen když FDC nemá µg).
- Folát: DFE = folát z potravin + 1,7 × kyselina listová (jen když FDC nemá přímo DFE).
- Energie: 1 kcal = 4,184 kJ (kJ dopočítáme, jen když chybí).
- Sůl = sodík × 2,5 (nařízení EU 1169/2011, příloha I).
- Sacharidy: FDC uvádí „carbohydrate by difference“ (včetně vlákniny, americký způsob). Pro evropské
  značení počítáme **využitelné sacharidy = sacharidy − vláknina**; obě hodnoty jsou v datech.
- Referenční hodnoty příjmu (% RHP): nařízení EU 1169/2011, příloha XIII, část A.

### Americká data vs. české potraviny

USDA popisuje americké výrobky. Kde se liší od českých, data upravujeme jen jedním směrem — hodnotu skryjeme
(„bez údajů“) a důvod uvedeme u potraviny, nikdy ji nedopočítáváme (`SUSPECT_VALUES` v `scripts/foods/rules.ts`):

- **Obohacená mouka a rýže („enriched“)** — v USA povinně obohacené folátem, železem a vitamíny B. Kde existuje
  neobohacený záznam FDC, používáme ho (rýže, těstoviny, krupice, mouka, nudle); u pečiva tyto živiny skryjeme.
- **Mléko s přidaným vitamínem D (a A)** — české mléko se neobohacuje; přidané vitamíny skryjeme.
- **Výrobky obohacené výrobcem** (tavený sýr, margarín, syrovátkový protein) — obsah závisí na značce; skryjeme.
- **Rostlinné nápoje** (sójový, mandlový, ovesný, rýžový) — americké záznamy jsou obohacené vápníkem a vitamíny D
  a B12 stejně jako většina běžných českých značek, proto hodnoty ponecháváme; název říká „(obohacený)" a poznámka
  upozorňuje, že bio nápoje bývají neobohacené.
- **Zjevně chybné hodnoty ve zdroji** (např. rozpad tuků u FDC 168000) — skryjeme.
- **Bez přesného ekvivalentu** (tvaroh, rohlík, bábovka…) — použijeme nejbližší záznam, v názvu „(blízká obdoba)“
  a poznámka u potraviny říká, jaký výrobek data popisují (`APPROXIMATIONS`).

Validace (`npm run foods:validate`) odmítne záznam „enriched“ nebo mléko s přidaným vitamínem D, které by tyto
hodnoty ukazovaly.

## Vypočtené recepty

`scripts/foods/recipes.ts` — svíčková, svíčková omáčka, houskový knedlík, hovězí guláš, bramboračka.
Hodnoty jsou vážený součet surovin z FDC na 100 g hotového jídla bez korekce na odpar a ztráty vařením.
Chybějící hodnota suroviny = chybějící hodnota jídla (výjimka: voda a sůl jako přísada se počítají jako 0).
Proto mají `verified: false` a stránka to výslovně uvádí.

## Open Food Facts

Vyhledání baleného výrobku podle EAN (`src/components/food/BarcodeLookup.tsx`) volá přímo z prohlížeče
`https://world.openfoodfacts.org/api/v2/product/<EAN>.json`. Údaje nikam neukládáme ani nemícháme s
databází výše. U výsledku je odkaz na produkt, uvedení „Open Food Facts (licence ODbL)“ a upozornění, že
jde o údaje přidané uživateli a neověřené.

## NutriDatabáze.cz (ÚZEI) — proč ji nepoužíváme

Licenční podmínky (<http://www.nutridatabaze.cz/licencni-podminky-a-zpracovani-osobnich-udaju/>,
zkontrolováno 20. 11. 2026):

- databáze je chráněna autorským zákonem č. 121/2000 Sb.;
- uživatel **není oprávněn postoupit datový soubor třetí osobě**, a to ani částečně, ani bezúplatně;
- export je jen pro registrované uživatele; při zveřejnění je povinná citace
  „Na základě dat z NutriDatabaze.cz, verze X.X, ÚZEI, Praha“;
- licence neobsahuje výslovné svolení ke komerčnímu ani hromadnému zveřejnění.

Zveřejnění hodnot v aplikaci by bylo předáním dat třetím osobám, proto ji bez **písemného souhlasu ÚZEI**
nepoužíváme. Pokud souhlas získáme, přidá se jako další dataset v `scripts/foods/fdc.ts` s vlastní
`provenance` a citací.

## Ruční záznamy

Ruční potravina smí do dat jen s citací zdroje v `provenance.notes` a s `verified: false`. Momentálně
žádná taková není.
