import type { Evidence, Source } from './types'
import { SRC } from './sources'

/**
 * Doplňky nad rámec vitamínů a minerálů — kreatin, kofein, L-theanin, adaptogeny…
 * Každé tvrzení má úroveň důkazů (Prokázané / Pravděpodobné / Předběžné) a zdroj.
 * Všechny PubMed odkazy ověřeny přes NCBI E-utilities 16. 11. 2026.
 */
export type CompoundGoal = 'spanek' | 'soustredeni' | 'vykon' | 'stres' | 'telo'

export const GOALS: Record<CompoundGoal, { label: string; lead: string }> = {
  vykon: { label: 'Výkon a svaly', lead: 'Pro trénink, sílu a opakované intenzivní úsilí.' },
  soustredeni: { label: 'Energie a soustředění', lead: 'Bdělost, pozornost a práce hlavou.' },
  spanek: { label: 'Spánek', lead: 'Usínání a kvalita spánku — až po základech spánkové hygieny.' },
  stres: { label: 'Stres', lead: 'Takzvané adaptogeny a látky na zklidnění. Důkazy jsou tu nejslabší.' },
  telo: { label: 'Kůže a klouby', lead: 'Populární doplňky pro vzhled a pohybový aparát.' },
}

export interface Compound {
  id: string
  slug: string
  name: string
  aka?: string
  goal: CompoundGoal
  /** jednovětý verdikt */
  verdict: string
  what: string
  effects: { text: string; level: Evidence }[]
  dose: string
  timing: string
  forWhom: string
  caution: string[]
  /** schválené zdravotní tvrzení EU, pokud existuje */
  euClaim?: string
  regulation?: string
  myths?: { myth: string; fact: string }[]
  sources: Source[]
}

const pm = (id: number, title: string): Source => ({ title, url: `https://pubmed.ncbi.nlm.nih.gov/${id}/` })

const S = {
  kreider: pm(
    28615996,
    'Kreider a kol. (2017) Postoj ISSN: bezpečnost a účinnost kreatinu, J Int Soc Sports Nutr',
  ),
  guest: pm(33388079, 'Guest a kol. (2021) Postoj ISSN: kofein a sportovní výkon, J Int Soc Sports Nutr'),
  efsaCaffeine: {
    title: 'EFSA (2015) Vědecké stanovisko k bezpečnosti kofeinu, EFSA Journal 13(5):4102',
    url: 'https://doi.org/10.2903/j.efsa.2015.4102',
  },
  drake: pm(24235903, 'Drake a kol. (2013) Kofein 0, 3 a 6 hodin před spaním, J Clin Sleep Med'),
  owen: pm(18681988, 'Owen a kol. (2008) L-theanin a kofein: kognitivní výkon a nálada, Nutr Neurosci'),
  hidese: pm(31623400, 'Hidese a kol. (2019) L-theanin, stres a spánek — randomizovaná studie, Nutrients'),
  ferracioli: pm(23691095, 'Ferracioli-Oda a kol. (2013) Metaanalýza: melatonin u poruch spánku, PLoS One'),
  nccihMelatonin: {
    title: 'NCCIH (NIH) — Melatonin: co potřebujete vědět',
    url: 'https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know',
  },
  lopresti: pm(31517876, 'Lopresti a kol. (2019) Ashwagandha a stres — randomizovaná studie, Medicine'),
  philips: pm(
    37756041,
    'Philips a kol. (2023) Poškození jater po ashwagandze — série případů, Hepatol Commun',
  ),
  odsAshwa: {
    title: 'NIH Office of Dietary Supplements — Ashwagandha (přehled pro odborníky)',
    url: 'https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/',
  },
  miranda: pm(
    33742704,
    'de Miranda a kol. (2021) Hydrolyzovaný kolagen a stárnutí kůže — metaanalýza, Int J Dermatol',
  ),
  trexler: pm(26175657, 'Trexler a kol. (2015) Postoj ISSN: beta-alanin, J Int Soc Sports Nutr'),
  bannai: pm(22529837, 'Bannai a kol. (2012) Glycin a výkon po zkráceném spánku, Front Neurol'),
  cropley: pm(26502953, 'Cropley a kol. (2015) Rhodiola rosea, úzkost a stres, Phytother Res'),
  emaRhodiola: {
    title: 'EMA — monografie rostlinného léčivého přípravku Rhodiola rosea',
    url: 'https://www.ema.europa.eu/en/medicines/herbal/rhodiolae-roseae-rhizoma-et-radix',
  },
  saitsu: pm(31413233, 'Saitsu a kol. (2019) Korálovec ježatý a kognitivní funkce, Biomed Res'),
}

