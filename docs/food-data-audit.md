# Audit dat o potravinách — 20. 11. 2026

## Původní stav

- 32 ručně zapsaných potravin v `src/data/foods.ts`, 10 kategorií.
- U každé: kcal, bílkoviny/tuky/sacharidy/vláknina a 5–10 vybraných mikroživin. Textový odkaz na FDC
  (`fdc`), ale bez FDC ID, verze datasetu a data stažení.
- Chyběly: kompletní panel živin, porce, alergeny, dietní štítky, rozlišení syrové/vařené jako
  samostatných záznamů, validace.

### Srovnání původních hodnot s FDC

Všech 32 potravin jsme dohledali v FDC. Až na níže uvedené rozdíly původní hodnoty odpovídaly FDC
(rozdíly jen v zaokrouhlení).

| Potravina | Co se změnilo | Proč |
| --- | --- | --- |
| Vepřové (`pork`) | 120 → 109 kcal, tuk 3,5 → 2,17 g | Ruční hodnota neodpovídala zvolenému záznamu (vepřová panenka, syrová, FDC 168249). |
| Kefír (`kefir`) | 64 → 43 kcal, tuk 3,5 → 1,0 g | FDC má jen nízkotučný kefír (FDC 170904); ruční hodnota byla pro plnotučný bez zdroje. Název teď říká „nízkotučný“. |
| Ovesné vločky (`oats`) | 389 → 379 kcal, bílkoviny 16,9 → 13,2 g | Ruční hodnota byla pro syrový oves; nyní ovesné vločky (FDC 173904). |
| Všechny | sacharidy jsou nyní **využitelné** (bez vlákniny) | Evropské značení. Např. kapusta 4,4 → 0,3 g, mandle 21,6 → 9,1 g. Celkové sacharidy dle FDC zůstávají v plném panelu. |

## Současný stav

- **448 potravin**: 443 z USDA FDC (423 SR Legacy 2018-04, 20 Foundation Foods 2026-10-29) a 5
  vypočtených českých jídel.
- 18 kategorií: zelenina 71, ovoce 48, obiloviny a pečivo 47, maso 36, mléčné výrobky 34, ryby a mořské
  plody 31, bylinky a koření 31, ořechy a semínka 23, luštěniny 22, nápoje 22, drůbež 17, sladidla a
  sladkosti 15, oleje a tuky 14, brambory a hlízy 9, houby 9, vejce 7, fermentované 7, česká jídla 5.
- Stav: syrové 194, tepelně upravené 84 (+ pečené 12, pražené 1), fermentované 38, zpracované 36, sušené
  30, suché (k vaření) 22, konzervované 13, vařené nápoje 6, mražené 3, uzené/sušené maso 2, nakládané 2.
- U každé potraviny: 50 živin na 100 g (energie kcal/kJ, makroživiny, 13 vitamínů, 13 minerálů, mastné
  kyseliny, cholesterol, kofein, alkohol…), porce (z FDC nebo domácí míry), alergeny (14 dle EU
  1169/2011, příloha II), dietní štítky (vegan, vegetarián, bez lepku), provenience (FDC ID, popis,
  verze, datum stažení, licence).
- Vazby potravina → orgán se počítají automaticky z panelu (prahy „zdroj“ = 15 % RHP na 100 g / 100 ml
  podle EU 1924/2006), nikde nejsou zapsané ručně.

### Validace (`npm run foods:validate`, běží i v `check:data`)

Kontroluje: chybějící proveniencí, duplicitní ID, nemožné hodnoty (záporné, součet makroživin > 100 g),
energii proti Atwaterovým faktorům (tolerance 15 %; přijme obecné 4/4/9/7 i specifické faktory z FDC;
pod 40 kcal tolerance 6 kcal), kJ proti kcal, sůl proti sodíku, „bio“ tvrzení bez certifikace.
Výjimky z kontroly energie (ocet, jablečný ocet, stévie, citron, citronová šťáva, limeta) mají v datech
FDC energii z organických kyselin, které Atwaterovy faktory nepokrývají.

Vyřazeno při stavbě: šípek (FDC 173946) — zdrojová energie neodpovídá makroživinám ani po specifických
faktorech.

## Namátková kontrola proti FDC online

30 náhodně vybraných potravin (seed `20261120`) porovnáno s živým API
`https://api.nal.usda.gov/fdc/v1/foods` dne 20. 11. 2026. Kontrolovány energie, bílkoviny, tuky,
sacharidy, vláknina, vápník, železo, vitamin C a sodík; tolerance jen na zaokrouhlení.

**Výsledek: 30 / 30 shoduje, 0 rozdílů.**

| ID | FDC ID | Dataset | Výsledek |
| --- | --- | --- | --- |
| lemon | 167746 | SR Legacy | shoda |
| white-beans-dry | 175202 | SR Legacy | shoda |
| cranberries-dried | 171723 | SR Legacy | shoda |
| seaweed-nori | 170495 | SR Legacy | shoda |
| savoy | 170388 | SR Legacy | shoda |
| margarine | 171038 | SR Legacy | shoda |
| gouda | 171241 | SR Legacy | shoda |
| coconut-oil | 171412 | SR Legacy | shoda |
| carp | 171952 | SR Legacy | shoda |
| mushrooms-uv | 169376 | SR Legacy | shoda |
| salmon-cooked | 175168 | SR Legacy | shoda |
| portabella | 169255 | SR Legacy | shoda |
| tuna-fresh | 175159 | SR Legacy | shoda |
| tempeh-cooked | 172467 | SR Legacy | shoda |
| cod-cooked | 171956 | SR Legacy | shoda |
| celery | 169988 | SR Legacy | shoda |
| parmesan | 170848 | SR Legacy | shoda |
| apricot | 171697 | SR Legacy | shoda |
| peas | 170419 | SR Legacy | shoda |
| sauerkraut | 169279 | SR Legacy | shoda |
| tomato-canned | 170051 | SR Legacy | shoda |
| oysters | 171978 | SR Legacy | shoda |
| white-beans | 175203 | SR Legacy | shoda |
| spelt-cooked | 169746 | SR Legacy | shoda |
| peanuts-roasted | 174262 | SR Legacy | shoda |
| carrot-cooked | 170394 | SR Legacy | shoda |
| chicken-liver | 171060 | SR Legacy | shoda |
| frankfurter | 323121 | Foundation | shoda |
| mackerel | 175119 | SR Legacy | shoda |
| sesame-oil | 171016 | SR Legacy | shoda |

## Známé mezery

- **Jód** je v FDC téměř všude prázdný (data má jen 6 potravin) — zobrazuje se „bez údajů“, ne 0.
  Řešením by byla česká NutriDatabáze, ta je ale licenčně nedostupná (viz `data-sources.md`).
- **Přidané cukry** a **biotin (B7)** FDC v těchto datasetech neuvádí.
- **Trans tuky** chybí u 159 potravin, **cholin** u 73, **vitamin K** u 61, **vitamin D** u 46.
- **Kombucha** v FDC není (jen značkové výrobky), proto není v databázi; balené výrobky lze dohledat
  čárovým kódem přes Open Food Facts.
- Některé české potraviny (tvaroh, pražská šunka…) nemají přesný ekvivalent v FDC; použili jsme
  nejbližší záznam a jeho anglický popis je vždy vidět u potraviny.
- Recepty nekorigují odpar ani ztráty vařením (viz `data-sources.md`).
