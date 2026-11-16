import type { NutrientId, Source } from './types'
import { SRC } from './sources'

/**
 * Vstřebatelnost (biologická dostupnost) — které formy živin tělo využije nejlépe a jak je užívat.
 * Hodnocení je relativní a opatrné: rozdíly mezi formami jsou často menší, než tvrdí marketing.
 * Ověřeno k 16. 11. 2026.
 */
export type FormRating = 'nejlepší' | 'dobrá' | 'slabší'

export interface Absorption {
  /** kdy dává doplněk smysl (jinak stačí strava) */
  when: string
  forms: { name: string; rating: FormRating; note: string }[]
  tips: string[]
  sources: Source[]
}

export const ABS_SRC = {
  tripkovic: {
    title: 'Tripkovic a kol. (2012) Vitamin D2 vs D3 — metaanalýza, Am J Clin Nutr',
    url: 'https://pubmed.ncbi.nlm.nih.gov/22552031/',
  },
  stoffel: {
    title: 'Stoffel a kol. (2017) Železo obden vs denně, Lancet Haematology',
    url: 'https://pubmed.ncbi.nlm.nih.gov/29032957/',
  },
  wegmuller: {
    title: 'Wegmüller a kol. (2014) Vstřebávání zinku z citrátu, glukonátu a oxidu, J Nutr',
    url: 'https://pubmed.ncbi.nlm.nih.gov/24259556/',
  },
  heaney: {
    title: 'Heaney a kol. (1999) Vstřebávání vápníku z uhličitanu a citrátu, Osteoporosis Int',
    url: 'https://pubmed.ncbi.nlm.nih.gov/10367025/',
  },
} satisfies Record<string, Source>