export const COMPOUNDS: Compound[] = [
  {
    id: 'creatine',
    slug: 'kreatin',
    name: 'Kreatin',
    aka: 'kreatin monohydrát',
    goal: 'vykon',
    verdict: 'Nejlépe prozkoumaný sportovní doplněk. Funguje, je levný a u zdravých lidí bezpečný.',
    what: 'Látka, kterou si tělo samo vyrábí a která se ve svalech ukládá jako fosfokreatin — rychlá rezerva energie na první sekundy intenzivní práce. Z jídla ho dostanete hlavně z masa a ryb, proto doplněk víc pocítí vegetariáni.',
    effects: [
      {
        text: 'Zvyšuje výkon při opakovaných krátkých intenzivních výkonech (sprinty, série v posilovně).',
        level: 'established',
      },
      {
        text: 'Spolu se silovým tréninkem pomáhá nabírat sílu a svalovou hmotu rychleji než trénink samotný.',
        level: 'established',
      },
      {
        text: 'Možná pomáhá mozku při nedostatku spánku nebo u lidí, kteří nejedí maso. Výzkum je zatím malý.',
        level: 'preliminary',
      },
    ],
    dose: '3–5 g denně, každý den. Nasycovací fáze (20 g týden) není potřeba — jen zrychlí nástup.',
    timing: 'Kdykoli během dne. Načasování k tréninku nehraje velkou roli, důležitá je pravidelnost.',
    forWhom:
      'Silové a intervalové sporty, kolektivní sporty, lidé nad 50 let se silovým tréninkem, vegetariáni.',
    caution: [
      'Zvyšuje kreatinin v krvi — výsledek pak může vypadat jako horší funkce ledvin. Před rozborem krve to řekněte lékaři.',
      'Při onemocnění ledvin jen po domluvě s lékařem.',
      'Prvních pár týdnů může váha stoupnout o 1–2 kg — je to voda ve svalech, ne tuk.',
    ],
    euClaim:
      'Kreatin zvyšuje fyzickou výkonnost při po sobě jdoucích krátkodobých intenzivních cvičeních (při 3 g denně). U dospělých nad 55 let může denní příjem kreatinu zvýšit účinek silového tréninku na svalovou sílu.',
    myths: [
      {
        myth: 'Kreatin ničí ledviny.',
        fact: 'U zdravých lidí to dlouhodobé studie nepotvrdily. Opatrnost platí pro ty, kdo už ledviny nemocné mají.',
      },
      { myth: 'Musí se cyklovat.', fact: 'Není k tomu důvod. Tělo si vlastní tvorbu po vysazení obnoví.' },
      { myth: 'Je to steroid.', fact: 'Není. Je to běžná látka z masa, kterou má každý ve svalech.' },
    ],
    sources: [
      S.kreider,
      SRC.euRegister,
      {
        title: 'Prováděcí nařízení Komise (EU) 2017/672 — tvrzení o kreatinu u dospělých nad 55 let',
        url: 'https://eur-lex.europa.eu/eli/reg_impl/2017/672/oj',
      },
    ],
  },
  {
    id: 'caffeine',
    slug: 'kofein',
    name: 'Kofein',
    goal: 'soustredeni',
    verdict: 'Funguje na bdělost i výkon. Problém není kofein, ale kdy a kolik — hlavně kvůli spánku.',
    what: 'Přes den se v mozku hromadí adenosin, který vytváří pocit únavy. Kofein se naváže na stejná místa a únavu „zamaskuje“. Adenosin ale nezmizí — proto po odeznění přijde útlum.',
    effects: [
      { text: 'Zvyšuje bdělost a pozornost.', level: 'established' },
      {
        text: 'Zlepšuje vytrvalostní i silový výkon (3–6 mg na kg tělesné hmotnosti 30–60 minut předem).',
        level: 'established',
      },
      {
        text: 'I 6 hodin před spaním dokáže měřitelně zhoršit spánek — často aniž si toho všimnete.',
        level: 'established',
      },
    ],
    dose: 'Bezpečně pro dospělé do 400 mg denně a do 200 mg najednou. V těhotenství do 200 mg denně. Espresso má zhruba 60–80 mg, plechovka energetického nápoje (250 ml) asi 80 mg.',
    timing:
      'Poslední kofein ideálně 8 a více hodin před spaním. Poločas rozpadu je v průměru kolem 5 hodin, u různých lidí ale velmi kolísá.',
    forWhom:
      'Většina zdravých dospělých. Výrazně citliví lidé, lidé s úzkostí nebo s poruchami srdečního rytmu by měli být opatrnější.',
    caution: [
      'Vysoké dávky zvyšují úzkost, bušení srdce a třes.',
      'Pozor na sčítání: káva + energetický nápoj + předtréninkovka může snadno přesáhnout 400 mg.',
      'Pro děti a dospívající platí podle EFSA nejvýš asi 3 mg na kg tělesné hmotnosti denně.',
    ],
    myths: [
      {
        myth: 'Káva dehydratuje.',
        fact: 'V běžných dávkách se u lidí zvyklých na kávu do pitného režimu započítává.',
      },
      {
        myth: 'Na mě kofein večer nepůsobí.',
        fact: 'Usnout můžete, ale spánek bývá mělčí a kratší — studie to měří přístroji, i když to člověk sám necítí.',
      },
    ],
    sources: [S.efsaCaffeine, S.guest, S.drake],
  },
  {
    id: 'theanine',
    slug: 'l-theanin',
    name: 'L-theanin',
    goal: 'soustredeni',
    verdict: 'Jemný efekt, žádný zázrak. Nejzajímavější je v kombinaci s kofeinem.',
    what: 'Aminokyselina z čajových lístků. Šálek zeleného nebo černého čaje jí obsahuje jen asi 10–30 mg, doplňky typicky 100–200 mg.',
    effects: [
      {
        text: 'S kofeinem (např. 100 mg theaninu + 50 mg kofeinu) o něco zlepšuje pozornost v krátkých testech a tlumí „nervozitu“ z kofeinu.',
        level: 'preliminary',
      },
      {
        text: '200 mg denně v malé studii mírně snížilo pocit stresu a zlepšilo subjektivní kvalitu spánku.',
        level: 'preliminary',
      },
    ],
    dose: '100–200 mg, s kofeinem obvykle v poměru zhruba 2 : 1.',
    timing: 'Ráno s kávou na soustředění, nebo večer, pokud ho zkoušíte na zklidnění.',
    forWhom: 'Lidé, kterým kofein dává energii, ale i neklid. Jinak je přínos malý.',
    caution: [
      'Obecně dobře snášený, dlouhodobá data ale chybí.',
      'V těhotenství a při kojení není dost údajů o bezpečnosti.',
    ],
    regulation:
      'Žádné zdravotní tvrzení EU pro L-theanin schválené není — výrobci nesmí tvrdit, že „snižuje stres“.',
    sources: [S.owen, S.hidese],
  },
  {
    id: 'melatonin',
    slug: 'melatonin',
    name: 'Melatonin',
    goal: 'spanek',
    verdict: 'Pomáhá hlavně na jet lag a posunutý rytmus. Jako prášek na spaní je jeho účinek malý.',
    what: 'Hormon, který si tělo samo vyrábí večer, když se setmí. Neuspává jako lék — dává tělu signál „je noc“. Proto víc záleží na načasování než na dávce.',
    effects: [
      { text: '1 mg krátce před spaním zkracuje dobu usínání.', level: 'established' },
      {
        text: 'Zmírňuje subjektivní příznaky jet lagu (od 0,5 mg před spaním v cílové časové zóně).',
        level: 'established',
      },
      { text: 'Ve srovnání s placebem usnete v průměru jen asi o 7 minut dřív.', level: 'established' },
    ],
    dose: '0,5–1 mg obvykle stačí. Vyšší dávky nefungují lépe, jen častěji způsobují ranní ospalost.',
    timing:
      'Na jet lag a posunutý rytmus 1–2 hodiny před plánovaným spánkem; podle tvrzení EU 1 mg krátce před spaním.',
    forWhom:
      'Cestování přes časová pásma, práce na směny, „noční sovy“ s posunutým rytmem. Na chronickou nespavost je účinnější kognitivně-behaviorální terapie.',
    caution: [
      'Děti, těhotné a kojící ženy jen po domluvě s lékařem.',
      'Může se ovlivňovat s léky na ředění krve, s léky na epilepsii a s léky na imunitu.',
      'Obsah melatoninu v doplňcích se ve studiích často lišil od údaje na obalu.',
    ],
    euClaim:
      'Melatonin přispívá ke zkrácení doby potřebné k usnutí (1 mg krátce před spaním) a ke zmírnění subjektivního pocitu pásmové nemoci (jet lag).',
    regulation:
      'V Česku se prodává jako doplněk stravy, v některých zemích EU (např. Dánsko, Švédsko) jen jako lék.',
    sources: [S.ferracioli, S.nccihMelatonin, SRC.euRegister],
  },
  {
    id: 'ashwagandha',
    slug: 'ashwagandha',
    name: 'Ashwagandha',
    aka: 'Withania somnifera',
    goal: 'stres',
    verdict: 'Slibné malé studie, ale přibývá otázek kolem bezpečnosti. Ne pro každého a ne dlouhodobě.',
    what: 'Bylina z ajurvédy, prodávaná jako „adaptogen“ na stres a spánek. Doplňky obsahují výtažky z kořene, někdy i z listů.',
    effects: [
      {
        text: 'V menších, často výrobci financovaných studiích snížila pocit stresu a ranní kortizol.',
        level: 'preliminary',
      },
      {
        text: 'Možný mírný přínos pro spánek a sílu při tréninku — důkazy jsou slabé.',
        level: 'preliminary',
      },
    ],
    dose: 'Ve studiích obvykle 240–600 mg standardizovaného extraktu z kořene denně po dobu 6–12 týdnů.',
    timing: 'Studie trvaly nejvýš několik měsíců — dlouhodobá bezpečnost není známá.',
    forWhom: 'Spíš nikdo jako první volba. Začněte spánkem, pohybem a zvládáním stresu.',
    caution: [
      'Jsou popsané případy poškození jater — při bolesti břicha, tmavé moči nebo zežloutnutí ji hned vysaďte a jděte k lékaři.',
      'Nevhodná v těhotenství a při kojení.',
      'Může zvyšovat hladinu hormonů štítné žlázy a zesilovat účinek léků na spaní a na štítnou žlázu.',
      'Opatrnost při autoimunitních onemocněních.',
    ],
    regulation:
      'Dánsko ji v roce 2023 v doplňcích stravy zakázalo kvůli nejasné bezpečnosti. Na úrovni EU se její bezpečnost dál posuzuje.',
    myths: [
      {
        myth: 'Je přírodní, tak je bezpečná.',
        fact: 'Přírodní neznamená bezpečné — u ashwagandhy jsou popsané vážné případy poškození jater.',
      },
    ],
    sources: [S.lopresti, S.philips, S.odsAshwa],
  },
  {
    id: 'collagen',
    slug: 'kolagen',
    name: 'Kolagen',
    aka: 'hydrolyzovaný kolagen, kolagenní peptidy',
    goal: 'telo',
    verdict: 'Malý efekt na pleť je možný, ale studie jsou často placené výrobci. Klouby: důkazy slabé.',
    what: 'Bílkovina pojivových tkání. Ze stravy se rozloží na aminokyseliny a krátké peptidy — do kůže se „neposílá“ hotový kolagen. Tělo si ho vyrábí samo; potřebuje k tomu dost bílkovin a vitamín C.',
    effects: [
      {
        text: '2,5–10 g denně po 8–12 týdnů v řadě studií mírně zlepšilo hydrataci a pružnost kůže.',
        level: 'preliminary',
      },
      {
        text: 'Vitamín C přispívá k normální tvorbě kolagenu pro funkci kůže, kostí a chrupavek (tvrzení EU pro vitamín C, ne pro kolagen).',
        level: 'established',
      },
    ],
    dose: '2,5–10 g denně.',
    timing: 'Kdykoli, efekt se ve studiích hodnotil po 2–3 měsících.',
    forWhom:
      'Kdo to chce zkusit pro pleť. Pro klouby a svaly mají větší smysl celkově dostatek bílkovin a trénink.',
    caution: [
      'Bezpečný, ale je to drahý zdroj bílkovin — neobsahuje všechny esenciální aminokyseliny.',
      'Na pleť má prokazatelně největší vliv ochrana před sluncem (SPF) a nekouření.',
    ],
    sources: [S.miranda, SRC.euRegister],
  },
  {
    id: 'beta-alanine',
    slug: 'beta-alanin',
    name: 'Beta-alanin',
    goal: 'vykon',
    verdict:
      'Funguje na úsilí trvající zhruba 1–4 minuty. Na sílu ani vytrvalost delší než pár minut nepomáhá.',
    what: 'Aminokyselina, ze které si sval tvoří karnosin — ten tlumí kyselost, která ve svalu vzniká při intenzivní práci („pálení“).',
    effects: [
      {
        text: 'Po 2–4 týdnech užívání zlepšuje výkon při intenzivní zátěži trvající přibližně 1–4 minuty.',
        level: 'plausible',
      },
    ],
    dose: '4–6 g denně, rozdělených do menších dávek (kolem 1,6 g), alespoň 2–4 týdny.',
    timing: 'Na načasování nezáleží — funguje až po nasycení svalů, ne jednorázově.',
    forWhom: 'Veslování, plavání na střední tratě, bojové sporty, CrossFit.',
    caution: [
      'Častým vedlejším účinkem je neškodné brnění kůže (parestezie) — menší dávky nebo tablety s postupným uvolňováním ho zmírní.',
    ],
    sources: [S.trexler],
  },
  {
    id: 'glycine',
    slug: 'glycin',
    name: 'Glycin',
    goal: 'spanek',
    verdict: 'Levný a bezpečný pokus pro lepší spánek, ale důkazy jsou jen z malých studií.',
    what: 'Nejjednodušší aminokyselina. Tělo si ji vyrábí samo a je hojná v kolagenu a vývarech.',
    effects: [
      {
        text: '3 g před spaním v malých studiích zlepšily subjektivní kvalitu spánku a pocit svěžesti ráno po zkráceném spánku.',
        level: 'preliminary',
      },
    ],
    dose: '3 g.',
    timing: 'Asi hodinu před spaním.',
    forWhom: 'Kdo má základy spánku v pořádku a chce bezpečně experimentovat.',
    caution: [
      'Obecně dobře snášený; dlouhodobá data a údaje pro těhotenství chybí.',
      'Užíváte-li léky na psychiku, poraďte se s lékařem.',
    ],
    sources: [S.bannai],
  },
  {
    id: 'rhodiola',
    slug: 'rhodiola',
    name: 'Rhodiola',
    aka: 'rozchodnice růžová',
    goal: 'stres',
    verdict: 'Tradiční bylina na únavu ze stresu. Moderní důkazy jsou malé a nejednoznačné.',
    what: 'Bylina ze studených oblastí Evropy a Asie. Evropská léková agentura uznává její tradiční použití k dočasné úlevě od příznaků stresu, jako je únava a vyčerpání — na základě dlouhodobého používání, ne silných studií.',
    effects: [
      { text: 'V malých studiích mírně snížila pocit úzkosti, stresu a únavy.', level: 'preliminary' },
    ],
    dose: 'Ve studiích obvykle 200–600 mg standardizovaného extraktu denně.',
    timing: 'Ráno nebo dopoledne — u některých lidí večer zhoršuje spánek.',
    forWhom: 'Krátkodobě při náročném období, pokud chcete něco zkusit.',
    caution: [
      'Nevhodná v těhotenství, při kojení a u dětí (chybí údaje).',
      'S antidepresivy a dalšími léky na psychiku jen po domluvě s lékařem.',
    ],
    sources: [S.cropley, S.emaRhodiola],
  },
  {
    id: 'lions-mane',
    slug: 'koralovec-jezaty',
    name: 'Korálovec ježatý',
    aka: 'lion’s mane, Hericium erinaceus',
    goal: 'soustredeni',
    verdict:
      'Populární „nootropikum“ ze sociálních sítí. Data jsou hlavně ze zvířat a z několika malých studií.',
    what: 'Jedlá houba, ze které se dělají extrakty. Obsahuje látky, které v laboratoři a u zvířat podporují růst nervových buněk.',
    effects: [
      {
        text: 'V jedné malé studii (31 lidí, 12 týdnů) o něco zlepšila výsledky v kognitivních testech.',
        level: 'preliminary',
      },
    ],
    dose: 'Bez spolehlivého doporučení — ve studiích se dávky a typy extraktů výrazně liší.',
    timing: 'Studie trvaly týdny až měsíce.',
    forWhom:
      'Spíš pro zvědavé. Na soustředění mají mnohem větší a jistější vliv spánek, pohyb a méně vyrušování.',
    caution: [
      'Kvalita a složení extraktů se mezi výrobci velmi liší.',
      'Lidé s alergií na houby by se jí měli vyhnout.',
    ],
    sources: [S.saitsu],
  },
]

export const COMPOUND_BY_SLUG: Record<string, Compound> = Object.fromEntries(
  COMPOUNDS.map((c) => [c.slug, c]),
)