export const ABSORPTION: Partial<Record<NutrientId, Absorption>> = {
  vitD: {
    when: 'V ČR zhruba od října do března, když kůže vitamín D ze slunce nevytvoří; celoročně při malém pobytu venku nebo ve vyšším věku.',
    forms: [
      {
        name: 'Vitamín D3 (cholekalciferol)',
        rating: 'nejlepší',
        note: 'Zvyšuje hladinu v krvi přibližně dvakrát účinněji než D2. Existuje i rostlinná D3 z lišejníku.',
      },
      {
        name: 'Vitamín D2 (ergokalciferol)',
        rating: 'slabší',
        note: 'Funguje, ale hladinu zvyšuje méně a kratší dobu.',
      },
    ],
    tips: [
      'Užívejte s jídlem, které obsahuje tuk — vitamín D je rozpustný v tucích.',
      'Na udržení obvykle stačí 10–25 µg (400–1 000 IU) denně; vyšší dávky jen po změření hladiny.',
      'Nepřekračujte 100 µg (4 000 IU) denně dlouhodobě bez lékaře.',
    ],
    sources: [ABS_SRC.tripkovic, SRC.ods],
  },
  magnesium: {
    when: 'Při nízkém příjmu ořechů, semínek, luštěnin a celozrnných obilovin, při velkém pocení nebo křečích (po vyloučení jiných příčin).',
    forms: [
      {
        name: 'Bisglycinát (glycinát)',
        rating: 'nejlepší',
        note: 'Dobře se vstřebává a je šetrný k zažívání.',
      },
      {
        name: 'Citrát, laktát, malát',
        rating: 'dobrá',
        note: 'Dobře rozpustné; citrát ve vyšší dávce mírně projímá.',
      },
      {
        name: 'Oxid',
        rating: 'slabší',
        note: 'Hodně hořčíku v kapsli, ale vstřebá se ho málo; častěji projímá.',
      },
    ],
    tips: [
      'Rozdělte dávku na 2× denně — menší dávky se vstřebávají lépe.',
      'Doplněk nad 250 mg denně může způsobit průjem (limit EFSA pro doplňky).',
      'Na etiketě hledejte množství elementárního hořčíku, ne hmotnost celé sloučeniny.',
    ],
    sources: [SRC.ods],
  },
  iron: {
    when: 'Jen při prokázaném nedostatku (krevní test: feritin, hemoglobin) — typicky ženy se silnou menstruací, těhotné, vegani, dárci krve.',
    forms: [
      {
        name: 'Hemové železo (maso, ryby)',
        rating: 'nejlepší',
        note: 'Vstřebává se 15–35 % a méně ho ovlivňuje zbytek jídla.',
      },
      {
        name: 'Síran, fumarát, bisglycinát železnatý',
        rating: 'dobrá',
        note: 'Dvojmocné železo z doplňků se vstřebává podobně; bisglycinát bývá šetrnější k žaludku.',
      },
      { name: 'Trojmocné železo (železité soli)', rating: 'slabší', note: 'Vstřebává se hůř než dvojmocné.' },
    ],
    tips: [
      'Užívejte obden ráno nalačno — v kontrolované studii se tak vstřebalo o třetinu víc železa než při denním užívání.',
      'Zapijte vodou nebo džusem s vitamínem C, ne kávou, čajem ani mlékem (s odstupem 2 hodin).',
      'Neužívejte současně s vápníkem nebo zinkem.',
      'Nadbytek železa škodí — bezpečná úroveň je 40 mg denně.',
    ],
    sources: [ABS_SRC.stoffel, SRC.ods],
  },
  zinc: {
    when: 'Při veganské stravě, vysokém příjmu fytátů (luštěniny, celozrnné obiloviny) nebo malém příjmu masa a mořských plodů.',
    forms: [
      {
        name: 'Citrát, glukonát, bisglycinát',
        rating: 'nejlepší',
        note: 'Citrát a glukonát se ve studii vstřebaly stejně (≈ 61 %).',
      },
      { name: 'Oxid', rating: 'slabší', note: 'Vstřebal se méně (≈ 50 %) a u části lidí téměř vůbec.' },
    ],
    tips: [
      'Stačí 10–15 mg denně; dlouhodobě nepřekračujte 25 mg.',
      'Dlouhodobé vysoké dávky zinku snižují vstřebávání mědi — komplexy často obsahují i měď.',
      'Neužívejte současně se železem nebo vápníkem.',
    ],
    sources: [ABS_SRC.wegmuller, SRC.ods],
  },
  calcium: {
    when: 'Když nejíte mléčné výrobky, sardinky s kostmi ani obohacené rostlinné nápoje. Jinak se upřednostňuje strava.',
    forms: [
      {
        name: 'Vápník z potravin',
        rating: 'nejlepší',
        note: 'Mléčné výrobky, sardinky, kadeřávek, obohacené nápoje.',
      },
      {
        name: 'Uhličitan vápenatý',
        rating: 'dobrá',
        note: 'S jídlem se vstřebává stejně dobře jako citrát a je levnější.',
      },
      {
        name: 'Citrát vápenatý',
        rating: 'dobrá',
        note: 'Vstřebá se i nalačno a při léčbě na snížení žaludeční kyseliny.',
      },
    ],
    tips: [
      'Najednou maximálně 500 mg — větší dávka se vstřebá hůř.',
      'Uhličitan berte s jídlem; vápník z doplňků neužívejte současně se železem.',
      'Kombinace s vitamínem D zlepšuje vstřebávání.',
    ],
    sources: [ABS_SRC.heaney, SRC.ods],
  },
  b12: {
    when: 'Vždy při veganské stravě, často ve vyšším věku (méně žaludeční kyseliny) a při dlouhodobém užívání metforminu nebo léků na kyselost.',
    forms: [
      {
        name: 'Kyanokobalamin',
        rating: 'nejlepší',
        note: 'Nejlépe prozkoumaný, stabilní a levný; v těle se přemění na aktivní formy.',
      },
      {
        name: 'Methylkobalamin, adenosylkobalamin',
        rating: 'dobrá',
        note: 'Fungují také; přesvědčivé důkazy o lepším účinku u zdravých lidí chybí.',
      },
    ],
    tips: [
      'Z jedné dávky se přes vnitřní faktor vstřebají jen asi 1–2 µg; zbytek pasivně (~1 %), proto doplňky mívají 25–1 000 µg.',
      'Při vážném nedostatku nebo poruše vstřebávání řeší lékař injekce.',
    ],
    sources: [SRC.ods],
  },
  folate: {
    when: 'Ženy plánující těhotenství: 400 µg kyseliny listové denně alespoň měsíc před početím a v prvním trimestru.',
    forms: [
      {
        name: 'Kyselina listová',
        rating: 'nejlepší',
        note: 'Vstřebává se lépe než folát z jídla (≈ 85 % vs. ≈ 50 %); nejvíc důkazů pro prevenci vad neurální trubice.',
      },
      {
        name: '5-MTHF (methylfolát)',
        rating: 'dobrá',
        note: 'Aktivní forma; rozumná alternativa, ale ne nutně lepší.',
      },
      {
        name: 'Folát z potravin',
        rating: 'dobrá',
        note: 'Listová zelenina, luštěniny, játra — citlivý na teplo a dlouhé vaření.',
      },
    ],
    tips: ['Kyselina listová z doplňků: nepřekračujte 1 000 µg denně.'],
    sources: [SRC.ods],
  },
  omega3: {
    when: 'Když nejíte tučné ryby (losos, makrela, sardinky) alespoň 1–2× týdně; vegani volí olej z řas.',
    forms: [
      {
        name: 'Triglyceridy (TG, rTG)',
        rating: 'nejlepší',
        note: 'Přirozená forma v rybách; ve studiích stejně dobrá nebo mírně lepší než ethylestery.',
      },
      {
        name: 'Fosfolipidy (krilový olej)',
        rating: 'dobrá',
        note: 'Srovnávací studie neukázaly významný rozdíl oproti rybímu oleji.',
      },
      {
        name: 'Ethylestery (EE)',
        rating: 'dobrá',
        note: 'Nejlevnější koncentráty; vstřebají se lépe, když se berou s tučným jídlem.',
      },
    ],
    tips: [
      'Užívejte s nejtučnějším jídlem dne, ne se snídaní bez tuku.',
      'Hledejte nízkou oxidaci (TOTOX ideálně pod 26) a obsah EPA + DHA, ne jen „rybí olej“.',
    ],
    sources: [SRC.ods, SRC.efsa],
  },
  vitC: {
    when: 'Doplněk většinou není potřeba — 1–2 porce ovoce nebo zeleniny denně pokryjí doporučení.',
    forms: [
      {
        name: 'Kyselina L-askorbová',
        rating: 'nejlepší',
        note: 'Levná a dobře vstřebatelná; z potravin i doplňků stejně.',
      },
      { name: 'Askorbáty (sodný, vápenatý)', rating: 'dobrá', note: 'Méně kyselé, šetrnější k žaludku.' },
      {
        name: 'Lipozomální vitamín C',
        rating: 'dobrá',
        note: 'Výrazně dražší; o lepším účinku u zdravých lidí jsou zatím jen předběžné údaje.',
      },
    ],
    tips: [
      'Do ~200 mg denně se vstřebá téměř všechno, nad 1 g méně než polovina.',
      'Vitamín C ve stejném jídle zlepšuje vstřebání železa z rostlin.',
    ],
    sources: [SRC.ods],
  },
  vitK: {
    when: 'Doplněk obvykle není potřeba — listová zelenina pokryje doporučení. Při warfarinu jen po domluvě s lékařem.',
    forms: [
      {
        name: 'K1 (fylochinon) z listové zeleniny',
        rating: 'dobrá',
        note: 'Vstřebá se lépe s tukem (zelenina s olejem).',
      },
      {
        name: 'K2 MK-7',
        rating: 'dobrá',
        note: 'V krvi vydrží déle než K1; přínos pro kosti u zdravých lidí je zatím nejistý.',
      },
    ],
    tips: ['Zeleninu bohatou na vitamín K jezte s trochou tuku.'],
    sources: [SRC.ods],
  },
  vitE: {
    when: 'Doplněk obvykle není potřeba — ořechy, semínka a rostlinné oleje stačí.',
    forms: [
      {
        name: 'Přírodní RRR-α-tokoferol (d-alfa)',
        rating: 'nejlepší',
        note: 'Tělo ho využije zhruba 2× lépe než syntetickou formu.',
      },
      {
        name: 'Syntetický all-rac-α-tokoferol (dl-alfa)',
        rating: 'slabší',
        note: 'Na stejný účinek je potřeba vyšší dávka.',
      },
    ],
    tips: ['Užívejte s jídlem obsahujícím tuk.'],
    sources: [SRC.ods],
  },
  vitA: {
    when: 'Doplněk obvykle není potřeba a nadbytek škodí. Vitamín A z rostlin (beta-karoten) tělo přeměňuje podle potřeby.',
    forms: [
      {
        name: 'Beta-karoten z potravin',
        rating: 'nejlepší',
        note: 'Bezpečný; vstřebá se lépe z vařené mrkve či dýně s tukem.',
      },
      {
        name: 'Retinol (hotový vitamín A)',
        rating: 'dobrá',
        note: 'Vstřebává se dobře, ale může se hromadit — limit 3 000 µg denně.',
      },
    ],
    tips: ['Kuřáci by neměli užívat vysoké dávky beta-karotenu v doplňcích.'],
    sources: [SRC.ods],
  },
  iodine: {
    when: 'Těhotné a kojící ženy, vegani a lidé, kteří nesolí jodidovanou solí.',
    forms: [
      { name: 'Jodid draselný', rating: 'nejlepší', note: 'Vstřebá se téměř úplně (> 90 %).' },
      {
        name: 'Mořské řasy (kelp)',
        rating: 'slabší',
        note: 'Obsah jódu kolísá a může výrazně překročit limit 600 µg.',
      },
    ],
    tips: ['Jodidovaná sůl ve střídmém množství pokryje velkou část potřeby.'],
    sources: [SRC.ods],
  },
  protein: {
    when: 'Když stravou nepokryjete potřebu — např. při silovém tréninku, ve vyšším věku nebo při hubnutí.',
    forms: [
      {
        name: 'Syrovátka (whey)',
        rating: 'nejlepší',
        note: 'Rychle stravitelná, vysoký obsah leucinu; izolát má minimum laktózy.',
      },
      { name: 'Kasein, vejce', rating: 'dobrá', note: 'Kasein se tráví pomalu — vhodný na noc.' },
      {
        name: 'Rostlinné (hrách, rýže, sója)',
        rating: 'dobrá',
        note: 'Nejlépe ve směsi, která doplní chybějící aminokyseliny.',
      },
    ],
    tips: [
      'Rozložte bílkoviny do 3–4 jídel po 20–40 g.',
      'Protein je potravina, ne lék — přednost má jídlo.',
    ],
    sources: [SRC.efsa],
  },
  cultures: {
    when: 'Fermentované potraviny jsou dobrá součást stravy. Probiotika v kapslích mají smysl hlavně u konkrétních indikací (např. při antibiotikách) a jen u ověřených kmenů.',
    forms: [
      {
        name: 'Fermentované potraviny s živými kulturami',
        rating: 'dobrá',
        note: 'Kefír, jogurt, nepasterované kysané zelí a kimči.',
      },
      {
        name: 'Probiotika s uvedeným kmenem a dávkou',
        rating: 'dobrá',
        note: 'Účinek platí jen pro konkrétní kmen (např. L. rhamnosus GG), ne obecně.',
      },
    ],
    tips: ['Hledejte označení kmene (rod, druh, kód) a počet CFU na konci trvanlivosti.'],
    sources: [SRC.isapp],
  },
  fiber: {
    when: 'Když nejíte dost zeleniny, luštěnin a celozrnných obilovin (cíl 25 g denně).',
    forms: [
      { name: 'Vláknina z potravin', rating: 'nejlepší', note: 'Přináší i vitamíny, minerály a polyfenoly.' },
      {
        name: 'Psyllium, ovesný beta-glukan',
        rating: 'dobrá',
        note: 'Rozpustná vláknina; beta-glukan má schválené tvrzení o cholesterolu (3 g denně).',
      },
    ],
    tips: ['Přidávejte postupně a pijte dost vody.'],
    sources: [SRC.euRegister],
  },
}
