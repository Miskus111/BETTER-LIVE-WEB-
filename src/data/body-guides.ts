import type { Evidence, Source } from './types'
import { SRC } from './sources'

/**
 * „Jak funguje tělo“ — krátké, srozumitelné průvodce pro dnešní svět (obrazovky, kofein, sezení, stres).
 * Každé doporučení má úroveň důkazů; PubMed odkazy ověřeny přes NCBI E-utilities 16. 11. 2026.
 */
export interface BodyGuide {
  slug: string
  title: string
  /** krátký nadpis pro karty a menu */
  short: string
  icon:
    | 'moon'
    | 'zap'
    | 'activity'
    | 'brain'
    | 'dumbbell'
    | 'footprints'
    | 'sprout'
    | 'droplet'
    | 'wine'
    | 'shield'
    | 'eye'
    | 'sun'
    | 'heart'
    | 'graduation'
    | 'scale'
    | 'candy'
    | 'package'
    | 'cloud'
    | 'bone'
    | 'ear'
    | 'flame'
    | 'flower'
    | 'smile'
    | 'tooth'
    | 'skeleton'
    | 'wind'
    | 'apple'
    | 'clock'
    | 'leaf'
    | 'sparkles'
    | 'storm'
    | 'timer'
    | 'users'
    | 'move'
    | 'mars'
    | 'venus'
    | 'hourglass'
    | 'test-tube'
  /** jedna věta pod nadpisem */
  hook: string
  tldr: string[]
  numbers: { value: string; label: string }[]
  how: { title: string; text: string }[]
  today: string[]
  helps: { text: string; level: Evidence }[]
  myths: { myth: string; fact: string }[]
  related: { label: string; href: string }[]
  sources: Source[]
}

const pm = (id: number, title: string): Source => ({ title, url: `https://pubmed.ncbi.nlm.nih.gov/${id}/` })

const SOURCES = {
  sleepConsensus: pm(
    26235159,
    'Watson a kol. (2015) Doporučená délka spánku pro dospělé — konsenzus AASM a SRS, J Clin Sleep Med',
  ),
  chang: pm(
    25535358,
    'Chang a kol. (2015) Čtení na svítící obrazovce večer zhoršuje spánek a cirkadiánní rytmus, PNAS',
  ),
  drake: pm(24235903, 'Drake a kol. (2013) Kofein 0, 3 a 6 hodin před spaním, J Clin Sleep Med'),
  efsaCaffeine: {
    title: 'EFSA (2015) Bezpečnost kofeinu, EFSA Journal 13(5):4102',
    url: 'https://doi.org/10.2903/j.efsa.2015.4102',
  },
  mcewen: pm(9428819, 'McEwen (1998) Ochranné a škodlivé účinky stresových mediátorů, N Engl J Med'),
  adrenal: pm(
    27557747,
    'Cadegiani a Kater (2016) „Adrenální únava“ neexistuje — systematický přehled, BMC Endocr Disord',
  ),
  schultz: pm(27069377, 'Schultz (2016) Dopamin a chyba v předpovědi odměny, Dialogues Clin Neurosci'),
  orben: pm(
    30944443,
    'Orben a Przybylski (2019) Pohoda dospívajících a digitální technologie, Nat Hum Behav',
  ),
  morton: pm(
    28698222,
    'Morton a kol. (2018) Bílkoviny a nárůst svalů při silovém tréninku — metaanalýza, Br J Sports Med',
  ),
  who: {
    title: 'WHO (2020) Doporučení pro pohybovou aktivitu a sedavé chování',
    url: 'https://www.who.int/publications/i/item/9789240015128',
  },
  paluch: pm(
    35247352,
    'Paluch a kol. (2022) Počet kroků za den a úmrtnost — metaanalýza 15 kohort, Lancet Public Health',
  ),
  ekelund: pm(27475271, 'Ekelund a kol. (2016) Vyváží pohyb škody ze sezení? Metaanalýza, Lancet'),
  americanGut: pm(
    29795809,
    'McDonald a kol. (2018) American Gut: víc druhů rostlin týdně a pestřejší mikrobiom, mSystems',
  ),
  dethlefsen: pm(
    20847294,
    'Dethlefsen a Relman (2011) Neúplné zotavení střevních bakterií po antibiotikách, PNAS',
  ),
  killer: pm(24416202, 'Killer a kol. (2014) Káva v běžném množství neodvodňuje — zkřížená studie, PLoS One'),
  dunstan: pm(
    22374636,
    'Dunstan a kol. (2012) Přerušování sezení snižuje cukr a inzulin po jídle, Diabetes Care',
  ),
  saintMaurice: pm(32207799, 'Saint-Maurice a kol. (2020) Počet kroků, jejich tempo a úmrtnost, JAMA'),
  costaBack: pm(
    22586331,
    'da C Menezes Costa a kol. (2012) Průběh akutní a dlouhodobé bolesti zad — metaanalýza, CMAJ',
  ),
  sherrington: pm(30703272, 'Sherrington a kol. (2019) Cvičení jako prevence pádů u starších lidí, Cochrane'),
  leboff: pm(
    35939577,
    'LeBoff a kol. (2022) Vitamín D a zlomeniny u zdravých lidí středního a vyššího věku (VITAL), N Engl J Med',
  ),
  chungMyopia: pm(
    12445849,
    'Chung a kol. (2002) Slabší brýle krátkozrakost nezpomalí, ale zrychlí, Vision Res',
  ),
  lancetDementia: pm(39096926, 'Livingston a kol. (2024) Prevence demence — zpráva komise časopisu Lancet'),
  acsm: pm(
    21694556,
    'Garber a kol. (2011) ACSM: kolik a jak cvičit — doporučení pro dospělé, Med Sci Sports Exerc',
  ),
  ssass: pm(
    34459569,
    'Neal a kol. (2021) Náhrada soli s draslíkem a srdečně-cévní příhody (SSaSS), N Engl J Med',
  ),
  poweredBrush: pm(24934383, 'Yaacob a kol. (2014) Elektrický vs. ruční zubní kartáček, Cochrane'),
  perioDiabetes: pm(35420698, 'Simpson a kol. (2022) Léčba zánětu dásní a cukr v krvi u diabetu, Cochrane'),
  paperBag: pm(
    2499228,
    'Callaham (1989) Rizika dýchání do papírového sáčku při hyperventilaci, Ann Emerg Med',
  ),
  cohenTies: pm(9200634, 'Cohen a kol. (1997) Sociální vazby a náchylnost k nachlazení, JAMA'),
  buijze: pm(
    27631616,
    'Buijze a kol. (2016) Studená sprcha, nemocnost a absence v práci — randomizovaná studie, PLoS One',
  ),
  vareniclineCochrane: pm(
    37142273,
    'Livingstone-Banks a kol. (2023) Vareniklin a cytisin při odvykání kouření, Cochrane',
  ),
  aubin: pm(22782848, 'Aubin a kol. (2012) Kolik kuřáci přiberou po skončení — metaanalýza, BMJ'),
  pooleCoffee: pm(29167102, 'Poole a kol. (2017) Káva a zdraví — zastřešující přehled metaanalýz, BMJ'),
  harmanT: pm(
    11158037,
    'Harman a kol. (2001) Jak se mění testosteron s věkem — dlouhodobá studie BLSA, J Clin Endocrinol Metab',
  ),
  weakTies: pm(
    24769739,
    'Sandstrom a Dunn (2014) Síla slabých vazeb: i krátké rozhovory zlepšují den, Pers Soc Psychol Bull',
  ),
  stothart: pm(
    26121498,
    'Stothart a kol. (2015) I jen přijatá notifikace naruší pozornost, J Exp Psychol Hum Percept Perform',
  ),
  erickson: pm(21282661, 'Erickson a kol. (2011) Rok chůze zvětšil hipokampus a zlepšil paměť, PNAS'),
  whoUvIndex: {
    title: 'WHO: UV index — kdy se chránit před sluncem',
    url: 'https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index',
  },
  whoEndometriosis: {
    title: 'WHO: Endometrióza — fakta',
    url: 'https://www.who.int/news-room/fact-sheets/detail/endometriosis',
  },
  momma: pm(
    35228201,
    'Momma a kol. (2022) Posilování a nižší riziko nemocí i úmrtí — metaanalýza, Br J Sports Med',
  ),
  leap: pm(
    25705822,
    'Du Toit a kol. (2015) Časné zavádění arašídů a alergie u rizikových kojenců (LEAP), N Engl J Med',
  ),
  cocAcne: pm(22786490, 'Arowojolu a kol. (2012) Kombinovaná antikoncepce při akné, Cochrane'),
  modiPosture: pm(
    30346317,
    'Modi a kol. (2019) Stolička pod nohy na toaletě: méně tlačení a kratší čas, J Clin Gastroenterol',
  ),
  hunterNature: pm(
    31019479,
    'Hunter a kol. (2019) Pobyt v přírodě ve městě a kortizol ve slinách, Front Psychol',
  ),
  jamieson: pm(
    21942377,
    'Jamieson a kol. (2012) Vnímat stresové vzrušení jako pomoc zlepšuje reakci srdce i výkon, J Exp Psychol Gen',
  ),
  volpi: pm(15192443, 'Volpi a kol. (2004) Jak se mění svalová tkáň s věkem, Curr Opin Clin Nutr Metab Care'),
  fiatarone: pm(2342214, 'Fiatarone a kol. (1990) Silový trénink u devadesátníků, JAMA'),
  cuijpersBA: pm(
    17184887,
    'Cuijpers a kol. (2007) Behaviorální aktivace při depresi — metaanalýza, Clin Psychol Rev',
  ),
  sumithran: pm(
    22029981,
    'Sumithran a kol. (2011) Hormony hladu zůstávají změněné i rok po zhubnutí, N Engl J Med',
  ),
  step1: pm(
    33567185,
    'Wilding a kol. (2021) Semaglutid jednou týdně při nadváze a obezitě (STEP 1), N Engl J Med',
  ),
  step1Ext: pm(
    35441470,
    'Wilding a kol. (2022) Návrat váhy po vysazení semaglutidu (STEP 1 — pokračování), Diabetes Obes Metab',
  ),
  herxheimer: pm(12076414, 'Herxheimer a Petrie (2002) Melatonin proti jet lagu, Cochrane'),
  wrightCamping: pm(23910656, 'Wright a kol. (2013) Týden pod stanem posunul vnitřní hodiny dřív, Curr Biol'),
  bahji: pm(
    32271390,
    'Bahji a kol. (2020) Jak často se objeví abstinenční příznaky po konopí — metaanalýza, JAMA Netw Open',
  ),
  varkey: pm(
    21890526,
    'Varkey a kol. (2011) Cvičení jako prevence migrény ve srovnání s relaxací a topiramátem, Cephalalgia',
  ),
  avisVms: pm(
    25686030,
    'Avis a kol. (2015) Jak dlouho trvají návaly horka v přechodu — studie SWAN, JAMA Intern Med',
  ),
  nams2022: pm(35797481, 'The Menopause Society (2022) Stanovisko k hormonální terapii, Menopause'),
  nams2023: pm(37252752, 'The Menopause Society (2023) Stanovisko k nehormonální léčbě návalů, Menopause'),
  ayersCbt: pm(
    22336748,
    'Ayers a kol. (2012) Kognitivně-behaviorální terapie na návaly a noční pocení (MENOS 2), Menopause',
  ),
  liLifestyle: pm(29712712, 'Li a kol. (2018) Pět zdravých návyků a délka života v USA, Circulation'),
  mandsager: pm(
    30646252,
    'Mandsager a kol. (2018) Kondice na běžeckém pásu a dlouhodobá úmrtnost (122 000 lidí), JAMA Netw Open',
  ),
  gripStrength: pm(29739772, 'Celis-Morales a kol. (2018) Síla stisku ruky a úmrtnost — UK Biobank, BMJ'),
  rubyHeritability: pm(
    30401766,
    'Ruby a kol. (2018) Dědičnost délky života je výrazně nadhodnocená, Genetics',
  ),
  ozardaRi: pm(26981015, 'Ozarda (2016) Referenční rozmezí: jak vznikají a jak je číst, Biochem Med'),
  nordestgaard: pm(
    27122601,
    'Nordestgaard a kol. (2016) Na vyšetření cholesterolu není nutné chodit nalačno — konsenzus EAS a EFLM, Eur Heart J',
  ),
  whoFerritin: {
    title: 'WHO (2020) Feritin a hodnocení zásob železa — doporučení',
    url: 'https://www.who.int/publications/i/item/9789240000124',
  },
  whoHba1c: {
    title: 'WHO (2011) HbA1c v diagnostice cukrovky',
    url: 'https://www.who.int/publications/i/item/use-of-glycated-haemoglobin-(-hba1c)-in-diagnosis-of-diabetes-mellitus',
  },
  reynolds: pm(30638909, 'Reynolds a kol. (2019) Kvalita sacharidů a zdraví — série metaanalýz, Lancet'),
  wastyk: pm(34256014, 'Wastyk a kol. (2021) Strava cílená na mikrobiom a imunita, Cell'),
  efsaWater: {
    title: 'EFSA (2010) Referenční hodnoty příjmu vody, EFSA Journal 8(3):1459',
    url: 'https://doi.org/10.2903/j.efsa.2010.1459',
  },
  acsmFluid: pm(17277604, 'ACSM (2007) Stanovisko: cvičení a doplňování tekutin, Med Sci Sports Exerc'),
  popkin: pm(20646222, 'Popkin a kol. (2010) Voda, hydratace a zdraví, Nutr Rev'),
  gbd: pm(30146330, 'GBD 2016 Alcohol Collaborators (2018) Alkohol a zátěž nemocemi ve 195 zemích, Lancet'),
  ebrahim: pm(23347102, 'Ebrahim a kol. (2013) Alkohol a spánek, Alcohol Clin Exp Res'),
  whoAlcohol: {
    title: 'WHO Evropa (2023) Žádná míra pití alkoholu není pro zdraví bezpečná',
    url: 'https://www.who.int/europe/news/item/04-01-2023-no-level-of-alcohol-consumption-is-safe-for-our-health',
  },
  prather: pm(26118561, 'Prather a kol. (2015) Délka spánku a náchylnost k nachlazení, Sleep'),
  nieman: pm(31193280, 'Nieman a Wentz (2019) Pohybová aktivita a obranyschopnost těla, J Sport Health Sci'),
  martineau: pm(28202713, 'Martineau a kol. (2017) Vitamín D a prevence akutních respiračních infekcí, BMJ'),
  hemila: pm(23440782, 'Hemilä a Chalker (2013) Vitamín C na prevenci a léčbu nachlazení, Cochrane'),
  he: pm(26372583, 'He a kol. (2015) Čas venku ve škole a vznik krátkozrakosti u dětí, JAMA'),
  holden: pm(
    26875007,
    'Holden a kol. (2016) Celosvětový výskyt krátkozrakosti a výhled do roku 2050, Ophthalmology',
  ),
  sheppard: pm(29963645, 'Sheppard a Wolffsohn (2018) Digitální únava očí, BMJ Open Ophthalmol'),
  singh: pm(37593770, 'Singh a kol. (2023) Brýle filtrující modré světlo, Cochrane'),
  hughes: pm(
    23732711,
    'Hughes a kol. (2013) Opalovací krém a stárnutí pleti — randomizovaná studie, Ann Intern Med',
  ),
  green: pm(
    21135266,
    'Green a kol. (2011) Méně melanomů po pravidelném používání opalovacího krému, J Clin Oncol',
  ),
  iarc: pm(19655431, 'El Ghissassi a kol. (2009) Karcinogeny pro člověka — záření (IARC), Lancet Oncol'),
  whoHypertension: {
    title: 'WHO — Vysoký krevní tlak (přehled)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/hypertension',
  },
  whoSodium: {
    title: 'WHO — Snížení příjmu soli (sodíku)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/sodium-reduction',
  },
  cepeda: pm(16719566, 'Cepeda a kol. (2006) Rozložené opakování a zapamatování — metaanalýza, Psychol Bull'),
  roediger: pm(
    16507066,
    'Roediger a Karpicke (2006) Testování zlepšuje dlouhodobé zapamatování, Psychol Sci',
  ),
  walker: pm(15450165, 'Walker a Stickgold (2004) Spánek, učení a upevňování paměti, Neuron'),
  ophir: pm(
    19706386,
    'Ophir a kol. (2009) Kognitivní kontrola u lidí, kteří často dělají více věcí najednou, PNAS',
  ),
  pashler: pm(26162104, 'Pashler a kol. (2008) Učební styly: pojmy a důkazy, Psychol Sci Public Interest'),
  levine: pm(9880251, 'Levine a kol. (1999) Pohyb mimo cvičení (NEAT) a odolnost proti přibírání, Science'),
  pontzer: pm(34385400, 'Pontzer a kol. (2021) Denní energetický výdej během života, Science'),
  hallEnergy: pm(21872751, 'Hall a kol. (2011) Jak energetická nerovnováha mění tělesnou hmotnost, Lancet'),
  dpp: pm(
    11832527,
    'Diabetes Prevention Program (2002) Snížení výskytu cukrovky 2. typu změnou životního stylu, N Engl J Med',
  ),
  glucotypes: pm(
    30040822,
    'Hall a kol. (2018) Glukotypy — vzorce kolísání glukózy u lidí bez cukrovky, PLoS Biol',
  ),
  wolraich: pm(7474248, 'Wolraich a kol. (1995) Cukr a chování dětí — metaanalýza, JAMA'),
  whoSugar: {
    title: 'WHO (2015) Doporučení pro příjem cukrů u dospělých a dětí',
    url: 'https://www.who.int/publications/i/item/9789241549028',
  },
  hallUpf: pm(
    31105044,
    'Hall a kol. (2019) Ultrazpracovaná strava vede k vyššímu příjmu energie — randomizovaná studie, Cell Metab',
  ),
  lane: pm(
    38418082,
    'Lane a kol. (2024) Ultrazpracované potraviny a zdraví — zastřešující přehled metaanalýz, BMJ',
  ),
  whoTobacco: {
    title: 'WHO — Tabák (přehled)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/tobacco',
  },
  lindson: pm(38189560, 'Lindson a kol. (2024) Elektronické cigarety k odvykání kouření, Cochrane'),
  hartvigsen: pm(
    29573870,
    'Hartvigsen a kol. (2018) Co je bolest dolní části zad a proč jí věnovat pozornost, Lancet',
  ),
  foster: pm(29573872, 'Foster a kol. (2018) Prevence a léčba bolesti dolní části zad, Lancet'),
  slater: pm(31366294, 'Slater a kol. (2019) „Seď rovně!“ — čas to přehodnotit, J Orthop Sports Phys Ther'),
  whoBack: {
    title: 'WHO — Bolest dolní části zad (přehled)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/low-back-pain',
  },
  dillard: pm(
    36379592,
    'Dillard a kol. (2022) Nebezpečné poslouchání u dospívajících a mladých dospělých, BMJ Glob Health',
  ),
  escHypertension: pm(
    39210715,
    'McEvoy a kol. (2024) Doporučení ESC pro léčbu zvýšeného tlaku a hypertenze, Eur Heart J',
  ),
  escLipids: pm(31504418, 'Mach a kol. (2020) Doporučení ESC/EAS pro léčbu dyslipidemií, Eur Heart J'),
  ferenceLdl: pm(
    28444290,
    'Ference a kol. (2017) LDL způsobují aterosklerotická onemocnění — konsenzus EAS, Eur Heart J',
  ),
  cttStatins: pm(
    21067804,
    'Cholesterol Treatment Trialists (2010) Snižování LDL — metaanalýza 26 studií se 170 000 lidmi, Lancet',
  ),
  hooperSatFat: pm(32428300, 'Hooper a kol. (2020) Méně nasycených tuků a nemoci srdce, Cochrane'),
  eggs: pm(
    32132002,
    'Drouin-Chartier a kol. (2020) Vejce a riziko nemocí srdce — kohorty a metaanalýza, BMJ',
  ),
  blackFord: pm(
    29996755,
    'Black a Ford (2018) Chronická zácpa u dospělých: výskyt, příčiny a léčba, Med J Aust',
  ),
  schootFoods: pm(
    37905980,
    'van der Schoot a kol. (2024) Potraviny a nápoje u chronické zácpy — metaanalýza, Aliment Pharmacol Ther',
  ),
  bdaConstipation: pm(
    41081513,
    'Britská dietologická asociace (2025) Doporučení pro stravu u chronické zácpy, J Hum Nutr Diet',
  ),
  roenneberg2004: pm(
    15620633,
    'Roenneberg a kol. (2004) Ukazatel konce dospívání — chronotyp podle věku, Curr Biol',
  ),
  wittmann: pm(
    16687322,
    'Wittmann a kol. (2006) Sociální jet lag: nesoulad biologického a společenského času, Chronobiol Int',
  ),
  roenneberg2012: pm(22578422, 'Roenneberg a kol. (2012) Sociální jet lag a obezita, Curr Biol'),
  kalmbach: pm(28364486, 'Kalmbach a kol. (2017) Genetický základ chronotypu, Sleep'),
  iarcShift: pm(31281097, 'IARC (2019) Karcinogenita noční práce na směny, Lancet Oncol'),
  acsmProgression: pm(
    19204579,
    'ACSM (2009) Stanovisko: modely progrese v silovém tréninku, Med Sci Sports Exerc',
  ),
  schoenfeldFreq: pm(
    27102172,
    'Schoenfeld a kol. (2016) Frekvence posilování a růst svalů — metaanalýza, Sports Med',
  ),
  schoenfeldVolume: pm(
    27433992,
    'Schoenfeld a kol. (2017) Týdenní objem tréninku a nárůst svalů — metaanalýza, J Sports Sci',
  ),
  bousquetAr: pm(33273461, 'Bousquet a kol. (2020) Alergická rýma — přehled, Nat Rev Dis Primers'),
  ariaGuideline: pm(
    28602936,
    'Brożek a kol. (2017) Doporučení ARIA pro léčbu alergické rýmy, J Allergy Clin Immunol',
  ),
  honeyRct: pm(
    11868925,
    'Rajan a kol. (2002) Med a příznaky senné rýmy — randomizovaná studie, Ann Allergy Asthma Immunol',
  ),
  volkowCannabis: pm(24897085, 'Volkow a kol. (2014) Nepříznivé zdravotní účinky marihuany, N Engl J Med'),
  diFortiPsychosis: pm(
    30902669,
    'Di Forti a kol. (2019) Užívání konopí a výskyt psychóz v Evropě (EU-GEI), Lancet Psychiatry',
  ),
  efsaProtein: {
    title: 'EFSA (2012) Referenční hodnoty příjmu bílkovin, EFSA Journal 10(2):2557',
    url: 'https://doi.org/10.2903/j.efsa.2012.2557',
  },
  whoSafeListening: {
    title: 'WHO — Bezpečný poslech: otázky a odpovědi',
    url: 'https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening',
  },
  whoHearing: {
    title: 'WHO — Hluchota a ztráta sluchu (přehled)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss',
  },
  laukkanen: pm(25705824, 'Laukkanen a kol. (2015) Sauna a úmrtnost na srdeční choroby, JAMA Intern Med'),
  roberts: pm(26174323, 'Roberts a kol. (2015) Ledová lázeň po tréninku tlumí nárůst svalů, J Physiol'),
  esperland: pm(
    36137565,
    'Esperland a kol. (2022) Zdravotní účinky dobrovolného pobytu ve studené vodě, Int J Circumpolar Health',
  ),
  mcnulty: pm(
    32661839,
    'McNulty a kol. (2020) Fáze menstruačního cyklu a sportovní výkon — metaanalýza, Sports Med',
  ),
  whoAnaemia: {
    title: 'WHO — Anémie (přehled)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/anaemia',
  },
  whoMental: {
    title: 'WHO — Duševní poruchy (přehled)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/mental-disorders',
  },
  noetel: pm(38355154, 'Noetel a kol. (2024) Cvičení u deprese — síťová metaanalýza, BMJ'),
  singhPA: pm(
    36796860,
    'Singh a kol. (2023) Pohyb u deprese, úzkosti a stresu — přehled přehledů, Br J Sports Med',
  ),
  walshFluoride: pm(30829399, 'Walsh a kol. (2019) Fluoridové zubní pasty a prevence zubního kazu, Cochrane'),
  worthington: pm(30968949, 'Worthington a kol. (2019) Čištění mezizubních prostor doma, Cochrane'),
  whoOral: {
    title: 'WHO — Zdraví ústní dutiny (přehled)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health',
  },
  weaver: pm(
    26856587,
    'Weaver a kol. (2016) Vrchol kostní hmoty a životní styl — systematický přehled, Osteoporos Int',
  ),
  watson: pm(
    28975661,
    'Watson a kol. (2018) Intenzivní silový a dopadový trénink zlepšuje hustotu kostí (LIFTMOR), J Bone Miner Res',
  ),
  benjafield: pm(
    31300334,
    'Benjafield a kol. (2019) Celosvětový výskyt obstrukční spánkové apnoe, Lancet Respir Med',
  ),
  zaccaro: pm(
    30245619,
    'Zaccaro a kol. (2018) Pomalé dýchání a jeho účinky — systematický přehled, Front Hum Neurosci',
  ),
  rhee: pm(40397877, 'Rhee a kol. (2025) Přelepování úst na spaní — systematický přehled, PLoS One'),
  reynoldsAcne: pm(38300170, 'Reynolds a kol. (2024) Doporučení pro léčbu akné, J Am Acad Dermatol'),
  juhlDairy: pm(
    30096883,
    'Juhl a kol. (2018) Mléčné výrobky a akné — systematický přehled a metaanalýza, Nutrients',
  ),
  smithGL: pm(
    17616769,
    'Smith a kol. (2007) Strava s nízkou glykemickou náloží u akné — RCT, Am J Clin Nutr',
  ),
  tanAcne: pm(25597339, 'Tan a Bhate (2015) Celosvětová epidemiologie akné, Br J Dermatol'),
  whoHeadache: {
    title: 'WHO — Poruchy s bolestí hlavy (přehled)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/headache-disorders',
  },
  ashinaMigraine: pm(33773613, 'Ashina a kol. (2021) Migréna: epidemiologie a péče, Lancet'),
  ashinaMOH: pm(36732518, 'Ashina a kol. (2023) Bolest hlavy z nadužívání léků, Nat Rev Dis Primers'),
  loweTRE: pm(
    32986097,
    'Lowe a kol. (2020) Jídlo v časovém okně 16:8 a hubnutí — RCT TREAT, JAMA Intern Med',
  ),
  liuTRE: pm(
    35443107,
    'Liu a kol. (2022) Omezení kalorií s časovým oknem i bez něj — roční RCT, N Engl J Med',
  ),
  decabo: pm(
    31881139,
    'de Cabo a Mattson (2019) Přerušovaný půst, zdraví a stárnutí — přehled, N Engl J Med',
  ),
  holtLunstad: pm(20668659, 'Holt-Lunstad a kol. (2010) Vztahy a riziko úmrtí — metaanalýza, PLoS Med'),
  holtLunstad24: pm(
    39279411,
    'Holt-Lunstad (2024) Sociální propojení jako faktor duševního i fyzického zdraví, World Psychiatry',
  ),
  whoSocial: {
    title: 'WHO (2025) — Komise pro sociální propojení: osamělost a zdraví',
    url: 'https://www.who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death',
  },
  herbertStretch: pm(21735398, 'Herbert a kol. (2011) Protahování a svalová bolest po cvičení, Cochrane'),
  lauersen: pm(
    24100287,
    'Lauersen a kol. (2014) Cvičení jako prevence sportovních zranění — metaanalýza, Br J Sports Med',
  ),
  behm: pm(
    26642915,
    'Behm a kol. (2016) Akutní účinky protahování na výkon a rozsah pohybu, Appl Physiol Nutr Metab',
  ),
  warneke: pm(
    40513717,
    'Warneke a kol. (2025) Praktická doporučení k protahování — Delphi konsenzus expertů, J Sport Health Sci',
  ),
  leproult: pm(21632481, 'Leproult a Van Cauter (2011) Týden zkráceného spánku a testosteron, JAMA'),
  coronaWeight: pm(
    23482592,
    'Corona a kol. (2013) Hubnutí a nízký testosteron u obezity — metaanalýza, Eur J Endocrinol',
  ),
  clemesha: pm(
    31385468,
    'Clemesha a kol. (2020) „Testosteronové boostery“: složení a tvrzení bez opory ve výzkumu, World J Mens Health',
  ),
  bhasin: pm(
    29562364,
    'Bhasin a kol. (2018) Léčba testosteronem u hypogonadismu — doporučení Endocrine Society',
  ),
  reedSoy: pm(
    33383165,
    'Reed a kol. (2021) Sója a izoflavony neovlivňují mužské hormony — metaanalýza, Reprod Toxicol',
  ),
  sievert: pm(30700403, 'Sievert a kol. (2019) Snídaně, hmotnost a příjem energie — metaanalýza RCT, BMJ'),
}

export const BODY_GUIDES: BodyGuide[] = [
  {
    slug: 'spanek',
    title: 'Spánek: noční servis těla',
    short: 'Spánek',
    icon: 'moon',
    hook: 'Proč usínáte s mobilem v ruce, budíte se rozbití a co s tím reálně funguje.',
    tldr: [
      'Dospělí potřebují pravidelně 7 a více hodin spánku.',
      'Spánek řídí dva systémy: tlak spánku (adenosin) a vnitřní hodiny (světlo a tma).',
      'Nejsilnější páky jsou pravidelný čas, ranní světlo, tma večer a kofein ne odpoledne.',
    ],
    numbers: [
      { value: '7+ h', label: 'doporučený spánek dospělých' },
      { value: '~90 min', label: 'jeden spánkový cyklus' },
      { value: '4–6', label: 'cyklů za noc' },
    ],
    how: [
      {
        title: 'Tlak spánku',
        text: 'Celý den v mozku přibývá adenosin — vedlejší produkt práce buněk. Čím déle jste vzhůru, tím víc ho je a tím víc se vám chce spát. Spánek ho „vyčistí“.',
      },
      {
        title: 'Vnitřní hodiny',
        text: 'Malé centrum v mozku nastavuje 24hodinový rytmus podle světla. Večer, když se setmí, tělo začne vyrábět melatonin — signál, že je noc. Světlo, hlavně jasné, jeho tvorbu tlumí.',
      },
      {
        title: 'Spánkové fáze',
        text: 'Noc se skládá z cyklů po zhruba 90 minutách. Hluboký spánek převažuje v první polovině noci (obnova těla), REM spánek se sny ve druhé (paměť, emoce). Když zkrátíte spánek ráno, přicházíte hlavně o REM.',
      },
    ],
    today: [
      'Mobil v posteli: jasná obrazovka večer posouvá vnitřní hodiny a hlavně udržuje mozek v pohotovosti — scrollování nemá „konec“.',
      'Dospívající mají vnitřní hodiny přirozeně posunuté později — škola od osmi jde proti jejich biologii.',
      'Kofein v energetických nápojích odpoledne a alkohol večer: s alkoholem usnete rychleji, ale druhá polovina noci je mělčí a s méně REM spánku.',
    ],
    helps: [
      { text: 'Vstávat i chodit spát každý den zhruba ve stejnou dobu, i o víkendu.', level: 'established' },
      {
        text: 'Denní světlo ráno (venku i při zatažené obloze je mnohem jasněji než uvnitř).',
        level: 'established',
      },
      {
        text: 'Poslední kofein nejméně 6 hodin před spaním, ideálně ještě dřív — citlivější lidé klidně 8 hodin.',
        level: 'established',
      },
      { text: 'Tlumené světlo a méně obrazovek hodinu před spaním; mobil mimo postel.', level: 'plausible' },
      { text: 'Chladnější, tmavá a tichá ložnice.', level: 'plausible' },
      {
        text: 'Při dlouhodobé nespavosti: kognitivně-behaviorální terapie nespavosti (KBT-I) — doporučovaná léčba první volby, dlouhodobě účinnější než prášky na spaní.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Spánek doženu o víkendu.',
        fact: 'Částečně ano, ale nepravidelný rytmus („sociální jet lag“) sám o sobě zhoršuje únavu i soustředění.',
      },
      {
        myth: 'Noční režim na mobilu problém vyřeší.',
        fact: 'Teplejší barvy pomohou jen málo. Větší roli hraje jas, délka používání a to, co na obrazovce děláte.',
      },
      {
        myth: 'Stačí mi 5 hodin.',
        fact: 'Krátký spánek bez následků zvládne jen velmi malý zlomek lidí. Většina si únavu jen přestane uvědomovat.',
      },
    ],
    related: [
      { label: 'Melatonin — co opravdu umí', href: '/doplnky/melatonin' },
      { label: 'Glycin na spánek', href: '/doplnky/glycin' },
      { label: 'Hořčík', href: '/doplnky/horcik' },
    ],
    sources: [SOURCES.sleepConsensus, SOURCES.chang, SOURCES.drake],
  },
  {
    slug: 'energie-a-kofein',
    title: 'Energie a kofein: proč přijde odpolední krize',
    short: 'Energie a kofein',
    icon: 'zap',
    hook: 'Co se v mozku děje po kávě a energeťáku — a proč vás „vypne“, když účinek odezní.',
    tldr: [
      'Kofein únavu neodstraní, jen zablokuje signál únavy (adenosin).',
      'Zdraví dospělí bezpečně do 400 mg denně a do 200 mg najednou; těhotné a kojící ženy do 200 mg denně.',
      'Účinek v těle přetrvává hodiny — odpolední kofein zhoršuje spánek, i když usnete.',
    ],
    numbers: [
      { value: '400 mg', label: 'bezpečně za den (dospělí)' },
      { value: '~4–5 h', label: 'průměrný poločas kofeinu (u někoho 2–8 h)' },
      { value: '~80 mg', label: 'energetický nápoj 250 ml' },
    ],
    how: [
      {
        title: 'Adenosin a únava',
        text: 'Adenosin se během dne hromadí a navazuje na receptory, které tlumí aktivitu mozku. Kofein se na stejné receptory „posadí“ a zablokuje je.',
      },
      {
        title: 'Proč přijde propad',
        text: 'Adenosin mezitím dál přibývá. Když se kofein odbourá, naráz se uplatní — a přijde únava. Navíc má člověk po obědě přirozený mírný útlum daný vnitřními hodinami.',
      },
      {
        title: 'Tolerance',
        text: 'Při každodenním pití si tělo zvykne a část efektu zmizí. Po náhlém vysazení může pár dní bolet hlava a být horší nálada.',
      },
      {
        title: 'Proč to každý snáší jinak',
        text: 'Kofein odbourávají játra a rychlost dané geny. Kouření odbourávání zrychlí; těhotenství a hormonální antikoncepce ho výrazně zpomalí — kofein pak v těle vydrží mnohem déle.',
      },
    ],
    today: [
      'Energetické nápoje, předtréninkovky a „kofeinové“ žvýkačky se snadno sčítají — 400 mg je rychle pryč.',
      'Káva místo snídaně a spánku vytváří kruh: málo spánku → víc kofeinu → horší spánek.',
    ],
    helps: [
      {
        text: 'Poslední kofein nejméně 6 hodin před spaním, ideálně ještě dřív — citlivější lidé klidně 8 hodin.',
        level: 'established',
      },
      { text: 'Na výkon stačí 3 mg na kg tělesné hmotnosti zhruba hodinu předem.', level: 'established' },
      {
        text: 'Na odpolední útlum: krátká procházka venku nebo 10–20 minut spánku místo další kávy.',
        level: 'plausible',
      },
      { text: 'Kombinace kofeinu s L-theaninem může zmírnit nervozitu.', level: 'preliminary' },
    ],
    myths: [
      {
        myth: 'Energeťák je horší než káva.',
        fact: 'Kofeinu má plechovka podobně jako slabší káva. Problém bývá cukr a to, že se jich vypije víc.',
      },
      { myth: 'Káva dehydratuje.', fact: 'V běžném množství se do pitného režimu započítává.' },
      {
        myth: 'Káva škodí srdci.',
        fact: 'U zdravých dospělých souvisí 3–4 šálky denně spíš s nižším rizikem srdečních nemocí i úmrtí. Výjimkou je těhotenství — tam méně.',
      },
    ],
    related: [
      { label: 'Kofein — dávky a bezpečnost', href: '/doplnky/kofein' },
      { label: 'L-theanin', href: '/doplnky/l-theanin' },
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
    ],
    sources: [SOURCES.efsaCaffeine, SOURCES.drake, SOURCES.pooleCoffee],
  },
  {
    slug: 'stres',
    title: 'Stres a kortizol: alarm, který se zapomněl vypnout',
    short: 'Stres',
    icon: 'activity',
    hook: 'Stres vás má zachránit před nebezpečím. Problém je, když běží pořád — kvůli mailům, škole a notifikacím.',
    tldr: [
      'Krátkodobý stres je užitečný: zrychlí srdce, zaostří pozornost, dodá energii.',
      'Potíže dělá stres, který se nikdy nevypne — horší spánek, nálada i tlak.',
      'Nejlépe ověřené „antistresy“ jsou spánek, pohyb a lidé kolem vás.',
    ],
    numbers: [
      { value: 'sekundy', label: 'nástup adrenalinu' },
      { value: 'minuty', label: 'nástup kortizolu' },
      { value: '150 min', label: 'pohybu týdně podle WHO' },
    ],
    how: [
      {
        title: 'Rychlý alarm',
        text: 'Při ohrožení nadledviny během sekund uvolní adrenalin: srdce bije rychleji, svaly dostanou víc krve a energie. Tělo je připravené „bojovat nebo utéct“.',
      },
      {
        title: 'Pomalejší kortizol',
        text: 'Během minut stoupne kortizol. Uvolní energii z cukrů a tuků a tlumí to, co v ohrožení počká (trávení, imunita). Po odeznění hrozby se má vrátit zpět.',
      },
      {
        title: 'Když alarm neutichne',
        text: 'Stresová reakce se spouští podobně u medvěda jako u e-mailu od šéfa. Když stres běží dlouhodobě, tělo platí „opotřebením“: horší spánek, podrážděnost, vyšší tlak a chuť na sladké.',
      },
      {
        title: 'Jak stres čtete, hraje roli',
        text: 'Bušící srdce před zkouškou můžete brát jako „panikařím“, nebo „tělo se chystá na výkon“. Lidé, kterým výzkumníci vysvětlili druhý pohled, měli příznivější reakci srdce a cév a lepší výsledky v testu.',
      },
    ],
    today: [
      'Stálá dostupnost: notifikace a zprávy znamenají, že se stresová reakce spouští i ve volném čase.',
      'Málo spánku zvyšuje citlivost na stres — a stres zhoršuje spánek.',
      'Málo pohybu: tělo je připravené k akci, ale žádná nepřijde.',
    ],
    helps: [
      {
        text: 'Pravidelný pohyb — zlepšuje náladu a snižuje příznaky úzkosti a deprese.',
        level: 'established',
      },
      { text: 'Dostatek pravidelného spánku.', level: 'established' },
      { text: 'Blízké vztahy a mluvit o tom, co vás tíží.', level: 'plausible' },
      { text: 'Pomalé dýchání (delší výdech než nádech) pár minut denně.', level: 'preliminary' },
      {
        text: '20–30 minut v parku nebo přírodě — ve studii kortizol klesal nejvíc právě při této délce.',
        level: 'preliminary',
      },
      {
        text: 'Při dlouhodobých potížích: psycholog nebo psychoterapeut — to není selhání, ale účinná léčba.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Kortizol je „špatný hormon“.',
        fact: 'Bez kortizolu nepřežijete. Škodí jen dlouhodobě zvýšená stresová zátěž.',
      },
      {
        myth: 'Mám „adrenální únavu“.',
        fact: 'Tato diagnóza vědecky neexistuje. Únava má skutečné příčiny — spánek, štítná žláza, chudokrevnost, deprese — a ty stojí za vyšetření.',
      },
      {
        myth: 'Adaptogeny stres vyřeší.',
        fact: 'Důkazy jsou slabé a u ashwagandhy jsou i bezpečnostní otázky. Základy fungují víc.',
      },
    ],
    related: [
      { label: 'Ashwagandha — rizika', href: '/doplnky/ashwagandha' },
      { label: 'Rhodiola', href: '/doplnky/rhodiola' },
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
    ],
    sources: [SOURCES.mcewen, SOURCES.adrenal, SOURCES.who, SOURCES.jamieson, SOURCES.hunterNature],
  },
  {
    slug: 'dopamin-a-mobil',
    title: 'Dopamin a mobil: co se doopravdy děje v mozku',
    short: 'Dopamin a mobil',
    icon: 'brain',
    hook: 'Dopamin není „hormon štěstí“ a „dopaminový detox“ nefunguje tak, jak se píše. Co tedy ano?',
    tldr: [
      'Dopamin hlavně učí mozek, co stojí za to opakovat — reaguje na překvapivou odměnu.',
      'Aplikace s nekonečným scrollem a nepředvídatelnými odměnami toho využívají.',
      'Výzkum dopadů mobilů je smíšený; prakticky pomáhá omezit spouštěče, ne „vypustit dopamin“.',
    ],
    numbers: [{ value: '1 pípnutí', label: 'stačí k narušení pozornosti, i když mobil nevezmete' }],
    how: [
      {
        title: 'Chyba v předpovědi',
        text: 'Dopaminové neurony nejvíc reagují, když je odměna lepší, než mozek čekal. Tak se učíme, co dělat znovu. Když odměnu čekáme jistě, reakce slábne.',
      },
      {
        title: 'Chtít, ne užívat si',
        text: 'Dopamin víc souvisí s motivací a „chtěním“ než se samotným potěšením. Proto můžete hodinu scrollovat, i když vás to nebaví.',
      },
      {
        title: 'Nepředvídatelná odměna',
        text: 'Když nevíte, jestli další příspěvek bude dobrý, mozek zkouší znovu a znovu — stejný princip jako u automatů.',
      },
      {
        title: 'Cena přerušení',
        text: 'V experimentu lidem zhoršila výkon v úkolu na pozornost už samotná notifikace — i když na mobil nesáhli. Mysl odběhne k tomu, co tam asi je.',
      },
    ],
    today: [
      'Feedy jsou navržené tak, aby nikdy neskončily, a notifikace přerušují soustředění.',
      'Velké studie ukazují mezi časem na obrazovce a pohodou dospívajících spíš malé souvislosti — záleží víc na tom, co děláte a co tím nahrazujete (spánek, pohyb, lidi).',
    ],
    helps: [
      { text: 'Vypnout nepodstatné notifikace a mít mobil při práci z dohledu.', level: 'plausible' },
      {
        text: 'Mobil mimo ložnici — chrání spánek, který ovlivňuje náladu i soustředění.',
        level: 'plausible',
      },
      { text: 'Nahradit, ne jen zakázat: pohyb, sport, setkání s lidmi.', level: 'plausible' },
      {
        text: 'Vědomě si určit, kdy a na co aplikace používáte (časové limity, šedobílý displej).',
        level: 'preliminary',
      },
    ],
    myths: [
      {
        myth: 'Dopamin = štěstí.',
        fact: 'Dopamin je hlavně o motivaci a učení. Spokojenost má mnohem víc zdrojů.',
      },
      {
        myth: 'Dopaminový detox „resetuje“ mozek.',
        fact: 'Dopamin neodstraníte a ani byste nechtěli. Pauza od spouštěčů ale může pomoci změnit návyky.',
      },
      {
        myth: 'Mobil zaručeně ničí mozek.',
        fact: 'Tak silné závěry data nepodporují. Problém je hlavně to, co mobil vytlačí — spánek a pohyb.',
      },
    ],
    related: [
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
      { label: 'Stres', href: '/jak-funguje-telo/stres' },
    ],
    sources: [SOURCES.schultz, SOURCES.orben, SOURCES.stothart],
  },
  {
    slug: 'svaly-a-metabolismus',
    title: 'Svaly a metabolismus: proč se vyplatí zvedat činky',
    short: 'Svaly',
    icon: 'dumbbell',
    hook: 'Sval není jen pro vzhled. Je to orgán, který ovlivňuje cukr v krvi, kosti i to, jak budete zvládat stáří.',
    tldr: [
      'Svaly rostou, když je postupně zatěžujete víc, než jsou zvyklé, a máte dost bílkovin.',
      'WHO doporučuje silový trénink aspoň 2× týdně pro všechny dospělé.',
      'Na bílkoviny většině lidí stačí zhruba 1,6 g na kg denně; nad tuto hranici je další přínos pro svaly už malý (pro jistotu se uvádí až 2,2 g/kg).',
    ],
    numbers: [
      { value: '2×', label: 'silový trénink týdně (WHO)' },
      { value: '~1,6 g/kg', label: 'bílkovin denně na růst svalů' },
      { value: '3–8 %', label: 'svalové hmoty ubude za každé desetiletí po třicítce' },
    ],
    how: [
      {
        title: 'Podnět a obnova',
        text: 'Trénink sval zatíží a dá mu signál k adaptaci. Růst probíhá až během odpočinku — s dostatkem bílkovin a spánku.',
      },
      {
        title: 'Postupné přetížení',
        text: 'Sval se přizpůsobí tomu, co zná. Aby rostl dál, potřebuje časem víc váhy, opakování nebo sérií.',
      },
      {
        title: 'Sval a metabolismus',
        text: 'Svaly jsou největší „spotřebič“ cukru v těle a zlepšují citlivost na inzulin. Kalorií ale v klidu spálí méně, než se často tvrdí — hlavní přínos je zdraví, ne „spalování“.',
      },
      {
        title: 'Svaly jako důchodové spoření',
        text: 'Od třicítky svalů pomalu ubývá, zhruba o 3–8 % za desetiletí, a ve stáří to zrychluje. Úbytek svalů a síly (sarkopenie) stojí za pády a ztrátou soběstačnosti. Čím víc jich máte předem, tím déle vydrží.',
      },
    ],
    today: [
      'Sedavá práce a studium: bez zátěže svaly i kosti s věkem ubývají rychleji.',
      'Sociální sítě ukazují extrémy — přitom pro zdraví stačí 2–3 tréninky týdně.',
    ],
    helps: [
      { text: 'Silový trénink celého těla aspoň 2× týdně.', level: 'established' },
      { text: 'Bílkoviny rozložené do jídel během dne, celkem kolem 1,6 g na kg.', level: 'established' },
      { text: 'Kreatin 3–5 g denně zrychlí nárůst síly.', level: 'established' },
      { text: 'Dost spánku — bez něj je regenerace horší.', level: 'plausible' },
      {
        text: 'Začít se dá v jakémkoli věku: lidé ve věku 86–96 let za 8 týdnů posilování víc než zdvojnásobili sílu.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Ženy z činek „narostou“.',
        fact: 'Velký objem svalů vyžaduje roky cíleného tréninku a jídla. Běžný trénink přinese pevnost a sílu.',
      },
      {
        myth: 'Svaly se po vysazení změní v tuk.',
        fact: 'Sval a tuk jsou různé tkáně. Sval může ubýt a tuk přibýt, ale jedno se nemění v druhé.',
      },
      {
        myth: 'Bílkoviny se musí sníst do 30 minut po tréninku.',
        fact: 'Důležitější je celkové množství za den. „Anabolické okno“ je mnohem širší.',
      },
    ],
    related: [
      { label: 'Kreatin', href: '/doplnky/kreatin' },
      { label: 'Bílkoviny', href: '/doplnky/bilkoviny' },
      { label: 'Zapisovat trénink v aplikaci', href: '/login?mode=signup' },
    ],
    sources: [SOURCES.morton, SOURCES.who, SOURCES.efsaProtein, SOURCES.volpi, SOURCES.fiatarone],
  },
  {
    slug: 'pohyb-a-sezeni',
    title: 'Sezení a pohyb: kolik kroků je doopravdy dost',
    short: 'Pohyb a sezení',
    icon: 'footprints',
    hook: '10 000 kroků vymyslel marketing. Co říkají data — a jak vyvážit celý den u počítače?',
    tldr: [
      'WHO: 150–300 minut středně intenzivního pohybu týdně + 2× posilování.',
      'Přínos kroků roste zhruba do 8–10 tisíc denně u lidí pod 60 let a do 6–8 tisíc u starších.',
      'Hodina svižného pohybu denně podle dat výrazně tlumí rizika dlouhého sezení.',
    ],
    numbers: [
      { value: '150–300', label: 'minut pohybu týdně' },
      { value: '8–10 tis.', label: 'kroků, kde se přínos vyrovnává (pod 60 let)' },
      { value: '60–75 min', label: 'svižného pohybu denně tlumí rizika sezení' },
    ],
    how: [
      {
        title: 'Pohyb jako lék',
        text: 'Pravidelný pohyb snižuje riziko srdečních chorob, cukrovky 2. typu, některých nádorů i deprese. Funguje přes srdce, cévy, svaly i mozek.',
      },
      {
        title: 'Co dělá sezení',
        text: 'Při dlouhém sezení svaly „spí“ — hůř zpracovávají cukr a tuky z krve. Nejde jen o kalorie, ale o to, jak dlouho tělo neprochází žádnou zátěží.',
      },
      {
        title: 'Malé přestávky, měřitelný efekt',
        text: 'U lidí s nadváhou stačily 2 minuty chůze každých 20 minut sezení, aby cukr a inzulin po jídle klesly zhruba o čtvrtinu. Pracující sval si cukr z krve bere sám.',
      },
    ],
    today: [
      'Práce a škola u obrazovky znamená klidně 10 a více hodin sezení denně.',
      'Doprava autem, MHD a rozvoz jídla vymazaly přirozený pohyb během dne.',
    ],
    helps: [
      {
        text: 'Splnit doporučení WHO: 150–300 minut svižné chůze, kola nebo sportu týdně.',
        level: 'established',
      },
      {
        text: 'Při hodně sezení se hýbat víc — u lidí s 60–75 minutami svižného pohybu denně už dlouhé sezení nebylo spojené s vyšším rizikem úmrtí.',
        level: 'plausible',
      },
      { text: 'Krátké přestávky v sezení (každých 30–60 minut se projít).', level: 'plausible' },
      { text: 'Chůze i po menších dávkách: každý pohyb se počítá.', level: 'established' },
    ],
    myths: [
      {
        myth: 'Musím mít 10 000 kroků, jinak to nemá smysl.',
        fact: 'Přínos roste už od nižších počtů. Každých pár tisíc kroků navíc pomáhá.',
      },
      {
        myth: 'Počítá se jen rychlá chůze.',
        fact: 'Ve velké americké studii záleželo hlavně na celkovém počtu kroků. Svižné tempo je bonus, ne podmínka.',
      },
      {
        myth: 'Stojací stůl vyřeší sezení.',
        fact: 'Samotné stání není pohyb. Pomáhá hlavně ho střídat a chodit.',
      },
    ],
    related: [
      { label: 'Kroky si můžete zapisovat v aplikaci', href: '/login?mode=signup' },
      { label: 'Svaly a metabolismus', href: '/jak-funguje-telo/svaly-a-metabolismus' },
    ],
    sources: [SOURCES.who, SOURCES.paluch, SOURCES.ekelund, SOURCES.dunstan, SOURCES.saintMaurice],
  },
  {
    slug: 'streva-a-mikrobiom',
    title: 'Střeva a mikrobiom: biliony spolubydlících',
    short: 'Střeva',
    icon: 'sprout',
    hook: 'Ve střevech žijí biliony bakterií. Živí se tím, co jíte — a hlavně vlákninou.',
    tldr: [
      'Bakterie ve střevech rozkládají vlákninu na látky, které vyživují střevní stěnu.',
      'Vyšší příjem vlákniny (25–29 g denně a víc) souvisí s nižším rizikem řady nemocí.',
      'Fermentované potraviny v jedné studii zvýšily rozmanitost mikrobiomu a snížily zánětlivé markery.',
    ],
    numbers: [
      { value: '25 g', label: 'vlákniny denně (EFSA, minimum)' },
      { value: '25–29 g', label: 'kde studie vidí největší přínos' },
      { value: '30+', label: 'druhů rostlin týdně — spojeno s pestřejším mikrobiomem' },
    ],
    how: [
      {
        title: 'Co bakterie dělají',
        text: 'Vlákninu, kterou sami nestrávíme, rozkládají na mastné kyseliny s krátkým řetězcem. Ty vyživují buňky střeva a ovlivňují imunitu.',
      },
      {
        title: 'Rozmanitost',
        text: 'Pestřejší strava (víc druhů rostlin) obvykle znamená pestřejší mikrobiom. Antibiotika a velmi jednotvárná strava ho dočasně ochudí.',
      },
      {
        title: 'Střevní bariéra',
        text: 'Střevo od zbytku těla odděluje jediná vrstva buněk krytá hlenem. Hlídá ji velká část imunitního systému — proto se střeva a imunita tolik ovlivňují.',
      },
      {
        title: 'Střevo a mozek',
        text: 'Střeva s mozkem „mluví“ přes bloudivý nerv, hormony a látky od bakterií. Většina důkazů je zatím ze zvířat; u lidí se to teprve zkoumá.',
      },
    ],
    today: [
      'Ultrazpracované potraviny často obsahují málo vlákniny — většina lidí jí sní méně, než by měla.',
      'Trh s probiotiky a „detoxy“ slibuje víc, než data dovolují.',
      'Po antibiotikách se mikrobiom většinou z velké části zotaví během týdnů, ale ne vždy úplně.',
    ],
    helps: [
      {
        text: 'Víc vlákniny: luštěniny, celozrnné obiloviny, zelenina, ovoce, ořechy.',
        level: 'established',
      },
      {
        text: 'Pravidelně fermentované potraviny (kysané zelí, kefír, jogurt, kimči).',
        level: 'preliminary',
      },
      { text: 'Vlákninu přidávat postupně a pít — jinak nadýmání.', level: 'plausible' },
      {
        text: 'Střídat rostliny: lidé, kteří jich za týden snědí 30 a víc druhů (počítají se i bylinky, ořechy a semínka), mají pestřejší mikrobiom.',
        level: 'preliminary',
      },
      { text: 'Antibiotika jen tehdy, když je předepíše lékař — ne „pro jistotu“.', level: 'established' },
    ],
    myths: [
      {
        myth: 'Detoxikační čaje čistí střeva.',
        fact: 'Většinou jen projímají. Detox zvládají játra a ledviny.',
      },
      {
        myth: 'Probiotika pomůžou každému.',
        fact: 'Účinek závisí na konkrétním kmeni a potížích. Pro zdravé lidi bez potíží je přínos nejistý.',
      },
      {
        myth: 'Test mikrobiomu ze stolice mi řekne, co přesně jíst.',
        fact: 'Zatím ne. Nikdo neumí přesně říct, jak vypadá „zdravý mikrobiom“, a osobní doporučení z těchto testů nejsou ověřená.',
      },
    ],
    related: [
      { label: 'Vláknina', href: '/doplnky/vlaknina' },
      { label: 'Probiotika a fermentované potraviny', href: '/doplnky/probiotika' },
      { label: 'Střeva v mapě těla', href: '/organ/intestines' },
    ],
    sources: [SOURCES.reynolds, SOURCES.wastyk, SOURCES.americanGut, SOURCES.dethlefsen],
  },
  {
    slug: 'pitny-rezim',
    title: 'Pitný režim: kolik vody doopravdy',
    short: 'Pitný režim',
    icon: 'droplet',
    hook: 'Osm sklenic denně je mýtus. Kolik vody potřebujete a proč se počítá i jídlo a káva.',
    tldr: [
      'EFSA: ženy asi 2,0 l a muži asi 2,5 l vody denně celkem — včetně vody z jídla.',
      'Zhruba pětinu vody přijímáme v jídle.',
      'U zdravých lidí je žízeň spolehlivý ukazatel; víc pít je potřeba při sportu a v horku.',
    ],
    numbers: [
      { value: '2,0 l', label: 'ženy, celkem za den' },
      { value: '2,5 l', label: 'muži, celkem za den' },
      { value: '~20 %', label: 'vody z jídla' },
    ],
    how: [
      {
        title: 'Rovnováha',
        text: 'Ledviny průběžně řídí, kolik vody tělo zadrží. Když vody chybí, moč je tmavší a dostaví se žízeň.',
      },
      {
        title: 'Dehydratace a výkon',
        text: 'Už mírný nedostatek tekutin může zhoršit soustředění a fyzický výkon, hlavně v horku.',
      },
      {
        title: 'Kudy voda odchází',
        text: 'Nejvíc močí, část dechem a kůží. Při sportu v horku se dá vypotit i přes litr za hodinu — a s potem odchází i sůl.',
      },
    ],
    today: [
      'Sladké nápoje a energeťáky jsou zdrojem vody, ale i zbytečného cukru.',
      'Klimatizace, sport v posilovně a horká léta zvyšují potřebu.',
      'Ve stáří slábne pocit žízně, takže starší lidé snáz pijí málo, aniž si toho všimnou.',
    ],
    helps: [
      { text: 'Pít při žízni a mít vodu po ruce; barva moči by měla být světle žlutá.', level: 'plausible' },
      { text: 'Při sportu delším než hodinu a v horku doplňovat i sůl (sodík).', level: 'plausible' },
      { text: 'Voda, neslazené čaje a káva v rozumném množství se počítají.', level: 'established' },
      {
        text: 'Starší lidé: pít během dne pravidelně, i bez žízně — sklenice ke každému jídlu.',
        level: 'plausible',
      },
    ],
    myths: [
      {
        myth: 'Musím vypít 8 sklenic čisté vody.',
        fact: 'Nemusíte — počítá se i jídlo, polévky, čaj a káva.',
      },
      {
        myth: 'Čím víc vody, tím líp.',
        fact: 'Extrémní množství naopak může být nebezpečné (nízká hladina sodíku).',
      },
      {
        myth: 'Káva odvodňuje.',
        fact: 'V běžném množství (3–4 šálky denně) hydratuje podobně jako voda. Močopudně působí spíš velké dávky u lidí, kteří kávu nepijí.',
      },
    ],
    related: [{ label: 'Kofein', href: '/doplnky/kofein' }],
    sources: [SOURCES.efsaWater, SOURCES.popkin, SOURCES.acsmFluid, SOURCES.killer],
  },
  {
    slug: 'alkohol',
    title: 'Alkohol: co se v těle děje po pár pivech',
    short: 'Alkohol',
    icon: 'wine',
    hook: 'Proč po večírku spíte hůř, odkud je kocovina a proč „sklenka vína denně“ už jako rada neplatí.',
    tldr: [
      'Podle WHO neexistuje míra pití, která by byla pro zdraví bezpečná — méně je lépe.',
      'Alkohol pomáhá usnout, ale zhoršuje druhou polovinu noci a ubírá REM spánek.',
      'Játra ho odbourávají tempem, které nezrychlíte — káva ani sprcha nepomohou.',
    ],
    numbers: [
      { value: '0', label: 'bezpečná míra podle WHO' },
      { value: '7+', label: 'druhů rakoviny spojených s alkoholem' },
      { value: '10 g', label: 'alkoholu = 1 standardní drink (~0,3 l piva, 1 dl vína)' },
    ],
    how: [
      {
        title: 'Cesta alkoholu',
        text: 'Alkohol se vstřebá hlavně v tenkém střevě; v krvi je už za pár minut a nejvyšší hladiny dosáhne zhruba za 30–90 minut. Většinu zpracují játra — nejdřív na acetaldehyd, který je jedovatý a karcinogenní, a pak na neškodný acetát.',
      },
      {
        title: 'Mozek',
        text: 'Alkohol tlumí nervovou soustavu: nejdřív uvolní zábrany, ve vyšších dávkách zpomalí reakce, rovnováhu a úsudek. Proto řídit nelze ani po „jednom“.',
      },
      {
        title: 'Kocovina',
        text: 'Je to kombinace špatného spánku, ztráty tekutin, podráždění žaludku a zánětlivé reakce. Spolehlivý lék neexistuje — jen čas.',
      },
      {
        title: 'Proč stejné pivo neudělá s každým totéž',
        text: 'Alkohol se rozloží ve vodě v těle. Menší lidé a ženy, které mají v těle méně vody, mají po stejném množství vyšší hladinu. Na lačno stoupne rychleji a výš.',
      },
    ],
    today: [
      'Pití je pro mnoho lidí součástí každého víkendu; nárazové velké množství („binge“) je pro tělo nejhorší kombinace.',
      'Starší studie o „zdravé sklence vína“ porovnávaly pijáky s abstinenty, mezi kterými byli i nemocní — moderní analýzy ochranný efekt nepotvrzují.',
    ],
    helps: [
      { text: 'Pít méně a mít v týdnu dny úplně bez alkoholu.', level: 'established' },
      { text: 'Nikdy neřídit po pití — ani po malém množství.', level: 'established' },
      {
        text: 'Najíst se předem a mezi drinky pít vodu — zpomalí vstřebávání a pomůže s tekutinami.',
        level: 'plausible',
      },
      { text: 'Poslední drink pár hodin před spaním, aby měl spánek šanci.', level: 'plausible' },
      {
        text: 'Počítat drinky, ne sklenice: půllitr dvanáctky jsou zhruba dva standardní drinky, panák tvrdého jeden.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Sklenka vína denně je zdravá.',
        fact: 'Podle současných analýz nejmenší riziko pro zdraví znamená nepít vůbec.',
      },
      {
        myth: 'Káva mě vystřízliví.',
        fact: 'Budete bdělejší, ale stejně opilí. Hladinu alkoholu snižuje jen čas.',
      },
      {
        myth: 'Po alkoholu se dobře spí.',
        fact: 'Usnete rychleji, ale ve druhé polovině noci se spánek rozpadá — častěji se budíte a máte méně REM fáze.',
      },
      {
        myth: 'Kocovinu spraví ranní pivo.',
        fact: 'Jen oddálí příznaky a přidá další alkohol. Pití „na spravení“ je navíc jedno z varovných znamení vznikající závislosti.',
      },
    ],
    related: [
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
      { label: 'Játra v mapě těla', href: '/organ/liver' },
    ],
    sources: [SOURCES.whoAlcohol, SOURCES.gbd, SOURCES.ebrahim],
  },
  {
    slug: 'imunita',
    title: 'Imunita: jak se tělo brání a co ji opravdu „posílí“',
    short: 'Imunita',
    icon: 'shield',
    hook: 'Na „booster imunity“ v tabletce věřit nemusíte. Na spánek a pohyb ano.',
    tldr: [
      'Imunita má dvě vrstvy: rychlou obecnou obranu a pomalejší, cílenou, která si pamatuje.',
      'Ve studii, kde dobrovolníci dostali do nosu virus nachlazení, onemocněli ti, kdo spali méně než 6 hodin, výrazně častěji než ti, kdo spali přes 7 hodin.',
      'Vitamín C nachlazení u běžných lidí nezabrání; vitamín D pomáhá hlavně těm, kdo ho mají málo.',
    ],
    numbers: [
      { value: '~4×', label: 'vyšší šance nachlazení při spánku pod 6 h (v experimentu)' },
      { value: '<6 h', label: 'hranice, kde riziko roste' },
    ],
    how: [
      {
        title: 'Vrozená imunita',
        text: 'První linie: kůže, sliznice, horečka a buňky, které „sežerou“ cokoli podezřelého. Reaguje během minut až hodin, ale nerozlišuje přesně.',
      },
      {
        title: 'Získaná imunita',
        text: 'Lymfocyty se naučí poznat konkrétního vetřelce a vytvoří protilátky. Trvá to dny, ale tělo si to pamatuje — na tom stojí očkování.',
      },
      {
        title: 'Horečka a únava',
        text: 'Nejsou chyba, ale součást obrany. Tělo šetří energii pro boj s infekcí.',
      },
      {
        title: 'Víc není líp',
        text: 'Imunita má být přesná, ne co nejsilnější. Když reaguje přehnaně nebo na nesprávný cíl, vznikají alergie a autoimunitní nemoci. Proto „nabuzení“ imunity nedává smysl.',
      },
    ],
    today: [
      'Málo spánku a chronický stres oslabují obranyschopnost.',
      'Trh s „boostery imunity“ slibuje víc, než dokáže doložit — silná imunita navíc neznamená „víc“, ale „vyváženě“.',
    ],
    helps: [
      { text: 'Spát 7 a více hodin.', level: 'established' },
      { text: 'Očkování podle doporučení.', level: 'established' },
      { text: 'Mytí rukou, hlavně před jídlem a po cestě MHD.', level: 'established' },
      { text: 'Pravidelný středně intenzivní pohyb.', level: 'plausible' },
      { text: 'Vitamín D v zimě, hlavně pokud ho máte málo.', level: 'plausible' },
      {
        text: 'Udržovat vztahy: lidé s pestřejší sítí kontaktů (rodina, přátelé, práce, spolky) se ve studii nachladili zhruba 4× méně často.',
        level: 'preliminary',
      },
      { text: 'Nekouřit — kouř oslabuje obranu dýchacích cest.', level: 'established' },
    ],
    myths: [
      {
        myth: 'Vitamín C mě ochrání před nachlazením.',
        fact: 'U běžné populace ne. Pravidelné užívání může nemoc o trochu zkrátit.',
      },
      {
        myth: 'Nachladil jsem se, protože mi byla zima.',
        fact: 'Nachlazení způsobují viry. V zimě se jen víc šíří, protože jsme víc uvnitř.',
      },
      {
        myth: 'Na chřipku pomůžou antibiotika.',
        fact: 'Antibiotika na viry nefungují — zbytečné užívání zvyšuje odolnost bakterií.',
      },
      {
        myth: 'Studená sprcha mě ochrání před nemocí.',
        fact: 'V randomizované studii se 3 000 lidmi počet dní nemoci neklesl. Lidé ale méně často zůstávali doma z práce — cítili se líp.',
      },
    ],
    related: [
      { label: 'Vitamín D', href: '/doplnky/vitamin-d' },
      { label: 'Vitamín C', href: '/doplnky/vitamin-c' },
      { label: 'Zinek', href: '/doplnky/zinek' },
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
    ],
    sources: [
      SOURCES.prather,
      SOURCES.nieman,
      SOURCES.martineau,
      SOURCES.hemila,
      SOURCES.cohenTies,
      SOURCES.buijze,
    ],
  },
  {
    slug: 'oci-a-obrazovky',
    title: 'Oči a obrazovky: proč přibývá krátkozrakých',
    short: 'Oči a obrazovky',
    icon: 'eye',
    hook: 'Do roku 2050 může být krátkozraká polovina lidí na světě. Na vině není jen mobil — chybí denní světlo.',
    tldr: [
      'Krátkozrakost celosvětově rychle přibývá; odhad pro rok 2050 je zhruba polovina populace.',
      'Čas venku chrání dětské oči před rozvojem krátkozrakosti.',
      'Unavené oči od obrazovky jsou hlavně z méně častého mrkání a dlouhého zaostření na blízko — brýle proti modrému světlu podle přehledu Cochrane nejspíš nepomáhají.',
    ],
    numbers: [
      { value: '~50 %', label: 'krátkozrakých lidí v roce 2050 (odhad)' },
      { value: '20-20-20', label: 'pravidlo pauz pro oči' },
      { value: '40 min', label: 'venku navíc denně snížilo nové případy u dětí (studie z Číny)' },
    ],
    how: [
      {
        title: 'Zaostřování',
        text: 'Při pohledu na blízko se v oku stahuje sval, který mění tvar čočky. Hodiny u mobilu znamenají hodiny bez uvolnění.',
      },
      {
        title: 'Krátkozrakost',
        text: 'Oční bulva se během dětství a dospívání prodlouží víc, než má. Denní světlo venku tento růst pravděpodobně brzdí — proto pomáhá čas venku, ne jen méně obrazovek.',
      },
      {
        title: 'Mrkání',
        text: 'Při soustředění na obrazovku mrkáme výrazně méně. Oko osychá, pálí a únava přichází rychleji.',
      },
      {
        title: 'Proč na tom záleží',
        text: 'Nejde jen o brýle. Vysoká krátkozrakost zvyšuje riziko odchlípení sítnice, glaukomu a dalších nemocí oka v dospělosti — proto se vyplatí ji u dětí brzdit.',
      },
    ],
    today: [
      'Děti tráví víc času uvnitř a na blízko než kdykoli dřív.',
      'Celý den přes obrazovky — práce, škola i odpočinek — znamená bez přestávky zaostřené oči.',
    ],
    helps: [
      { text: 'Pro děti víc času venku na denním světle každý den.', level: 'established' },
      {
        text: 'Pravidlo 20-20-20: každých 20 minut se 20 sekund dívat do dálky (aspoň 6 m).',
        level: 'plausible',
      },
      { text: 'Vědomě mrkat, obrazovku mít kousek pod úrovní očí a nepřesvítit ji.', level: 'plausible' },
      { text: 'Pravidelná kontrola zraku u dětí i dospělých.', level: 'established' },
      {
        text: 'U dětí, kterým se krátkozrakost rychle zhoršuje, se zeptat očního lékaře na brzdění (speciální brýlové čočky, kapky).',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Brýle proti modrému světlu chrání oči.',
        fact: 'Přehled Cochrane nenašel přínos pro únavu očí; vliv na spánek je nejistý.',
      },
      {
        myth: 'Obrazovky poškozují sítnici.',
        fact: 'Není důkaz, že by běžné obrazovky poškozovaly sítnici. Unavují hlavně zaostřování a mrkání.',
      },
      {
        myth: 'Slabší brýle šetří oči, aby si „nezvykly“.',
        fact: 'Naopak — v klinické studii se krátkozrakost se slabšími brýlemi zhoršovala rychleji. Brýle mají odpovídat předpisu.',
      },
    ],
    related: [
      { label: 'Oči v mapě těla', href: '/organ/eyes' },
      { label: 'Spánek a obrazovky', href: '/jak-funguje-telo/spanek' },
    ],
    sources: [SOURCES.holden, SOURCES.he, SOURCES.sheppard, SOURCES.singh, SOURCES.chungMyopia],
  },
  {
    slug: 'kuze-a-slunce',
    title: 'Kůže a slunce: nejlepší „anti-aging“ je opalovací krém',
    short: 'Kůže a slunce',
    icon: 'sun',
    hook: 'Většinu viditelného stárnutí pleti dělá slunce. A solárium je oficiálně karcinogen.',
    tldr: [
      'UV záření stárne kůži a zvyšuje riziko rakoviny kůže.',
      'V randomizované studii lidé s denním opalovacím krémem po 4,5 letech nevykazovali měřitelné zhoršení stárnutí pleti; v dlouhodobém sledování stejné studie měli méně melanomů, i když šlo o malý počet případů.',
      'Solária jsou zařazena mezi karcinogeny nejvyšší skupiny, stejně jako tabák.',
    ],
    numbers: [
      { value: 'SPF 30+', label: 'doporučený opalovací krém' },
      { value: '2 h', label: 'po kolika krém obnovit' },
      { value: 'UV 3+', label: 'od tohoto UV indexu se chránit (WHO)' },
    ],
    how: [
      {
        title: 'UVB a UVA',
        text: 'UVB spaluje povrch kůže a poškozuje DNA. UVA proniká hlouběji, rozkládá kolagen a elastin — vrásky, skvrny, ztráta pružnosti. Projde i mraky a oknem.',
      },
      {
        title: 'Opálení je obrana',
        text: 'Hnědnutí je reakce na poškození DNA. Krém „proti spálení“ nestačí, pokud nechrání i před UVA.',
      },
      {
        title: 'Vitamín D',
        text: 'Kůže ho ze slunce vytváří, ale v ČR to od podzimu do jara nestačí — a k jeho tvorbě nepotřebujete spálení.',
      },
      {
        title: 'UV index',
        text: 'Síla UV záření se neřídí teplotou, ale výškou slunce. Podle WHO se od indexu 3 vyplatí chránit — v Česku to bývá od jara do září kolem poledne, i v chladném dni. Index ukazuje většina aplikací na počasí.',
      },
    ],
    today: [
      'Sociální sítě propagují opálení, „base tan“ a solária — přitom právě UV záření nejvíc urychluje stárnutí kůže.',
      'Hodně péče o pleť jde do drahých sér; nejlépe doložený je přitom levný opalovací krém.',
    ],
    helps: [
      {
        text: 'Opalovací krém SPF 30+ s ochranou UVA denně na obličej, obnovovat po 2 hodinách a po plavání.',
        level: 'established',
      },
      { text: 'Stín a oblečení kolem poledne (zhruba 11–15 h).', level: 'established' },
      { text: 'Žádná solária.', level: 'established' },
      { text: 'Nekouřit — kouření urychluje stárnutí pleti.', level: 'established' },
      {
        text: 'Krému nešetřit: na obličej a krk zhruba lžičku. Většina lidí nanese jen polovinu — a ochrana je pak výrazně nižší, než slibuje SPF.',
        level: 'established',
      },
      {
        text: 'Hlídat znaménka: nesouměrné, s neostrým okrajem, víc barev, nad 6 mm nebo měnící se — ukázat lékaři.',
        level: 'established',
      },
      {
        text: 'Při akné k dermatologovi; vliv stravy (sladké, mléčné) je zatím jen předběžný.',
        level: 'preliminary',
      },
    ],
    myths: [
      { myth: 'Za mraku se spálit nedá.', fact: 'Velká část UV záření projde i mraky.' },
      {
        myth: 'Solárium „připraví“ kůži na léto.',
        fact: 'Opálení ze solária chrání jen minimálně a riziko melanomu zvyšuje.',
      },
      {
        myth: 'Opalovací krém způsobí nedostatek vitamínu D.',
        fact: 'Při běžném používání to studie nepotvrzují. Na zimu stejně pomůže spíš doplněk.',
      },
    ],
    related: [
      { label: 'Looksmaxing bez mýtů', href: '/looksmaxing' },
      { label: 'Kolagen', href: '/doplnky/kolagen' },
      { label: 'Kůže v mapě těla', href: '/organ/skin' },
    ],
    sources: [SOURCES.hughes, SOURCES.green, SOURCES.iarc, SOURCES.whoUvIndex],
  },
  {
    slug: 'srdce-a-tlak',
    title: 'Srdce a tlak: tichý problém, který se dá změřit',
    short: 'Srdce a tlak',
    icon: 'heart',
    hook: 'Vysoký tlak obvykle nebolí. Proto o něm spousta lidí neví — i těch mladých.',
    tldr: [
      'Vysoký krevní tlak má víc než miliarda dospělých na světě a často nemá žádné příznaky.',
      'Dospělí by měli sníst méně než 5 g soli denně; průměr je zhruba dvojnásobný.',
      'Pohyb, méně soli a alkoholu a nekouření tlak měřitelně snižují.',
    ],
    numbers: [
      { value: '<5 g', label: 'soli denně podle WHO' },
      { value: '<120/70', label: 'nezvýšený tlak podle ESC 2024 (mmHg)' },
    ],
    how: [
      {
        title: 'Pumpa a hadice',
        text: 'Srdce každým stahem vytlačí krev do tepen. Tlak je síla, kterou krev tlačí na jejich stěny — horní číslo při stahu, dolní při uvolnění.',
      },
      {
        title: 'Proč vadí vysoký tlak',
        text: 'Dlouhodobě vysoký tlak poškozuje cévy, srdce, ledviny i mozek — zvyšuje riziko infarktu a mrtvice. Často roky bez varovných příznaků.',
      },
      {
        title: 'Sůl a tlak',
        text: 'Sodík zadržuje v těle vodu a u mnoha lidí zvyšuje tlak. Většinu soli přitom sníme v pečivu, uzeninách a hotových jídlech, ne ze slánky.',
      },
      {
        title: 'Jak měřit, aby to sedělo',
        text: 'Pět minut v klidu sedět, ruka opřená ve výšce srdce, manžeta na holé paži. Změřit dvakrát po minutě a zapsat průměr. Jedno vysoké číslo ještě nic neznamená — rozhoduje opakované měření.',
      },
    ],
    today: [
      'Sezení, ultrazpracované jídlo, stres a málo spánku tlak zvyšují.',
      'Energetické nápoje a nikotin krátkodobě zvyšují tep i tlak.',
    ],
    helps: [
      {
        text: 'Změřit si tlak — v lékárně, u lékaře nebo doma — i když se cítíte dobře.',
        level: 'established',
      },
      { text: 'Méně soli: méně uzenin, hotových jídel a slaného pečiva.', level: 'established' },
      { text: 'Pravidelný pohyb, hlavně vytrvalostní.', level: 'established' },
      { text: 'Nekouřit a omezit alkohol.', level: 'established' },
      { text: 'Víc zeleniny, ovoce a luštěnin (draslík).', level: 'plausible' },
      {
        text: 'Solit solí s draslíkem místo běžné — ve velké studii u lidí s vysokým tlakem ubylo mrtvic asi o 14 %. Ne při nemoci ledvin nebo lécích, které draslík zadržují.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Vysoký tlak bych poznal.',
        fact: 'Většinou ne — proto se mu říká tichý zabiják. Jediná jistota je měření.',
      },
      {
        myth: 'Mladých lidí se to netýká.',
        fact: 'Riziko s věkem roste, ale vysoký tlak mívají i lidé pod 40.',
      },
      {
        myth: 'Když je tlak s léky v normě, můžu je vysadit.',
        fact: 'Normální tlak je většinou zásluha léků — po vysazení se obvykle vrátí. Změnu léčby proberte s lékařem.',
      },
    ],
    related: [
      { label: 'Srdce v mapě těla', href: '/organ/heart' },
      { label: 'Omega-3', href: '/doplnky/omega-3' },
      { label: 'Pohyb a sezení', href: '/jak-funguje-telo/pohyb-a-sezeni' },
    ],
    sources: [SOURCES.whoHypertension, SOURCES.whoSodium, SOURCES.escHypertension, SOURCES.ssass],
  },
  {
    slug: 'mozek-a-uceni',
    title: 'Mozek a učení: jak si věci zapamatovat napoprvé',
    short: 'Mozek a učení',
    icon: 'graduation',
    hook: 'Čtení poznámek dokola je jedna z nejméně účinných metod. Co funguje lépe — a proč na to potřebujete spát.',
    tldr: [
      'Mozek si pamatuje lépe, když učení rozložíte do více dní, místo jednoho bifování.',
      'Zkoušet se (vybavovat si) funguje lépe než znovu číst.',
      'Spánek po učení paměť upevňuje — noc před zkouškou bez spánku se nevyplatí.',
    ],
    numbers: [
      { value: '1–2 dny', label: 'pauza před 1. opakováním, když je zkouška za týden' },
      { value: '+2 %', label: 'objem hipokampu po roce chůze (starší dospělí)' },
    ],
    how: [
      {
        title: 'Spoje mezi neurony',
        text: 'Učení mění spojení mezi nervovými buňkami. Co si opakovaně vybavujete, to se posiluje; co nepoužíváte, slábne.',
      },
      {
        title: 'Zapomínání pomáhá',
        text: 'Když si vzpomínáte na něco, co už napůl zapomínáte, mozek se namáhá — a právě to paměť zpevní. Proto fungují rozložené opakování a testy.',
      },
      {
        title: 'Spánek jako ukládání',
        text: 'Během spánku mozek přehrává a třídí, co se přes den naučil. Bez spánku se nové vzpomínky ukládají hůř.',
      },
      {
        title: 'Pohyb a paměť',
        text: 'Hipokampus — centrum pro ukládání vzpomínek — s věkem pomalu ubývá. U starších lidí, kteří rok třikrát týdně svižně chodili, se naopak o 2 % zvětšil a zlepšila se jim paměť.',
      },
    ],
    today: [
      'Notifikace a přepínání mezi aplikacemi trhají pozornost. Lidé, kteří často dělají víc věcí najednou, se v jedné studii hůř bránili rozptýlení.',
      'Učení z krátkých videí dává pocit, že něčemu rozumíte, ale bez vlastního vybavování se málo zapamatuje.',
    ],
    helps: [
      { text: 'Rozložit učení do více kratších bloků v různých dnech.', level: 'established' },
      {
        text: 'Zkoušet se: kartičky, otázky, vysvětlit látku vlastními slovy bez poznámek.',
        level: 'established',
      },
      { text: 'Vyspat se po učení a před zkouškou.', level: 'plausible' },
      { text: 'Mobil mimo dosah a vypnuté notifikace při práci.', level: 'plausible' },
      { text: 'Pravidelný pohyb — zlepšuje náladu, spánek i soustředění.', level: 'plausible' },
    ],
    myths: [
      {
        myth: 'Používáme jen 10 % mozku.',
        fact: 'Nesmysl — zobrazovací metody ukazují aktivitu v celém mozku, jen ne všude najednou.',
      },
      {
        myth: 'Jsem vizuální typ, tak se učím jen z obrázků.',
        fact: 'Pro „učební styly“ chybí důkazy. Všem pomáhají stejné metody — opakování a vybavování.',
      },
      {
        myth: 'Multitasking zvládám.',
        fact: 'Mozek mezi úkoly rychle přepíná a při každém přepnutí ztrácí čas a přesnost.',
      },
    ],
    related: [
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
      { label: 'Dopamin a mobil', href: '/jak-funguje-telo/dopamin-a-mobil' },
      { label: 'Mozek v mapě těla', href: '/organ/brain' },
    ],
    sources: [
      SOURCES.cepeda,
      SOURCES.roediger,
      SOURCES.walker,
      SOURCES.ophir,
      SOURCES.pashler,
      SOURCES.erickson,
    ],
  },
  {
    slug: 'hubnuti-a-energie',
    title: 'Hubnutí a energie: co se děje, když tělo dostane méně',
    short: 'Hubnutí',
    icon: 'scale',
    hook: 'Proč hubnutí časem zpomalí, proč metabolismus po třicítce neodchází a proč tolik záleží na pohybu mimo posilovnu.',
    tldr: [
      'Tuk ubývá, když tělo dlouhodobě dostává méně energie, než spotřebuje — jinou cestu příroda nevymyslela.',
      'Metabolismus je mezi 20 a 60 lety v podstatě stabilní; zpomalovat začíná až později.',
      'Velkou část rozdílů mezi lidmi dělá pohyb mimo cvičení — chůze, stání, schody.',
    ],
    numbers: [
      { value: '20–60', label: 'let stabilní metabolismus' },
      { value: '0,5–1 %', label: 'hmotnosti týdně: rozumné tempo' },
      { value: '2/3', label: 'shozené váhy se vrátilo do roka po vysazení semaglutidu' },
    ],
    how: [
      {
        title: 'Energetická bilance',
        text: 'Energie z jídla se spotřebuje na základní chod těla, trávení a pohyb. Když jí přijde méně, tělo sáhne do zásob — hlavně tuku, ale při rychlém hubnutí i svalů.',
      },
      {
        title: 'Proč hubnutí zpomalí',
        text: 'S nižší váhou tělo potřebuje méně energie a trochu šetří. Populární pravidlo „7 700 kcal = 1 kg“ proto dlouhodobě přeceňuje, kolik zhubnete.',
      },
      {
        title: 'Pohyb mimo trénink',
        text: 'Hodina v posilovně je malá část dne. Chůze, stání a běžný pohyb (NEAT) se mezi lidmi liší o stovky kalorií denně.',
      },
      {
        title: 'Hlad po zhubnutí',
        text: 'Po zhubnutí tělo zvýší hormon hladu (ghrelin) a sníží hormony sytosti — a tak to zůstává i rok poté. Udržet váhu proto není otázka slabé vůle, ale samostatná fáze, na kterou je dobré se připravit.',
      },
    ],
    today: [
      'Jídlo je dostupné všude a pořád, často v kaloricky hustých a velkých porcích.',
      'Sedavý den výrazně snižuje výdej energie — i když chodíte cvičit.',
      'Sociální sítě slibují rychlé výsledky a „spalovače“, které nefungují.',
    ],
    helps: [
      { text: 'Mírný a udržitelný kalorický deficit místo drastických diet.', level: 'established' },
      { text: 'Dost bílkovin a vlákniny — déle zasytí a pomáhají udržet svaly.', level: 'plausible' },
      { text: 'Silový trénink, aby ubýval tuk, ne svaly.', level: 'established' },
      { text: 'Víc chůze během dne (kroky, schody, pěšky místo MHD).', level: 'plausible' },
      { text: 'Dostatek spánku — nedostatek zvyšuje hlad a chuť na kalorická jídla.', level: 'plausible' },
    ],
    myths: [
      {
        myth: 'Po třicítce se metabolismus zpomalí.',
        fact: 'Velká studie ukázala, že je mezi 20 a 60 lety po zohlednění beztukové hmoty (svaly, orgány, kosti) stabilní.',
      },
      {
        myth: 'Jídlo po šesté večer se ukládá do tuku.',
        fact: 'Rozhoduje celkový příjem za den, ne hodina na hodinkách.',
      },
      {
        myth: 'Spalovače tuků fungují.',
        fact: 'Žádný doplněk neudělá měřitelný rozdíl bez změny jídla a pohybu.',
      },
      {
        myth: 'Injekce na hubnutí jsou jednorázová kúra.',
        fact: 'Léky jako semaglutid při obezitě pomáhají (v průměru −15 % váhy), ale působí jen po dobu užívání. Do roka po vysazení se vrátily asi dvě třetiny shozených kil. Patří k lékaři.',
      },
    ],
    related: [
      { label: 'Bílkoviny', href: '/doplnky/bilkoviny' },
      { label: 'Svaly a metabolismus', href: '/jak-funguje-telo/svaly-a-metabolismus' },
      { label: 'Pohyb a sezení', href: '/jak-funguje-telo/pohyb-a-sezeni' },
    ],
    sources: [
      SOURCES.hallEnergy,
      SOURCES.pontzer,
      SOURCES.levine,
      SOURCES.sumithran,
      SOURCES.step1,
      SOURCES.step1Ext,
    ],
  },
  {
    slug: 'cukr-a-inzulin',
    title: 'Cukr a inzulin: co dělá hladina glukózy po jídle',
    short: 'Cukr a inzulin',
    icon: 'candy',
    hook: 'Glukózové špičky jsou nové téma na sítích. Co je normální, co už ne a co doopravdy snižuje riziko cukrovky.',
    tldr: [
      'Po jídle hladina cukru v krvi stoupne a inzulin ho pomůže dostat do svalů a jater — to je normální.',
      'Problém je, když buňky na inzulin přestávají reagovat (inzulinová rezistence).',
      'Změna životního stylu snížila výskyt cukrovky 2. typu u lidí s prediabetem o 58 %.',
    ],
    numbers: [
      { value: '58 %', label: 'méně cukrovky díky změně životního stylu' },
      { value: '<10 %', label: 'energie z volných cukrů (WHO)' },
    ],
    how: [
      {
        title: 'Inzulin jako klíč',
        text: 'Slinivka po jídle vyplaví inzulin. Ten „odemkne“ buňky, aby si glukózu vzaly — svaly ji spálí nebo uloží, játra si ji schovají na později.',
      },
      {
        title: 'Inzulinová rezistence',
        text: 'Při nadváze (hlavně tuku na břiše), nedostatku pohybu a spánku buňky reagují hůř. Slinivka musí vyrábět víc inzulinu — a jednou to nestačí.',
      },
      {
        title: 'Svaly jako odběratel',
        text: 'Pracující svaly berou glukózu i bez velkého množství inzulinu. Proto po jídle pomáhá i krátká procházka.',
      },
      {
        title: 'Jak se to měří',
        text: 'Lékař měří cukr nalačno a HbA1c — „průměr“ cukru za poslední 2–3 měsíce. Prediabetes (nalačno zhruba 5,6–6,9 mmol/l) se dlouho neprojevuje, ale právě tehdy jde cukrovce nejlépe předejít.',
      },
    ],
    today: [
      'Sladké nápoje a energetické tyčinky přinášejí hodně cukru bez sytosti.',
      'Kontinuální glukometry se prodávají i zdravým lidem — u nich ale zatím není jasné, jestli sledování špiček přinese zdravotní užitek.',
    ],
    helps: [
      {
        text: 'Méně volných cukrů a sladkých nápojů (WHO: pod 10 % energie, ideálně pod 5 %).',
        level: 'established',
      },
      {
        text: 'Pohyb a při nadváze zhubnout zhruba 5–7 % hmotnosti — klíčové pro prevenci cukrovky.',
        level: 'established',
      },
      { text: 'Krátká procházka po jídle.', level: 'plausible' },
      { text: 'Vláknina, bílkoviny a tuky v jídle zmírní vzestup cukru.', level: 'plausible' },
      { text: 'Při rodinné zátěži nebo nadváze si nechat změřit glukózu u lékaře.', level: 'established' },
    ],
    myths: [
      {
        myth: 'Cukr dělá z dětí hyperaktivní.',
        fact: 'Metaanalýza studií to nepotvrdila — rodiče to ale často vnímají kvůli očekávání.',
      },
      {
        myth: 'Každá glukózová špička je škodlivá.',
        fact: 'Vzestup po jídle je normální. Důležité je, jak rychle se hladina vrátí a jaký je dlouhodobý průměr.',
      },
      {
        myth: 'Ovoce je kvůli cukru špatné.',
        fact: 'Celé ovoce obsahuje vlákninu a souvisí s lepším zdravím. Jiné je to u džusů a sladkých nápojů.',
      },
      {
        myth: 'Med a třtinový cukr jsou zdravější než bílý cukr.',
        fact: 'Pro tělo jde pořád o volné cukry, stejně jako u sirupů a džusů. WHO je počítá do stejného limitu.',
      },
    ],
    related: [
      { label: 'Vláknina', href: '/doplnky/vlaknina' },
      { label: 'Hubnutí', href: '/jak-funguje-telo/hubnuti-a-energie' },
      { label: 'Svaly a metabolismus', href: '/jak-funguje-telo/svaly-a-metabolismus' },
    ],
    sources: [SOURCES.dpp, SOURCES.whoSugar, SOURCES.glucotypes, SOURCES.wolraich],
  },
  {
    slug: 'ultrazpracovane-potraviny',
    title: 'Ultrazpracované potraviny: proč se jich sní víc',
    short: 'Ultrazpracované jídlo',
    icon: 'package',
    hook: 'Ve studii lidé na ultrazpracované stravě snědli zhruba o 500 kcal denně víc — a přibrali. Proč, a co s tím.',
    tldr: [
      'Ultrazpracované potraviny jsou průmyslové výrobky z rafinovaných složek a přídatných látek — chipsy, sladké cereálie, uzeniny, hotová jídla.',
      'V přísně kontrolované studii lidé při takové stravě jedli víc a přibírali.',
      'Vysoký příjem souvisí s vyšším rizikem řady nemocí — ale ne každý balený výrobek je stejný.',
    ],
    numbers: [
      { value: '~500 kcal', label: 'denně navíc při ultrazpracované stravě' },
      { value: '2 týdny', label: 'na každé stravě (20 dospělých, celkem 4 týdny)' },
    ],
    how: [
      {
        title: 'Snadno se jí',
        text: 'Měkké, kaloricky husté a dochucené jídlo se jí rychle. Tělo nestihne včas poslat signál sytosti.',
      },
      {
        title: 'Snadno se jich sní víc',
        text: 'Ultrazpracované výrobky mívají málo vlákniny a bílkovin, které nejvíc zasytí. Ve zmíněné studii ale lidé jedli víc, i když strava měla stejně vlákniny i bílkovin — roli hraje i něco dalšího, třeba rychlost jedení.',
      },
      {
        title: 'Jak je poznat',
        text: 'Vědci používají třídění NOVA: od nezpracovaných potravin (jablko, vejce) přes zpracované (sýr, chléb ze tří surovin) až po ultrazpracované, které obsahují složky, jež v kuchyni nepoužíváte — sirupy, izoláty, aromata, emulgátory.',
      },
      {
        title: 'Co ukazují data',
        text: 'Velký přehled 45 metaanalýz spojil vysoký příjem s vyšším rizikem srdečních nemocí, cukrovky 2. typu, deprese i úmrtí. Jde hlavně o pozorování — přesný mechanismus se teprve hledá.',
      },
    ],
    today: [
      'Ultrazpracované potraviny tvoří v mnoha zemích velkou část jídelníčku — jsou levné, rychlé a všude.',
      'Marketing „fit“ a „protein“ výrobků často zakrývá, že jde pořád o ultrazpracovanou potravinu.',
    ],
    helps: [
      {
        text: 'Postavit jídla na základních potravinách: maso, ryby, vejce, luštěniny, zelenina, ovoce, obiloviny.',
        level: 'plausible',
      },
      {
        text: 'Vařit jednoduchá jídla do zásoby, aby zdravá volba byla i ta nejrychlejší.',
        level: 'plausible',
      },
      { text: 'Číst složení: dlouhý seznam přísad, které doma nemáte, je vodítko.', level: 'preliminary' },
      {
        text: 'Nehledat dokonalost — nejvíc pomůže omezit sladké nápoje, sladkosti a uzeniny.',
        level: 'plausible',
      },
    ],
    myths: [
      {
        myth: 'Všechno balené je ultrazpracované.',
        fact: 'Mražená zelenina nebo bílý jogurt jsou zpracované minimálně. Pečivo jen z mouky, vody, soli a kvasu je zpracované, ale ne ultrazpracované.',
      },
      {
        myth: 'Je to jen o kaloriích.',
        fact: 'Kalorie rozhodují o váze, ale ultrazpracovaná strava ovlivňuje, kolik jich sníte.',
      },
      {
        myth: 'Problém jsou hlavně „éčka“.',
        fact: 'Schválené přídatné látky posuzuje EFSA. Větší roli hraje celé složení — hodně cukru, soli a tuku a málo vlákniny. U některých emulgátorů se vliv na střeva zatím zkoumá.',
      },
    ],
    related: [
      { label: 'Hubnutí', href: '/jak-funguje-telo/hubnuti-a-energie' },
      { label: 'Střeva a mikrobiom', href: '/jak-funguje-telo/streva-a-mikrobiom' },
      { label: 'Vláknina', href: '/doplnky/vlaknina' },
    ],
    sources: [SOURCES.hallUpf, SOURCES.lane],
  },
  {
    slug: 'nikotin-a-vaping',
    title: 'Nikotin a vaping: co dělá s mozkem a srdcem',
    short: 'Nikotin a vaping',
    icon: 'cloud',
    hook: 'Vape není „jen pára“ a nikotinové sáčky nejsou bonbóny. Kdy je e-cigareta pomocník a kdy nová závislost.',
    tldr: [
      'Nikotin je silně návykový a zvyšuje tep i tlak; mozek dospívajících je k závislosti citlivější.',
      'Nejvíc škodí kouření — tabák zabíjí ročně přes 7 milionů lidí, z toho 1,6 milionu nekuřáků vystavených kouři.',
      'Pro kuřáky jsou e-cigarety s nikotinem účinnou cestou k odvykání. Pro nekuřáky jsou jen nová závislost.',
    ],
    numbers: [
      { value: '7+ mil.', label: 'úmrtí na tabák ročně (WHO)' },
      { value: '2×', label: 'vyšší šance přestat s léky vareniklin nebo cytisin' },
      { value: '4–5 kg', label: 'průměrně se přibere za rok po skončení' },
    ],
    how: [
      {
        title: 'Rychlá odměna',
        text: 'Nikotin se během pár sekund dostane do mozku a uvolní dopamin. Mozek si spojí situaci s odměnou — a chce ji znovu.',
      },
      {
        title: 'Abstinence',
        text: 'Když hladina klesne, přijde neklid a nesoustředěnost. Další dávka je „uleví“ — tak vzniká pocit, že nikotin uklidňuje.',
      },
      {
        title: 'Kouř vs. aerosol',
        text: 'Většinu nemocí z kouření způsobují látky ze spalování tabáku. E-cigarety nehoří, ale aerosol obsahuje nikotin a další látky; dlouhodobé účinky zatím nejsou známé.',
      },
    ],
    today: [
      'Vapy s ovocnými příchutěmi a nikotinové sáčky cílí na mladé lidi.',
      'Vysoké dávky nikotinu v jednorázových vapech znamenají rychlou závislost.',
    ],
    helps: [
      { text: 'Přestat kouřit — přínos má v jakémkoli věku.', level: 'established' },
      { text: 'Kombinovat odvykání s podporou (lékař, linka) a náhradou nikotinu.', level: 'established' },
      {
        text: 'Zeptat se lékaře na léky (vareniklin, cytisin) — zhruba zdvojnásobí šanci, že vydržíte.',
        level: 'established',
      },
      {
        text: 'Kuřákům, kterým jiné cesty nefungují, pomáhají přestat e-cigarety s nikotinem.',
        level: 'established',
      },
      { text: 'Pokud nekouříte ani nevapujete — nezačínat.', level: 'established' },
    ],
    myths: [
      { myth: 'Vape je jen vodní pára.', fact: 'Je to aerosol s nikotinem, rozpouštědly a dalšími látkami.' },
      { myth: 'Nikotin mě uklidňuje.', fact: 'Většinou jen tlumí abstinenční neklid, který sám způsobil.' },
      {
        myth: 'Rakovinu způsobuje hlavně nikotin.',
        fact: 'Hlavní příčinou jsou látky z hořícího tabáku. Nikotin je ale návykový a zatěžuje srdce.',
      },
      {
        myth: 'Když přestanu, přiberu tolik, že se to nevyplatí.',
        fact: 'Průměrně se za rok přibere 4–5 kg, někdo nic. Přínos pro srdce a plíce je i tak mnohem větší — a s váhou se dá pracovat.',
      },
    ],
    related: [
      { label: 'Dopamin a mobil', href: '/jak-funguje-telo/dopamin-a-mobil' },
      { label: 'Srdce a tlak', href: '/jak-funguje-telo/srdce-a-tlak' },
      { label: 'Plíce v mapě těla', href: '/organ/lungs' },
    ],
    sources: [SOURCES.whoTobacco, SOURCES.lindson, SOURCES.vareniclineCochrane, SOURCES.aubin],
  },
  {
    slug: 'bolest-zad',
    title: 'Bolest zad: proč „seď rovně“ není řešení',
    short: 'Bolest zad',
    icon: 'bone',
    hook: 'Bolest dolní části zad je celosvětově nejčastější příčina omezení v běžném životě. Většinou se ale zlepší — a pomáhá pohyb, ne klid.',
    tldr: [
      'Většina bolestí zad nemá jednu jasnou příčinu a během několika týdnů se zlepší.',
      'Zůstat v pohybu pomáhá víc než klid na lůžku.',
      'Žádné jedno „správné“ držení těla neexistuje — nejlepší poloha je ta další.',
    ],
    numbers: [
      { value: '#1', label: 'příčina let života s omezením (svět)' },
      { value: '6 týdnů', label: 'do té doby se akutní bolest většinou výrazně zlepší' },
    ],
    how: [
      {
        title: 'Nespecifická bolest',
        text: 'U většiny lidí nejde určit konkrétní poškození. Bolest ovlivňují svaly, klouby, ale i spánek, stres a obavy.',
      },
      {
        title: 'Snímky klamou',
        text: 'Vyklenuté ploténky a „opotřebení“ na magnetické rezonanci má i spousta lidí, které záda vůbec nebolí. Snímek proto bez varovných příznaků obvykle nepomůže.',
      },
      {
        title: 'Bolest není měřák poškození',
        text: 'Nervový systém umí bolest „zesílit“ — při stresu, špatném spánku nebo strachu bolí víc, i když se v zádech nic nezměnilo. Proto pomáhá i pochopit, co se děje.',
      },
      {
        title: 'Jak to obvykle běží',
        text: 'Akutní bolest se u většiny lidí během 6 týdnů výrazně zlepší. U části ale mírnější potíže zůstávají nebo se vracejí — a právě tam má největší smysl cvičení.',
      },
    ],
    today: [
      'Celý den v sedě a málo pohybu snižuje odolnost zad.',
      'Strach z pohybu („abych si neublížil“) může bolest prodloužit.',
    ],
    helps: [
      {
        text: 'Zůstat aktivní a pokračovat v běžných činnostech, jak to bolest dovolí.',
        level: 'established',
      },
      {
        text: 'Při dlouhodobé bolesti cvičení a postupné zatěžování, ideálně s fyzioterapeutem.',
        level: 'established',
      },
      { text: 'Střídat polohy a dělat přestávky v sezení.', level: 'plausible' },
      {
        text: 'Okamžitě k lékaři při znecitlivění v rozkroku, potížích s močením či stolicí, horečce nebo po úrazu.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Musím sedět rovně, jinak si zničím záda.',
        fact: 'Pro jedno „správné“ držení těla chybí důkazy. Pomáhá polohu měnit.',
      },
      { myth: 'Při bolesti zad je nejlepší ležet.', fact: 'Klid na lůžku zotavení spíš zpomaluje.' },
      {
        myth: 'Magnetická rezonance ukáže příčinu.',
        fact: 'Často ukáže změny, které jsou normální i u lidí bez bolesti.',
      },
    ],
    related: [
      { label: 'Mapa bolesti a mobilita v aplikaci', href: '/login?mode=signup' },
      { label: 'Pohyb a sezení', href: '/jak-funguje-telo/pohyb-a-sezeni' },
      { label: 'Kosti v mapě těla', href: '/organ/bones' },
    ],
    sources: [SOURCES.hartvigsen, SOURCES.foster, SOURCES.slater, SOURCES.whoBack, SOURCES.costaBack],
  },
  {
    slug: 'sluch-a-sluchatka',
    title: 'Sluch a sluchátka: poškození, které se nevrátí',
    short: 'Sluch a sluchátka',
    icon: 'ear',
    hook: 'Zhruba miliarda mladých lidí poslouchá tak nahlas, že riskuje trvalou ztrátu sluchu. Pískání po koncertu je varování.',
    tldr: [
      'Ve vnitřním uchu jsou smyslové buňky, které se po poškození neobnoví.',
      'Rozhoduje hlasitost × čas: čím hlasitěji, tím kratší bezpečná doba.',
      'Studie odhaduje, že nebezpečně hlasitě poslouchá ve sluchátkách zhruba čtvrtina mladých lidí — a na koncertech a v klubech téměř polovina.',
    ],
    numbers: [
      { value: '~1 mld.', label: 'mladých lidí v ohrožení (odhad)' },
      { value: '~60 %', label: 'hlasitosti jako rozumný strop' },
    ],
    how: [
      {
        title: 'Vláskové buňky',
        text: 'Zvuk rozkmitá drobné vláskové buňky v hlemýždi a ty ho převedou na signál pro mozek. Příliš hlasitý zvuk je přetíží a poškodí — a tyto buňky u člověka nedorostou.',
      },
      {
        title: 'Dávka hluku',
        text: 'Nejde jen o hlasitost, ale o dobu. Hlasitější zvuk zvládne ucho bezpečně jen kratší čas.',
      },
      {
        title: 'Varovné signály',
        text: 'Pískání v uších (tinnitus) nebo zastřený sluch po koncertě znamenají, že ucho bylo přetížené. Opakované přetížení se sčítá.',
      },
      {
        title: 'Sluch a mozek',
        text: 'Když mozek dostává z uší horší signál, musí se víc namáhat a člověk se často stahuje z hovorů. Neléčená ztráta sluchu ve středním věku patří mezi nejvýznamnější ovlivnitelná rizika demence.',
      },
    ],
    today: [
      'Sluchátka celý den — v MHD, při učení, při sportu.',
      'V hlučném prostředí lidé zesilují, aby přehlušili okolí.',
    ],
    helps: [
      { text: 'Hlasitost ve sluchátkách nejvýš kolem 60 % a dělat přestávky.', level: 'plausible' },
      { text: 'Sluchátka s potlačením hluku — umožní poslouchat potichu.', level: 'plausible' },
      { text: 'Špunty do uší na koncerty, festivaly a do klubů.', level: 'established' },
      { text: 'Při pískání v uších nebo zhoršeném sluchu jít na vyšetření.', level: 'established' },
      {
        text: 'Když sluch slábne, nečekat a zkusit naslouchadlo — souvisí s menším rizikem demence.',
        level: 'preliminary',
      },
    ],
    myths: [
      {
        myth: 'Po koncertě se to vždycky spraví.',
        fact: 'Krátkodobě ano, ale poškození se sčítá a jednou už se sluch nevrátí.',
      },
      {
        myth: 'Ztráta sluchu je problém starých lidí.',
        fact: 'Hlukem poškozený sluch se objevuje i u mladých a je trvalý.',
      },
      {
        myth: 'Pecky do uší jsou horší než velká sluchátka.',
        fact: 'Rozhoduje hlasitost a čas, ne typ sluchátek. Výhodu mají ta, která tlumí okolní hluk, protože s nimi stačí poslouchat potichu.',
      },
    ],
    related: [
      { label: 'Mozek a učení', href: '/jak-funguje-telo/mozek-a-uceni' },
      { label: 'Mozek v mapě těla', href: '/organ/brain' },
    ],
    sources: [SOURCES.dillard, SOURCES.whoHearing, SOURCES.whoSafeListening, SOURCES.lancetDementia],
  },
  {
    slug: 'sauna-a-chlad',
    title: 'Sauna a otužování: co je věda a co trend',
    short: 'Sauna a chlad',
    icon: 'flame',
    hook: 'Ledové lázně a saunování jsou všude na sítích. Co z toho má oporu ve výzkumu a na co si dát pozor.',
    tldr: [
      'Častá sauna souvisí s nižší úmrtností na srdeční choroby — ale jde o pozorování, ne o důkaz příčiny.',
      'Ledová lázeň hned po posilování může tlumit nárůst svalů.',
      'Studená voda je pro tělo stres: první minuty prudce zrychlí dech a tep. Opatrně a nikdy sami.',
    ],
    numbers: [
      { value: '4–7×', label: 'sauna týdně v nejznámější studii' },
      { value: '1–3 min', label: 'nejrizikovější první fáze ve studené vodě' },
    ],
    how: [
      {
        title: 'Teplo',
        text: 'V sauně se rozšíří cévy, zrychlí tep a tělo se potí, aby se ochladilo. Pro srdce je to podobná zátěž jako lehký pohyb.',
      },
      {
        title: 'Chladový šok',
        text: 'Po ponoření do studené vody přijde prudký nádech, zrychlené dýchání a skok tlaku. Proto je nebezpečné skákat do studené vody nebo být ve vodě sám.',
      },
      {
        title: 'Zvykání',
        text: 'Při pravidelném otužování se chladový šok zmírní. Většina dalších slibovaných účinků ale stojí na malých studiích.',
      },
      {
        title: 'Chlad a hubnutí',
        text: 'Chlad aktivuje hnědý tuk, který pálí energii na teplo. Za pár minut v ledové vodě je to ale jen desítky kilokalorií — na váze se to skoro neprojeví.',
      },
    ],
    today: [
      'Ledové lázně se prodávají jako univerzální regenerace — přitom u silového tréninku můžou část přínosu vzít.',
      'Saunu a chlad lidé často kombinují s alkoholem, který riziko výrazně zvyšuje.',
    ],
    helps: [
      {
        text: 'Sauna pravidelně, pokud vám dělá dobře — bez alkoholu a s dostatkem tekutin.',
        level: 'plausible',
      },
      {
        text: 'Chcete-li nabírat svaly, ledovou lázeň dejte s odstupem od posilování, ne hned po něm.',
        level: 'plausible',
      },
      {
        text: 'Otužovat postupně, s doprovodem a krátce; při nemoci srdce se nejdřív poradit s lékařem.',
        level: 'plausible',
      },
      { text: 'Lepší nálada a pocit svěžesti po chladu — zatím jen malé studie.', level: 'preliminary' },
      {
        text: 'Do sauny ani do studené vody ne s horečkou, po alkoholu nebo při nestabilní nemoci srdce.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'V sauně se „vypotí toxiny“.',
        fact: 'Potem odchází hlavně voda a soli. Odpadní látky odstraňují játra a ledviny.',
      },
      {
        myth: 'Otužování spolehlivě posílí imunitu.',
        fact: 'Důkazy jsou slabé. Ve velké studii se studenou sprchou lidé nebyli nemocní méně často, jen se cítili líp.',
      },
    ],
    related: [
      { label: 'Srdce a tlak', href: '/jak-funguje-telo/srdce-a-tlak' },
      { label: 'Svaly a metabolismus', href: '/jak-funguje-telo/svaly-a-metabolismus' },
      { label: 'Stres', href: '/jak-funguje-telo/stres' },
    ],
    sources: [SOURCES.laukkanen, SOURCES.roberts, SOURCES.esperland, SOURCES.buijze],
  },
  {
    slug: 'menstruacni-cyklus',
    title: 'Menstruační cyklus: co se v těle děje každý měsíc',
    short: 'Menstruační cyklus',
    icon: 'flower',
    hook: 'Hormony, energie, trénink a železo. Bez tabu a bez „cycle syncing“ mýtů.',
    tldr: [
      'Cyklus řídí hlavně estrogen a progesteron; běžná délka je zhruba 21–35 dní.',
      'Vliv fáze cyklu na sportovní výkon je v průměru malý a u každé ženy jiný.',
      'Menstruace je častou příčinou nedostatku železa — anémii má podle WHO asi třetina žen v plodném věku.',
    ],
    numbers: [
      { value: '21–35', label: 'dní: běžná délka cyklu' },
      { value: '~30 %', label: 'žen 15–49 let s anémií (WHO, svět)' },
      { value: '~10 %', label: 'žen v plodném věku má endometriózu (WHO)' },
    ],
    how: [
      {
        title: 'První polovina',
        text: 'Po menstruaci roste estrogen a ve vaječníku dozrává vajíčko. Kolem poloviny cyklu nastává ovulace.',
      },
      {
        title: 'Druhá polovina',
        text: 'Po ovulaci stoupá progesteron, mírně se zvýší tělesná teplota. Pokud nedojde k otěhotnění, hormony klesnou a začne menstruace.',
      },
      {
        title: 'PMS',
        text: 'Pár dní před menstruací může přijít únava, podrážděnost, napětí v prsou nebo chuť na jídlo. Je to časté — silné potíže ale stojí za návštěvu lékaře.',
      },
      {
        title: 'Kdy je krvácení moc silné',
        text: 'Varovné jsou výměna vložky nebo tamponu každou 1–2 hodiny, sraženiny větší než mince, krvácení přes 7 dní nebo únava a dušnost. To bývá cesta k nedostatku železa — a dá se léčit.',
      },
      {
        title: 'Endometrióza',
        text: 'Tkáň podobná děložní sliznici roste mimo dělohu a způsobuje silnou bolest při menstruaci, při sexu nebo dlouhodobou bolest v podbřišku. Týká se zhruba každé desáté ženy a často se roky přehlíží.',
      },
    ],
    today: [
      'Aplikace a sítě doporučují plánovat jídlo i trénink podle fáze cyklu („cycle syncing“) — pevné důkazy pro to chybí.',
      'Silné bolesti se často zlehčují, přitom můžou mít léčitelnou příčinu (např. endometriózu).',
    ],
    helps: [
      {
        text: 'Cvičit podle toho, jak se cítíte — menstruace sama o sobě není důvod netrénovat.',
        level: 'plausible',
      },
      {
        text: 'Jíst dost železa a při únavě a silném krvácení si nechat změřit krevní obraz a feritin.',
        level: 'established',
      },
      { text: 'Na bolest pomáhají běžné protizánětlivé léky a teplo.', level: 'established' },
      {
        text: 'Silné krvácení i bolest umí výrazně zmírnit léčba od gynekologa (např. hormonální) — není nutné to „vydržet“.',
        level: 'established',
      },
      {
        text: 'K lékaři při velmi silném krvácení, bolesti, která omezuje běžný život, nebo při vynechání menstruace.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Při menstruaci se nemá cvičit.',
        fact: 'Není k tomu zdravotní důvod. Mnoha ženám pohyb dokonce uleví.',
      },
      {
        myth: 'Trénink se musí řídit fází cyklu.',
        fact: 'Rozdíly ve výkonu jsou v průměru malé. Víc záleží na tom, jak se cítíte vy.',
      },
      {
        myth: 'Silná bolest je normální.',
        fact: 'Bolest, která vás vyřadí z běžného dne, normální není a patří k lékaři.',
      },
    ],
    related: [
      { label: 'Železo', href: '/doplnky/zelezo' },
      { label: 'Kosti', href: '/jak-funguje-telo/kosti' },
      { label: 'Menopauza', href: '/jak-funguje-telo/menopauza' },
    ],
    sources: [SOURCES.mcnulty, SOURCES.whoAnaemia, SOURCES.whoEndometriosis],
  },
  {
    slug: 'menopauza',
    title: 'Menopauza: co se v těle mění a co opravdu pomáhá',
    short: 'Menopauza',
    icon: 'venus',
    hook: 'Návaly horka, horší spánek, výkyvy nálady. Přechod není nemoc — ale potíže se dají dobře léčit a nemusíte je jen přetrpět.',
    tldr: [
      'Menopauza je poslední menstruace, v průměru kolem 51 let. Přechodné období před ní (perimenopauza) trvá i několik let.',
      'Návaly horka a noční pocení trvají v průměru přes 7 let — u žen, kterým začaly brzy, často déle.',
      'Nejúčinnější léčbou návalů je hormonální terapie. U zdravých žen do 60 let nebo do 10 let od menopauzy obvykle převažují přínosy nad riziky.',
    ],
    numbers: [
      { value: '~51 let', label: 'průměrný věk menopauzy' },
      { value: '7,4 roku', label: 'medián trvání návalů (studie SWAN)' },
      { value: '12 měsíců', label: 'bez menstruace — teprve pak je to menopauza' },
    ],
    how: [
      {
        title: 'Vaječníky zpomalují',
        text: 'V perimenopauze estrogen a progesteron nejdřív kolísají — proto bývá cyklus nepravidelný — a pak trvale klesnou. Menopauza se určuje zpětně, po roce bez menstruace.',
      },
      {
        title: 'Proč přicházejí návaly',
        text: 'Pokles estrogenu zúží „termostatové“ pásmo v hypotalamu. I malé zvýšení tělesné teploty pak spustí rozšíření cév v kůži a pocení — náhlé horko, zčervenání, v noci probouzení.',
      },
      {
        title: 'Kosti a srdce',
        text: 'Bez estrogenu se v prvních letech po menopauze zrychlí úbytek kostní hmoty a mění se cholesterol. Pohyb, posilování a preventivní prohlídky mají od teď ještě větší váhu.',
      },
    ],
    today: [
      'Na sítích a v e-shopech se nabízejí „bioidentické“ krémy, byliny a doplňky na přechod se sliby, které studie nepotvrdily.',
      'Hodně žen potíže roky snáší, protože neví, že se dají léčit — nebo se hormonů bojí kvůli starším, dnes jinak vykládaným studiím.',
    ],
    helps: [
      {
        text: 'Hormonální terapie od gynekologa — nejúčinnější na návaly a noční pocení. Lékař posoudí věk, dobu od menopauzy a vaše rizika.',
        level: 'established',
      },
      {
        text: 'Nehormonální léky na návaly na předpis — pro ženy, které hormony užívat nemohou nebo nechtějí.',
        level: 'established',
      },
      {
        text: 'Kognitivně-behaviorální terapie (i ve formě svépomocné knihy) — zmírní, jak moc návaly obtěžují, a zlepší spánek.',
        level: 'established',
      },
      {
        text: 'Pravidelný pohyb a posilování aspoň 2× týdně — pro kosti, svaly, srdce i náladu.',
        level: 'established',
      },
      {
        text: 'K lékaři při velmi silném nebo nepravidelném krvácení v perimenopauze a vždy při jakémkoli krvácení po menopauze.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Hormonální terapie je nebezpečná pro každou ženu.',
        fact: 'Rizika závisí na věku, době od menopauzy, typu léčby a zdravotním stavu. U zdravých žen do 60 let obvykle převažují přínosy — rozhoduje se s lékařem individuálně.',
      },
      {
        myth: 'Byliny a sójové fytoestrogeny spolehlivě zastaví návaly.',
        fact: 'Odborná společnost pro menopauzu je kvůli slabým a nejednotným důkazům nedoporučuje. Ověřené jsou hormonální a nehormonální léky a terapie.',
      },
      {
        myth: 'Návaly přejdou za pár měsíců.',
        fact: 'Ve velké studii trvaly v průměru 7,4 roku. U žen, kterým začaly ještě před poslední menstruací, často přes 10 let.',
      },
    ],
    related: [
      { label: 'Menstruační cyklus', href: '/jak-funguje-telo/menstruacni-cyklus' },
      { label: 'Kosti', href: '/jak-funguje-telo/kosti' },
      { label: 'Vápník', href: '/doplnky/vapnik' },
      { label: 'Vitamín D', href: '/doplnky/vitamin-d' },
    ],
    sources: [SOURCES.avisVms, SOURCES.nams2022, SOURCES.nams2023, SOURCES.ayersCbt],
  },
  {
    slug: 'dlouhovekost',
    title: 'Dlouhověkost: co doopravdy prodlužuje život',
    short: 'Dlouhověkost',
    icon: 'hourglass',
    hook: 'Žádná pilulka proti stárnutí zatím nefunguje. Pět obyčejných návyků ale ve velké studii přidalo ženám 14 a mužům 12 let života.',
    tldr: [
      'Geny rozhodují o délce života méně, než se myslí — podle velké analýzy zhruba z méně než 10 %.',
      'Nekouřit, hýbat se, jíst kvalitně, držet zdravou váhu a pít málo alkoholu: dohromady to ve studii přidalo ženám 14 a mužům 12 let.',
      'Kondice a síla patří k nejsilnějším ukazatelům, jak dlouho a v jakém zdraví budete žít.',
    ],
    numbers: [
      { value: '+14 / +12 let', label: 'života navíc pro ženy / muže s pěti zdravými návyky' },
      { value: '< 10 %', label: 'délky života vysvětlí geny' },
      { value: '5 kg', label: 'slabší stisk ruky = zhruba o 16–20 % vyšší riziko úmrtí' },
    ],
    how: [
      {
        title: 'Návyky se sčítají',
        text: 'Ve studii se 120 000 lidmi každý zdravý návyk snížil riziko předčasného úmrtí a dohromady jejich účinek rostl. Nejvíc ze všeho přidá nekouření.',
      },
      {
        title: 'Kondice jako životní pojistka',
        text: 'V testech na běžeckém pásu měli lidé s nejnižší kondicí výrazně vyšší riziko úmrtí než ti nejzdatnější — rozdíl byl větší než u kouření nebo cukrovky. Horní hranice přínosu se nenašla.',
      },
      {
        title: 'Síla drží soběstačnost',
        text: 'Svaly a síla s věkem ubývají. Slabší stisk ruky souvisel s vyšším rizikem srdečních nemocí i úmrtí — síla je proto dobrý ukazatel celkového zdraví, nejen vzhledu.',
      },
    ],
    today: [
      'Sítě a e-shopy prodávají „anti-aging“ doplňky (NMN, resveratrol, „biohacking“ protokoly). Prodloužení života u lidí žádný z nich neprokázal.',
      'Sedavý život bere kondici i sílu dřív, než si toho všimneme — a obojí se s věkem hůř dohání.',
    ],
    helps: [
      {
        text: 'Nekouřit — největší jednotlivý přínos pro délku života v jakémkoli věku.',
        level: 'established',
      },
      {
        text: 'Pravidelný vytrvalostní pohyb (150–300 min týdně) a k tomu něco náročnějšího, co zlepší kondici.',
        level: 'established',
      },
      { text: 'Posilovat aspoň 2× týdně — udrží svaly, sílu a soběstačnost ve stáří.', level: 'established' },
      {
        text: 'Strava s převahou zeleniny, ovoce, luštěnin, celozrnných potravin a ořechů; málo ultrazpracovaného jídla.',
        level: 'established',
      },
      { text: 'Pravidelný spánek a blízké vztahy — obojí souvisí s delším životem.', level: 'plausible' },
      {
        text: 'Preventivní prohlídky (tlak, cholesterol, cukr, screeningy rakoviny) — zachytí to, co nebolí.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Délka života je hlavně v genech.',
        fact: 'Analýza rodokmenů milionů lidí odhadla dědičnost délky života pod 10 %. Většina je v rukou návyků a prostředí.',
      },
      {
        myth: 'Existuje doplněk, který zpomalí stárnutí.',
        fact: 'U lidí zatím žádný doplněk prodloužení života neprokázal. Nejsilnější ověřené „anti-aging“ jsou pohyb, nekouření a spánek.',
      },
      {
        myth: 'Na změnu je pozdě, když je mi přes 60.',
        fact: 'Přestat kouřit, začít chodit nebo posilovat se vyplatí v jakémkoli věku — i lidé přes 80 let zesílí.',
      },
    ],
    related: [
      { label: 'Svaly a metabolismus', href: '/jak-funguje-telo/svaly-a-metabolismus' },
      { label: 'Pohyb a sezení', href: '/jak-funguje-telo/pohyb-a-sezeni' },
      { label: 'Samota a vztahy', href: '/jak-funguje-telo/samota-a-vztahy' },
      { label: 'Nikotin a vaping', href: '/jak-funguje-telo/nikotin-a-vaping' },
    ],
    sources: [SOURCES.liLifestyle, SOURCES.mandsager, SOURCES.gripStrength, SOURCES.rubyHeritability],
  },
  {
    slug: 'vysledky-krve',
    title: 'Výsledky krve: jak jim rozumět a kdy zbystřit',
    short: 'Výsledky krve',
    icon: 'test-tube',
    hook: 'Hvězdička u výsledku ještě neznamená nemoc a „v normě“ neznamená, že je všechno v pořádku. Jak číst laboratorní zprávu s rozumem.',
    tldr: [
      'Referenční rozmezí pokrývá 95 % zdravých lidí — takže zhruba každá dvacátá hodnota zdravého člověka z něj vybočí.',
      'Rozmezí se liší mezi laboratořemi a jednotkami. Srovnávejte vždy s rozmezím na vlastní zprávě.',
      'Víc než jedna hodnota říká trend v čase a souvislosti — výsledky vždy vykládá lékař.',
    ],
    numbers: [
      { value: '95 %', label: 'zdravých lidí je uvnitř referenčního rozmezí' },
      { value: '~64 %', label: 'šance, že u zdravého člověka bude z 20 testů aspoň jeden „mimo“' },
      { value: '48 mmol/mol', label: 'HbA1c, od kterého jde o cukrovku (WHO)' },
    ],
    how: [
      {
        title: 'Jak vzniká „norma“',
        text: 'Laboratoř změří velkou skupinu zdravých lidí a za rozmezí vezme prostředních 95 % hodnot. Hodnota těsně mimo je proto u zdravých častá, hodnota daleko mimo už je signál.',
      },
      {
        title: 'Hodnoty kolísají',
        text: 'Výsledek ovlivní denní doba, jídlo, tekutiny, nemoc i tvrdý trénink den předem. Jedno odchýlené číslo se proto obvykle nejdřív zopakuje.',
      },
      {
        title: 'Souvislosti rozhodují',
        text: 'Feritin pod 15 µg/l u dospělého podle WHO znamená vyčerpané zásoby železa. Při zánětu ale feritin stoupá, takže „normální“ hodnota nedostatek může zakrýt — proto lékař čte výsledky dohromady.',
      },
    ],
    today: [
      'Komerční balíčky „velkého krevního obrazu“ bez lékaře přinášejí hodně čísel a s nimi i zbytečné obavy z hodnot těsně mimo rozmezí.',
      'Výsledky dnes často přijdou do mobilu dřív, než je vidí lékař — bez vysvětlení, co znamenají.',
    ],
    helps: [
      {
        text: 'Na cukr chodit nalačno; na cholesterol to podle evropského konsenzu obvykle nutné není.',
        level: 'established',
      },
      {
        text: 'Den před odběrem vynechat tvrdý trénink a alkohol a ráno se napít vody — výsledky budou srovnatelnější.',
        level: 'plausible',
      },
      {
        text: 'Sledovat své hodnoty v čase a odebírat ideálně ve stejné laboratoři a denní době.',
        level: 'plausible',
      },
      {
        text: 'Výsledky probrat s lékařem — hlavně hodnoty daleko mimo rozmezí nebo několik odchylek najednou.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Hodnota mimo rozmezí znamená nemoc.',
        fact: 'Rozmezí je postavené tak, že 1 z 20 zdravých lidí je mimo. Rozhoduje, jak daleko, jestli se odchylka opakuje a co k tomu říkají příznaky.',
      },
      {
        myth: '„V normě“ znamená, že je všechno v pořádku.',
        fact: 'Ne vždy. Třeba feritin při zánětu stoupá a nedostatek železa zakryje. U cholesterolu je cíl podle rizika často nižší než horní hranice rozmezí.',
      },
      {
        myth: 'Čím víc vyšetření, tím líp.',
        fact: 'Každý test navíc zvyšuje šanci na náhodnou odchylku a další zbytečná vyšetření. Smysl mají testy, které odpovídají vaší situaci.',
      },
    ],
    related: [
      { label: 'Výsledky si můžete uložit v aplikaci', href: '/login?mode=signup' },
      { label: 'Cholesterol', href: '/jak-funguje-telo/cholesterol' },
      { label: 'Cukr a inzulin', href: '/jak-funguje-telo/cukr-a-inzulin' },
      { label: 'Železo', href: '/doplnky/zelezo' },
    ],
    sources: [SOURCES.ozardaRi, SOURCES.nordestgaard, SOURCES.whoFerritin, SOURCES.whoHba1c],
  },
  {
    slug: 'nalada-a-uzkost',
    title: 'Nálada a úzkost: kdy je to normální a kdy hledat pomoc',
    short: 'Nálada a úzkost',
    icon: 'smile',
    hook: 'Smutek a nervozita patří k životu. Když ale trvají týdny a berou vám radost, je to zdravotní problém — a dá se léčit.',
    tldr: [
      'Duševní poruchou žije podle WHO téměř každý sedmý člověk; nejčastější jsou úzkost a deprese.',
      'Pohyb je účinná součást léčby deprese — chůze, běh, jóga i posilování.',
      'Psychoterapie a léky fungují. Říct si o pomoc je síla, ne selhání.',
    ],
    numbers: [
      { value: '1 ze 7', label: 'lidí žije s duševní poruchou (WHO)' },
      { value: '116 123', label: 'Linka první psychické pomoci' },
    ],
    how: [
      {
        title: 'Úzkost',
        text: 'Je to poplašný systém mozku — užitečný, když hrozí nebezpečí. U úzkostné poruchy se spouští příliš často a silně, i když hrozba není.',
      },
      {
        title: 'Deprese',
        text: 'Není to jen smutek. Patří k ní ztráta radosti a zájmu, únava, změny spánku a chuti k jídlu, pocit viny nebo beznaděje — trvající aspoň dva týdny.',
      },
      {
        title: 'Tělo a mysl',
        text: 'Spánek, pohyb, alkohol i vztahy ovlivňují náladu přímo přes mozek a hormony. Proto pomáhá i to, co na první pohled „psychické“ není.',
      },
      {
        title: 'Past vyhýbání',
        text: 'U úzkosti se člověk vyhne tomu, čeho se bojí, a hned se mu uleví. Mozek se tím ale naučí, že hrozba byla skutečná — a příště je strach větší. Proto terapie úzkosti učí po malých krocích strach vydržet.',
      },
    ],
    today: [
      'Srovnávání na sítích, stálá dostupnost a nejistota (škola, práce, bydlení) zvyšují tlak.',
      'Mladí lidé častěji mluví o duševním zdraví otevřeně — a to je dobře.',
    ],
    helps: [
      {
        text: 'Pravidelný pohyb — v mnoha studiích snižuje příznaky deprese a úzkosti.',
        level: 'established',
      },
      {
        text: 'Psychoterapie (např. kognitivně-behaviorální) a při potřebě léky od lékaře.',
        level: 'established',
      },
      { text: 'Pravidelný spánek a méně alkoholu.', level: 'plausible' },
      { text: 'Mluvit s někým blízkým; nebýt s tím sám.', level: 'plausible' },
      {
        text: 'Při depresi nečekat, až přijde chuť: naplánovat si malé činnosti, které dřív bavily nebo mají smysl, a udělat je. Tato „behaviorální aktivace“ je ověřená součást léčby.',
        level: 'established',
      },
      {
        text: 'V krizi volat: Linka první psychické pomoci 116 123, Linka bezpečí 116 111 (do 26 let), v ohrožení života 155 nebo 112.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Stačí se vzchopit.',
        fact: 'Deprese není lenost ani slabá vůle. Je to nemoc, která potřebuje léčbu jako jakákoli jiná.',
      },
      {
        myth: 'Psycholog je jen pro „blázny“.',
        fact: 'Psychologa navštěvuje spousta lidí s běžnými problémy — stresem, vztahy, úzkostí.',
      },
      {
        myth: 'Antidepresiva si můžu kdykoli vysadit.',
        fact: 'Vysazovat je potřeba postupně a po domluvě s lékařem, jinak můžou přijít nepříjemné příznaky.',
      },
    ],
    related: [
      { label: 'Stres', href: '/jak-funguje-telo/stres' },
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
      { label: 'Dopamin a mobil', href: '/jak-funguje-telo/dopamin-a-mobil' },
    ],
    sources: [SOURCES.whoMental, SOURCES.noetel, SOURCES.singhPA, SOURCES.cuijpersBA],
  },
  {
    slug: 'zuby-a-usta',
    title: 'Zuby a ústa: kaz není o cukru, ale o tom, jak často',
    short: 'Zuby',
    icon: 'tooth',
    hook: 'Proč je horší celý den usrkávat limonádu než sníst jeden dezert, a co doopravdy dělá fluorid.',
    tldr: [
      'Bakterie v plaku z cukru vyrábějí kyselinu, která rozpouští sklovinu — rozhoduje hlavně, jak často cukr přijde.',
      'Pasta s fluoridem (aspoň 1 000 ppm) prokazatelně chrání před kazem.',
      'Nemoci zubů a dásní má podle WHO téměř 3,7 miliardy lidí — neléčený zubní kaz je nejčastější zdravotní potíž na světě.',
    ],
    numbers: [
      { value: '2× denně', label: 'čistit 2 minuty' },
      { value: '1 000+ ppm', label: 'fluoridu v pastě pro dospělé' },
      { value: '3,7 mld.', label: 'lidí s nemocí zubů či dásní (WHO)' },
    ],
    how: [
      {
        title: 'Kyselý útok',
        text: 'Po každém sladkém jídle nebo pití je v ústech zhruba půl hodiny kyselo. Sliny pak zuby znovu „opraví“ — pokud mají čas.',
      },
      {
        title: 'Fluorid',
        text: 'Pomáhá sklovině se opravovat a dělá ji odolnější proti kyselinám.',
      },
      {
        title: 'Dásně',
        text: 'Plak u dásní způsobí zánět — krvácení při čištění. Neléčený může vést až k uvolnění zubů.',
      },
      {
        title: 'Ústa a zbytek těla',
        text: 'Zánět dásní a cukrovka se navzájem zhoršují. U lidí s diabetem léčba dásní snížila dlouhodobý cukr (HbA1c) zhruba o 0,4 procentního bodu — podobně jako přidání dalšího léku.',
      },
    ],
    today: [
      'Energetické a sportovní nápoje a slazená káva během celého dne znamenají kyselý útok za útokem.',
      'Sítě propagují „přírodní“ pasty bez fluoridu a s aktivním uhlím, které můžou sklovinu obrušovat.',
      'Kyselé nápoje (cola, džusy, ochucené vody) leptají sklovinu i bez cukru — tomu se říká eroze.',
    ],
    helps: [
      { text: 'Čistit 2× denně fluoridovou pastou.', level: 'established' },
      {
        text: 'Po čištění pastu vyplivnout, nevyplachovat vodou — fluorid zůstane déle.',
        level: 'plausible',
      },
      { text: 'Sladké a kyselé nápoje omezit a nepít je po douškách celý den.', level: 'established' },
      {
        text: 'Mezizubní kartáčky nebo nit — můžou trochu pomoct dásním, ale důkazy jsou zatím slabé.',
        level: 'preliminary',
      },
      { text: 'Preventivní prohlídky u zubaře a dentální hygiena.', level: 'plausible' },
      {
        text: 'Elektrický kartáček s rotační hlavou odstraní o něco víc plaku a víc zklidní dásně než ruční.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Pasta bez fluoridu je zdravější.',
        fact: 'Fluorid v pastě je bezpečný a jedna z nejlépe ověřených ochran proti kazu.',
      },
      {
        myth: 'Krvácení dásní je normální.',
        fact: 'Je to známka zánětu. Lepší čištění u dásní ho obvykle během pár týdnů zlepší.',
      },
    ],
    related: [
      { label: 'Cukr a inzulin', href: '/jak-funguje-telo/cukr-a-inzulin' },
      { label: 'Energie a kofein', href: '/jak-funguje-telo/energie-a-kofein' },
    ],
    sources: [
      SOURCES.walshFluoride,
      SOURCES.worthington,
      SOURCES.whoOral,
      SOURCES.whoSugar,
      SOURCES.poweredBrush,
      SOURCES.perioDiabetes,
    ],
  },
  {
    slug: 'kosti',
    title: 'Kosti: banka, do které se ukládá do třiceti',
    short: 'Kosti',
    icon: 'skeleton',
    hook: 'Kost je živá tkáň, která se pořád přestavuje. Kolik si jí „naspoříte“ v mládí, rozhoduje o zlomeninách ve stáří.',
    tldr: [
      'Nejvíc kostní hmoty mají lidé zhruba ve 25–30 letech; potom už jde hlavně o její udržení.',
      'Kosti posiluje zátěž — skoky, běh a posilování. Plavání a kolo méně.',
      'Vápník, vitamín D a bílkoviny jsou stavební materiál; kouření a alkohol kostem škodí.',
    ],
    numbers: [
      { value: '~25–30', label: 'let: vrchol kostní hmoty' },
      { value: '−23 %', label: 'pádů u starších lidí díky cvičení rovnováhy a síly' },
    ],
    how: [
      {
        title: 'Stálá přestavba',
        text: 'Jedny buňky kost odbourávají, jiné ji stavějí. V mládí převažuje stavba, ve stáří odbourávání.',
      },
      {
        title: 'Zátěž jako signál',
        text: 'Kost reaguje na náraz a tah svalů — kde je zátěž, tam zesílí. Bez zátěže (sezení, kosmonauti) slábne.',
      },
      {
        title: 'Materiál',
        text: 'Vápník dodává pevnost, vitamín D pomáhá ho vstřebat, bílkoviny tvoří kostní kostru.',
      },
      {
        title: 'Zlomenina = slabší kost + pád',
        text: 'Většina zlomenin ve stáří vzniká při obyčejném pádu. Chránit kosti proto znamená i udržet sílu nohou a rovnováhu.',
      },
    ],
    today: [
      'Málo pohybu v dětství a dospívání znamená nižší „úspory“ kostní hmoty na celý život.',
      'Velmi nízký příjem energie (přísné diety, vytrvalostní sport bez dost jídla) může kosti oslabit.',
    ],
    helps: [
      { text: 'Skoky, běh, sporty s míčem a posilování — hlavně v dětství a mládí.', level: 'established' },
      {
        text: 'Silový a dopadový trénink pomáhá i v dospělosti — i u žen po menopauze s řídnutím kostí, pod vedením.',
        level: 'plausible',
      },
      { text: 'Dost vápníku a vitamínu D (v zimě doplněk) a bílkovin.', level: 'established' },
      { text: 'Nekouřit a omezit alkohol.', level: 'plausible' },
      {
        text: 'Ve vyšším věku cvičit rovnováhu a sílu (třeba tai-chi nebo cviky na stabilitu) — pádů je pak asi o čtvrtinu méně.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Pro kosti stačí pít mléko.',
        fact: 'Vápník je potřeba, ale bez zátěže kost nezesílí. Vápník lze získat i z jiných potravin.',
      },
      { myth: 'Řídnutí kostí je jen problém babiček.', fact: 'Základ se buduje v mládí a týká se i mužů.' },
      {
        myth: 'Vysoké dávky vitamínu D chrání každého před zlomeninami.',
        fact: 'U zdravých lidí bez nedostatku 2 000 IU denně zlomeniny nesnížilo (studie VITAL, přes 25 000 lidí). Smysl má hlavně při prokázaném nedostatku.',
      },
    ],
    related: [
      { label: 'Vápník', href: '/doplnky/vapnik' },
      { label: 'Vitamín D', href: '/doplnky/vitamin-d' },
      { label: 'Kosti v mapě těla', href: '/organ/bones' },
    ],
    sources: [SOURCES.weaver, SOURCES.watson, SRC.euRegister, SOURCES.sherrington, SOURCES.leboff],
  },
  {
    slug: 'dychani',
    title: 'Dýchání: nos, pomalý výdech a proč nepřelepovat pusu',
    short: 'Dýchání',
    icon: 'wind',
    hook: 'Breathwork a přelepování úst na spaní jsou trend. Co dýchání opravdu umí a kdy je chrápání varování.',
    tldr: [
      'Nos vzduch ohřeje, zvlhčí a přefiltruje; dýchání nosem je pro běžný den přirozené.',
      'Pomalé dýchání (kolem 6 dechů za minutu) v malých studiích uklidňuje.',
      'Přelepování úst na spaní nemá dobré důkazy — a při ucpaném nosu může být nebezpečné.',
    ],
    numbers: [
      { value: '~6/min', label: 'pomalé dýchání ve studiích' },
      { value: '~1 mld.', label: 'dospělých ve věku 30–69 let se spánkovou apnoí (odhad)' },
    ],
    how: [
      {
        title: 'Řízení dechu',
        text: 'Dýchání řídí hlavně hladina oxidu uhličitého v krvi, ne kyslíku. Proto zrychlené „hluboké“ dýchání může způsobit točení hlavy a brnění.',
      },
      {
        title: 'Dech a nervy',
        text: 'Pomalý a delší výdech posiluje „uklidňující“ část nervové soustavy — tep se zpomalí a kolísá víc.',
      },
      {
        title: 'Spánková apnoe',
        text: 'Při ní se v noci opakovaně zavírají dýchací cesty. Projevuje se hlasitým chrápáním, zástavami dechu a únavou přes den — a souvisí s vysokým tlakem.',
      },
    ],
    today: [
      'Na sítích se prodávají pásky na pusu a dechová cvičení jako lék na všechno.',
      'Mnoho lidí se spánkovou apnoí o ní neví.',
    ],
    helps: [
      { text: 'Pár minut pomalého dýchání s delším výdechem při stresu.', level: 'preliminary' },
      { text: 'Při ucpaném nosu nebo alergii řešit příčinu (lékař, lékárna).', level: 'plausible' },
      {
        text: 'Při hlasitém chrápání, zástavách dechu a denní únavě jít k lékaři — apnoe se dá léčit.',
        level: 'established',
      },
      {
        text: 'Dechová cvičení se zadržováním dechu nikdy nezkoušet ve vodě ani za volantem — po rychlém dýchání se dá omdlít bez varování.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Přelepená pusa zlepší spánek.',
        fact: 'Přehled 10 malých studií přesvědčivý přínos nenašel. Při ucpaném nosu hrozí, že se nebudete moct pořádně nadechnout — a neléčenou apnoe páska nevyřeší.',
      },
      {
        myth: 'Čím hlouběji a rychleji dýchám, tím víc kyslíku.',
        fact: 'Krev je kyslíkem nasycená i normálně. Rychlé dýchání spíš sníží oxid uhličitý a může vyvolat závrať.',
      },
      {
        myth: 'Při panice pomůže dýchat do papírového sáčku.',
        fact: 'Už se nedoporučuje: může snížit kyslík v krvi a zakrýt jinou příčinu dušnosti (astma, srdce). Lepší je zpomalit a prodloužit výdech.',
      },
    ],
    related: [
      { label: 'Stres', href: '/jak-funguje-telo/stres' },
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
      { label: 'Plíce v mapě těla', href: '/organ/lungs' },
    ],
    sources: [SOURCES.zaccaro, SOURCES.rhee, SOURCES.benjafield, SOURCES.paperBag],
  },
  {
    slug: 'akne-a-plet',
    title: 'Akné: co ho způsobuje a co na něj opravdu platí',
    short: 'Akné',
    icon: 'sparkles',
    hook: 'Akné není ze špíny ani z lenosti. Je to běžné onemocnění kůže — a dá se dobře léčit.',
    tldr: [
      'Akné vzniká v mazové žláze: víc mazu, ucpaný vývod, bakterie a zánět.',
      'Nejlépe ověřená léčba je benzoylperoxid a retinoidy na kůži; u těžšího akné tablety od lékaře.',
      'Strava hraje menší roli, než tvrdí internet — u části lidí může přitížit mléko a sladké.',
    ],
    numbers: [
      { value: '~9 %', label: 'lidí na světě má akné (odhad)' },
      { value: '2–3 měsíce', label: 'na plný účinek léčby' },
    ],
    how: [
      {
        title: 'Hormony a maz',
        text: 'V pubertě hormony (androgeny) rozjedou mazové žlázy. Mazu je víc a kůže ve vývodu se snáz ucpe — vznikne černá nebo bílá tečka.',
      },
      {
        title: 'Bakterie a zánět',
        text: 'V ucpaném vývodu se množí bakterie, které na kůži žijí běžně. Imunita zareaguje zánětem — z tečky je červený pupínek.',
      },
      {
        title: 'Jizvy a skvrny',
        text: 'Hluboký zánět nebo mačkání může poškodit kůži. Zůstanou tmavé skvrny nebo jizvy — proto se vyplatí léčit včas.',
      },
    ],
    today: [
      'Na TikToku se šíří „hacky“ jako zubní pasta na pupínek nebo drhnutí kůže. Kůži spíš podráždí.',
      'Filtry a retuš na sítích vytvářejí dojem, že normální kůže nemá póry ani pupínky.',
    ],
    helps: [
      {
        text: 'Benzoylperoxid nebo retinoid (adapalen) na kůži — pravidelně a aspoň 2–3 měsíce.',
        level: 'established',
      },
      {
        text: 'U středního a těžkého akné nebo jizev zajít k lékaři; existují účinné tablety včetně isotretinoinu.',
        level: 'established',
      },
      { text: 'Jemné mytí 2× denně a nekomedogenní kosmetika místo drhnutí.', level: 'plausible' },
      {
        text: 'Zkusit méně mléka a sladkého, pokud máte pocit, že vám přitěžují.',
        level: 'preliminary',
      },
      {
        text: 'U žen může pomoct kombinovaná hormonální antikoncepce — proberte s gynekologem nebo dermatologem.',
        level: 'established',
      },
      {
        text: 'Při léčbě retinoidy denně opalovací krém — kůže je citlivější na slunce.',
        level: 'plausible',
      },
    ],
    myths: [
      {
        myth: 'Akné je ze špinavé pleti.',
        fact: 'Vzniká uvnitř mazové žlázy. Časté drhnutí a agresivní přípravky kůži spíš podráždí.',
      },
      {
        myth: 'Pupínek je nejlepší vymáčknout.',
        fact: 'Mačkání zanese zánět hlouběji a zvyšuje riziko skvrn a jizev.',
      },
      {
        myth: 'Zubní pasta pupínek vysuší.',
        fact: 'Pasta není lék na kůži a často ji podráždí. Účinné látky jsou jiné — benzoylperoxid nebo retinoidy.',
      },
      {
        myth: 'Akné po pubertě samo zmizí.',
        fact: 'Často ano, ale u řady lidí — hlavně žen — přetrvává i po dvacítce nebo se objeví nově. I pak se dá léčit.',
      },
    ],
    related: [
      { label: 'Kůže a slunce', href: '/jak-funguje-telo/kuze-a-slunce' },
      { label: 'Cukr a inzulin', href: '/jak-funguje-telo/cukr-a-inzulin' },
      { label: 'Looksmaxing', href: '/looksmaxing' },
    ],
    sources: [SOURCES.reynoldsAcne, SOURCES.tanAcne, SOURCES.juhlDairy, SOURCES.smithGL, SOURCES.cocAcne],
  },
  {
    slug: 'bolest-hlavy',
    title: 'Bolest hlavy a migréna: kdy stačí klid a kdy k lékaři',
    short: 'Bolest hlavy',
    icon: 'storm',
    hook: 'Poruchou s bolestí hlavy trpí asi 40 % lidí. Většinou není nebezpečná — ale příliš mnoho prášků ji umí zhoršit.',
    tldr: [
      'Nejčastější je tenzní bolest hlavy a migréna; vážná příčina je vzácná.',
      'U lidí, kteří bolestmi hlavy trpí, může časté užívání prášků (zhruba 10–15 a víc dní v měsíci déle než 3 měsíce) bolest hlavy samo vyvolávat.',
      'Častou migrénu jde léčit i preventivně — nemusíte ji jen „přetrpět“.',
    ],
    numbers: [
      { value: '~40 %', label: 'lidí na světě má poruchu s bolestí hlavy (WHO)' },
      { value: '4–72 h', label: 'trvá neléčený záchvat migrény' },
    ],
    how: [
      {
        title: 'Tenzní bolest',
        text: 'Tlaková bolest „jako obruč“ po obou stranách hlavy. Bývá spojená se stresem, únavou a napětím v šíji.',
      },
      {
        title: 'Migréna',
        text: 'Onemocnění mozku, ne jen silnější bolest. Pulzující bolest často na jedné straně, nevolnost, citlivost na světlo a zvuk. Někdy jí předchází aura — mžitky nebo brnění.',
      },
      {
        title: 'Bolest z nadužívání léků',
        text: 'Když se prášky proti bolesti berou skoro denně, mozek se jim přizpůsobí a bolest se vrací častěji. Pomáhá řízené vysazení s lékařem.',
      },
    ],
    today: [
      'Dlouhé sezení u obrazovky, málo spánku a vynechané jídlo patří k častým spouštěčům.',
      'Lidé si běžně kupují prášky bez receptu a neví, že jejich časté užívání bolest prodlužuje.',
    ],
    helps: [
      {
        text: 'Prášky proti bolesti brát nejvýš pár dní v měsíci; při častější bolesti řešit prevenci s lékařem.',
        level: 'established',
      },
      {
        text: 'Okamžitě k lékaři při náhlé „nejhorší bolesti v životě“, horečce se ztuhlou šíjí, poruše řeči nebo hybnosti či bolesti po úrazu.',
        level: 'established',
      },
      { text: 'Pravidelný spánek a jídlo, dost tekutin a pohyb.', level: 'plausible' },
      { text: 'Deník bolesti hlavy — pomůže najít spouštěče a lékaři zvolit léčbu.', level: 'plausible' },
      {
        text: 'Při migréně pravidelný aerobní pohyb (40 minut 3× týdně) — ve studii snížil počet záchvatů podobně jako preventivní lék.',
        level: 'preliminary',
      },
    ],
    myths: [
      {
        myth: 'Migréna je jen silnější bolest hlavy.',
        fact: 'Je to neurologické onemocnění s nevolností, citlivostí na světlo a někdy aurou. Patří mezi hlavní příčiny let prožitých s postižením.',
      },
      {
        myth: 'Víc prášků znamená míň bolesti.',
        fact: 'Časté užívání vede k bolesti hlavy z nadužívání léků — bolest se pak vrací častěji.',
      },
      {
        myth: 'Častá bolest hlavy znamená nádor.',
        fact: 'Velmi vzácně. Pozor si dejte na varovné příznaky — ty patří k lékaři hned.',
      },
      {
        myth: 'Na migrénu nic nepomáhá, musím ji vydržet.',
        fact: 'Existují léky na záchvat (např. triptany) i preventivní léčba včetně novějších léků. Migréna patří k praktickému lékaři nebo neurologovi.',
      },
    ],
    related: [
      { label: 'Stres', href: '/jak-funguje-telo/stres' },
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
      { label: 'Oči a obrazovky', href: '/jak-funguje-telo/oci-a-obrazovky' },
    ],
    sources: [SOURCES.whoHeadache, SOURCES.ashinaMigraine, SOURCES.ashinaMOH, SOURCES.varkey],
  },
  {
    slug: 'prerusovany-pust',
    title: 'Přerušovaný půst: funguje 16:8 lépe než obyčejná dieta?',
    short: 'Přerušovaný půst',
    icon: 'timer',
    hook: 'Jíst jen v osmihodinovém okně je hit sociálních sítí. Studie ukazují, že kouzlo je hlavně v tom, že sníte méně.',
    tldr: [
      'Přerušovaný půst je způsob, jak jíst méně — ne zvláštní „spalovací“ režim.',
      'V ročních studiích lidé s časovým oknem zhubli podobně jako s běžným omezením kalorií.',
      'Hodí se tomu, komu vyhovuje. Pro dospívající, těhotné, lidi s poruchou příjmu potravy nebo na lécích na cukrovku jen po poradě s lékařem.',
    ],
    numbers: [
      { value: '16:8', label: '16 h bez jídla, 8 h okno' },
      { value: '12 měsíců', label: 'trvala studie bez rozdílu proti dietě' },
    ],
    how: [
      {
        title: 'Co se děje během půstu',
        text: 'Zhruba po 12 a více hodinách bez jídla tělo víc sahá po tuku a játra tvoří víc ketolátek. Mírně se to děje už přes noc.',
      },
      {
        title: 'Proč se hubne',
        text: 'Kratší okno obvykle znamená méně jídla. Tuk ubývá, když energie dlouhodobě chybí — časové okno je jen nástroj, jak toho dosáhnout.',
      },
      {
        title: 'Co ukázaly studie',
        text: 'Ve studii TREAT lidé s oknem 16:8 nezhubli o nic významně víc než kontrolní skupina. V roční studii v NEJM časové okno nepřidalo nic navíc k obyčejnému omezení kalorií.',
      },
    ],
    today: [
      'Influenceři slibují „autofagii“ a „reset metabolismu“. U lidí to studie jako přínos pro hubnutí nepotvrdily.',
      'Snídaně se vynechává z pohodlí — a pak se večer dojídá.',
    ],
    helps: [
      {
        text: 'Pokud vám okno pomáhá jíst méně a vydržíte ho, je to stejně dobrá cesta jako jiná.',
        level: 'established',
      },
      { text: 'V okně jíst plnohodnotně: bílkoviny, zelenina, vláknina.', level: 'plausible' },
      { text: 'Při silném hladu, točení hlavy nebo přejídání v okně režim nedržet.', level: 'plausible' },
      {
        text: 'Dost bílkovin a posilování — aby ubýval tuk, ne svaly.',
        level: 'plausible',
      },
    ],
    myths: [
      {
        myth: 'Přerušovaný půst spaluje tuk lépe než jiné diety.',
        fact: 'Při stejném příjmu kalorií studie velký rozdíl nenašly.',
      },
      {
        myth: 'Snídaně je nejdůležitější jídlo dne.',
        fact: 'Metaanalýza randomizovaných studií nezjistila, že by snídaně pomáhala hubnout. Rozhoduje celková strava.',
      },
      {
        myth: 'Při půstu se hubne čistý tuk.',
        fact: 'Ve studii TREAT tvořila podstatnou část úbytku i svalová hmota. Proto je důležité jíst v okně dost bílkovin a cvičit.',
      },
    ],
    related: [
      { label: 'Hubnutí a energie', href: '/jak-funguje-telo/hubnuti-a-energie' },
      { label: 'Cukr a inzulin', href: '/jak-funguje-telo/cukr-a-inzulin' },
      { label: 'Svaly a metabolismus', href: '/jak-funguje-telo/svaly-a-metabolismus' },
    ],
    sources: [SOURCES.loweTRE, SOURCES.liuTRE, SOURCES.decabo, SOURCES.sievert],
  },
  {
    slug: 'samota-a-vztahy',
    title: 'Samota a vztahy: proč jsou lidé kolem vás zdraví',
    short: 'Samota a vztahy',
    icon: 'users',
    hook: 'Jsme propojení víc než kdy dřív, a přesto se cítí osamělý každý šestý člověk. Nejvíc mladí.',
    tldr: [
      'Dobré vztahy souvisí s delším životem podobně silně jako známé faktory, třeba kouření.',
      'Osamělost je pocit, že vám chybí blízkost — můžete ji cítit i mezi lidmi.',
      'Podle WHO se cítí osamělých 17–21 % lidí ve věku 13–29 let, nejvíc teenageři.',
    ],
    numbers: [
      { value: '1 z 6', label: 'lidí na světě se cítí osamělý (WHO)' },
      { value: '871 000', label: 'úmrtí ročně spojených s osamělostí (odhad WHO)' },
    ],
    how: [
      {
        title: 'Osamělost jako alarm',
        text: 'Podobně jako hlad říká „najez se“, osamělost říká „vyhledej lidi“. Když trvá dlouho, tělo je ve stálé pohotovosti — hůř se spí a víc se stresuje.',
      },
      {
        title: 'Vztahy a zdraví',
        text: 'Metaanalýza 148 studií zjistila, že lidé se silnějšími vztahy měli výrazně vyšší naději, že sledované období přežijí (poměr šancí 1,5).',
      },
      {
        title: 'Kvalita víc než počet',
        text: 'Nejde o počet sledujících. Rozhoduje, jestli máte pár lidí, kterým můžete zavolat, když je zle.',
      },
      {
        title: 'Proč je těžké z ní vystoupit',
        text: 'Dlouhá osamělost zbystří mozek na odmítnutí — neutrální reakci pak snáz čteme jako chlad a raději se stáhneme. Pomáhá vědět, že je to past, ne pravda o vás.',
      },
    ],
    today: [
      'WHO upozorňuje na nadměrný čas u obrazovky a negativní interakce online jako na riziko pro duševní zdraví mladých.',
      'Hodně kontaktu probíhá přes zprávy, méně tváří v tvář.',
    ],
    helps: [
      {
        text: 'Pravidelný kontakt s lidmi, na kterých vám záleží — i krátká zpráva nebo hovor.',
        level: 'plausible',
      },
      {
        text: 'Při rozhovoru odložit mobil a věnovat se naplno.',
        level: 'plausible',
      },
      {
        text: 'Kroužek, sport, dobrovolnictví nebo skupina se stejným koníčkem — lidi se nejsnáz potkávají u společné činnosti.',
        level: 'plausible',
      },
      {
        text: 'Počítají se i drobnosti: pár vět s prodavačkou, sousedem nebo spolužákem. Lidé, kteří měli víc takových krátkých rozhovorů, se ten den cítili líp.',
        level: 'preliminary',
      },
      {
        text: 'Když osamělost trvá a přidá se smutek nebo beznaděj, říct si o pomoc (psycholog, linka důvěry).',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Osamělost se týká hlavně starých lidí.',
        fact: 'Podle WHO jsou nejvíc zasažení mladí, nejvíc teenageři.',
      },
      {
        myth: 'Kdo je osamělý, je prostě sám.',
        fact: 'Osamělost je pocit. Můžete být sami a spokojení — nebo mezi lidmi a osamělí.',
      },
    ],
    related: [
      { label: 'Nálada a úzkost', href: '/jak-funguje-telo/nalada-a-uzkost' },
      { label: 'Stres', href: '/jak-funguje-telo/stres' },
      { label: 'Dopamin a mobil', href: '/jak-funguje-telo/dopamin-a-mobil' },
    ],
    sources: [SOURCES.whoSocial, SOURCES.holtLunstad, SOURCES.holtLunstad24, SOURCES.weakTies],
  },
  {
    slug: 'protahovani',
    title: 'Protahování: na co je dobré a na co ne',
    short: 'Protahování',
    icon: 'move',
    hook: 'Protáhnout se před sportem, aby se nic nestalo? Studie ukazují, že před zraněním chrání spíš posilování.',
    tldr: [
      'Protahování spolehlivě zvětšuje rozsah pohybu.',
      'Svalovou bolest po tréninku skoro nezmírní a jako samostatná prevence zranění se neosvědčilo.',
      'Krátké protažení před výkonem nevadí; před výbušným sportem je lepší dynamická rozcvička.',
    ],
    numbers: [
      { value: '< 60 s', label: 'statického protažení na sval výkon prakticky neovlivní' },
      { value: '~1/3', label: 'zranění oproti kontrolám při posilování (metaanalýza)' },
    ],
    how: [
      {
        title: 'Proč se zvětší rozsah',
        text: 'Hlavně proto, že si nervový systém zvykne na tah a snese ho víc. Změny ve svalu samotném přicházejí pomaleji.',
      },
      {
        title: 'Protahování a zranění',
        text: 'V metaanalýze sportovních studií posilování snížilo zranění zhruba na třetinu. Samotné protahování přínos neukázalo.',
      },
      {
        title: 'Protahování a bolest svalů',
        text: 'Přehled Cochrane zjistil, že protahování před ani po cvičení bolest svalů v dalších dnech prakticky nesníží.',
      },
      {
        title: 'Statické, nebo dynamické',
        text: 'Statické protažení znamená výdrž v jedné poloze, dynamické plynulé pohyby v plném rozsahu (kroužení, výpady, švihy). Před sportem se hodí spíš dynamické, na rozsah obojí.',
      },
    ],
    today: [
      'Celý den sezení zkracuje rozsah, ve kterém se běžně hýbeme.',
      'Na sítích se prodávají „mobility“ programy jako řešení všeho.',
    ],
    helps: [
      {
        text: 'Pravidelné protahování, když chcete větší rozsah — třeba do dřepu nebo pro jógu.',
        level: 'established',
      },
      {
        text: 'Před sportem dynamická rozcvička: zahřátí a pohyby, které ve sportu děláte.',
        level: 'established',
      },
      {
        text: 'Posilování jako hlavní prevence zranění.',
        level: 'plausible',
      },
      { text: 'Protahovat se, protože je vám to příjemné — to je taky dobrý důvod.', level: 'plausible' },
      {
        text: 'Kolik: každý sval 2–4× po 10–30 s, aspoň 2–3 dny v týdnu. Do mírného tahu, ne do bolesti.',
        level: 'plausible',
      },
    ],
    myths: [
      {
        myth: 'Protažení před sportem zabrání zranění.',
        fact: 'Samotné protahování v metaanalýze zranění nesnížilo. Posilování ano.',
      },
      {
        myth: 'Protažení po tréninku zabrání svalové horečce.',
        fact: 'Efekt je podle přehledu Cochrane tak malý, že ho skoro nepoznáte.',
      },
      {
        myth: 'Čím ohebnější, tím zdravější.',
        fact: 'Stačí rozsah pro to, co v životě a sportu děláte. Extrémní ohebnost bez síly klouby nechrání.',
      },
    ],
    related: [
      { label: 'Bolest zad', href: '/jak-funguje-telo/bolest-zad' },
      { label: 'Pohyb a sezení', href: '/jak-funguje-telo/pohyb-a-sezeni' },
      { label: 'Svaly a metabolismus', href: '/jak-funguje-telo/svaly-a-metabolismus' },
    ],
    sources: [SOURCES.lauersen, SOURCES.herbertStretch, SOURCES.behm, SOURCES.warneke, SOURCES.acsm],
  },
  {
    slug: 'testosteron',
    title: 'Testosteron: co ho opravdu zvedá a co je jen marketing',
    short: 'Testosteron',
    icon: 'mars',
    hook: '„Low T“ je oblíbené téma sítí. Největší vliv má spánek a váha — ne boostery z e-shopu.',
    tldr: [
      'Testosteron přirozeně snižuje nedostatek spánku a obezita; hubnutí ho zvyšuje.',
      'Většina „testosteronových boosterů“ nemá pro svá tvrzení oporu ve výzkumu.',
      'Léčba testosteronem patří jen k lékaři při prokázaném nedostatku — a může vypnout tvorbu spermií.',
    ],
    numbers: [
      { value: '10–15 %', label: 'pokles po týdnu spánku 5 h za noc (studie)' },
      { value: '~25 %', label: 'složek boosterů mělo data o zvýšení testosteronu' },
      { value: '~1 %', label: 'ročně klesá testosteron od středního věku' },
    ],
    how: [
      {
        title: 'Řízení z mozku',
        text: 'Mozek (hypotalamus a hypofýza) dává varlatům signál, kolik testosteronu tvořit. Když ho dodáte zvenku, mozek signál ztlumí — a varlata utlumí i tvorbu spermií.',
      },
      {
        title: 'Spánek',
        text: 'Velká část testosteronu se tvoří ve spánku. Mladým mužům, kteří týden spali 5 hodin, klesl během dne o 10–15 %.',
      },
      {
        title: 'Váha',
        text: 'Tukové tkáně přeměňují testosteron na estrogen a obezita tlumí jeho tvorbu. Zhubnutí podle metaanalýzy hladinu zvyšuje — tím víc, čím víc kil dolů.',
      },
      {
        title: 'Věk',
        text: 'Od středního věku hladina pozvolna klesá, zhruba o procento ročně. Je to normální a samo o sobě to léčbu nevyžaduje — rozhodují příznaky a opakovaně nízké hodnoty.',
      },
    ],
    today: [
      'Sítě a e-shopy prodávají boostery, „TRT kliniky“ a strach z „nízkého T“.',
      'Krátký spánek a málo pohybu jsou u mladých běžné.',
    ],
    helps: [
      {
        text: 'Spát 7 a více hodin — v malé studii týden krátkého spánku testosteron snížil.',
        level: 'plausible',
      },
      { text: 'Při nadváze zhubnout.', level: 'established' },
      { text: 'Pravidelný pohyb a posilování.', level: 'plausible' },
      { text: 'Omezit alkohol — velké dávky tvorbu testosteronu tlumí.', level: 'plausible' },
      {
        text: 'Při únavě, poklesu libida nebo erekce zajít k lékaři — měří se ráno nalačno a opakovaně.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Testosteronové boostery fungují.',
        fact: 'Analýza 50 produktů ukázala, že jen asi čtvrtina složek má data o zvýšení testosteronu a část dokonce opačný efekt.',
      },
      {
        myth: 'Sója snižuje testosteron.',
        fact: 'Metaanalýza klinických studií vliv sóji ani izoflavonů na mužské hormony nenašla.',
      },
      {
        myth: 'Testosteron na předpis je bezpečná zkratka ke svalům.',
        fact: 'Bez prokázaného nedostatku se nedoporučuje. Tlumí tvorbu spermií a vyžaduje lékařské sledování.',
      },
    ],
    related: [
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
      { label: 'Hubnutí a energie', href: '/jak-funguje-telo/hubnuti-a-energie' },
      { label: 'Looksmaxing', href: '/looksmaxing' },
    ],
    sources: [
      SOURCES.leproult,
      SOURCES.coronaWeight,
      SOURCES.clemesha,
      SOURCES.bhasin,
      SOURCES.reedSoy,
      SOURCES.harmanT,
    ],
  },
  {
    slug: 'cholesterol',
    title: 'Cholesterol: co znamenají čísla z krve a co s nimi dělá jídlo',
    short: 'Cholesterol',
    icon: 'heart',
    hook: 'Cholesterol nebolí a nejde vidět. O to víc stojí za to rozumět, co znamená „zlý“ LDL a co ho opravdu snižuje.',
    tldr: [
      'Cholesterol tělo potřebuje — většinu si vyrobí samo v játrech.',
      'Škodí, když je v krvi dlouhodobě moc LDL: ukládá se do stěn tepen a zužuje je.',
      'LDL snižuje méně nasycených tuků, víc vlákniny a pohyb; když to nestačí, léky (statiny) prokazatelně chrání srdce.',
    ],
    numbers: [
      { value: '−22 %', label: 'infarktů a mrtvic na každý 1 mmol/l nižšího LDL' },
      { value: '<3,0', label: 'cílový LDL (mmol/l) u lidí s nízkým rizikem (ESC)' },
    ],
    how: [
      {
        title: 'K čemu je cholesterol',
        text: 'Je součástí každé buněčné membrány a tělo z něj vyrábí hormony, vitamín D a žluč. Většinu si játra vyrobí sama, menší část přijde z jídla.',
      },
      {
        title: 'LDL a HDL',
        text: 'Cholesterol se ve vodnaté krvi nerozpustí, proto ho vozí balíčky — lipoproteiny. LDL ho rozváží do tkání; když je ho dlouhodobě moc, proniká do stěny tepen. HDL ho naopak odvádí zpět do jater.',
      },
      {
        title: 'Jak vzniká ateroskleróza',
        text: 'V tepně se z LDL a zánětlivých buněk tvoří plát. Roky nic nebolí — dokud plát nepraskne a nevznikne sraženina. Pak přijde infarkt nebo mrtvice.',
      },
    ],
    today: [
      'Vysoký cholesterol mívají i štíhlí a mladí lidé — někdy je vrozený a strava ho sama nesrovná.',
      'Na sítích koluje, že cholesterol „nevadí“. Genetické, populační i klinické studie se shodují, že LDL ateroskleróze přímo napomáhá.',
    ],
    helps: [
      {
        text: 'Méně nasycených tuků (tučné maso, uzeniny, máslo, sýry) a místo nich rostlinné oleje, ořechy a ryby.',
        level: 'established',
      },
      {
        text: 'Víc rozpustné vlákniny — ovesné vločky, luštěniny, ovoce. Schválené tvrzení EU: 3 g beta-glukanů z ovsa denně snižují cholesterol.',
        level: 'established',
      },
      { text: 'Pravidelný pohyb, nekouřit a při nadváze zhubnout.', level: 'established' },
      {
        text: 'Když doporučí lékař, užívat statiny — patří k nejlépe prozkoumaným lékům vůbec.',
        level: 'established',
      },
      {
        text: 'Nechat si cholesterol změřit — i v mladém věku, hlavně když měl někdo v rodině brzy infarkt.',
        level: 'plausible',
      },
    ],
    myths: [
      {
        myth: 'Vejce zvyšují riziko nemocí srdce.',
        fact: 'Velká analýza nenašla u jednoho vejce denně vyšší riziko. Víc rozhoduje celkové složení stravy.',
      },
      {
        myth: 'Cholesterol je jen problém starých a obézních.',
        fact: 'Plát se v tepnách tvoří desítky let. Vysoký LDL mají i mladí a štíhlí — někdy vrozeně.',
      },
      {
        myth: 'Statiny jsou zbytečná chemie.',
        fact: 'Ve studiích se 170 000 lidmi snížení LDL o 1 mmol/l ubralo zhruba pětinu infarktů a mrtvic.',
      },
    ],
    related: [
      { label: 'Srdce a tlak', href: '/jak-funguje-telo/srdce-a-tlak' },
      { label: 'Ultrazpracované potraviny', href: '/jak-funguje-telo/ultrazpracovane-potraviny' },
      { label: 'Srdce v mapě těla', href: '/organ/heart' },
      { label: 'Játra v mapě těla', href: '/organ/liver' },
    ],
    sources: [SOURCES.escLipids, SOURCES.ferenceLdl, SOURCES.cttStatins, SOURCES.hooperSatFat, SOURCES.eggs],
  },
  {
    slug: 'traveni-a-zacpa',
    title: 'Trávení a zácpa: co je normální a co opravdu pomáhá',
    short: 'Trávení a zácpa',
    icon: 'apple',
    hook: 'Zácpa trápí asi každého sedmého člověka. Pomáhají překvapivě obyčejné věci — kiwi, švestky a žitný chléb.',
    tldr: [
      'Normální je chodit na stolici od třikrát denně po třikrát týdně — denně nemusíte.',
      'Nejlépe ověřená je vláknina (hlavně jako doplněk psyllium), kiwi, sušené švestky a žitný chléb.',
      'Krev ve stolici, nevysvětlitelné hubnutí nebo náhlá změna po padesátce patří k lékaři.',
    ],
    numbers: [
      { value: '~14 %', label: 'lidí na světě má chronickou zácpu' },
      { value: '3× týdně–3× denně', label: 'běžný rozsah četnosti stolice' },
    ],
    how: [
      {
        title: 'Cesta potravy',
        text: 'Tenké střevo vstřebá živiny, tlusté střevo pak hlavně vodu. Čím déle tam obsah zůstane, tím víc vody ztratí a tím je stolice tvrdší.',
      },
      {
        title: 'Proč pomáhá vláknina',
        text: 'Vláknina váže vodu a zvětšuje objem stolice, takže je měkčí a střevo ji snáz posouvá. Část z ní navíc živí střevní bakterie.',
      },
      {
        title: 'Co zácpu zhoršuje',
        text: 'Málo vlákniny a pohybu, odkládání nutkání, některé léky (např. na bolest s opioidy, železo) a změny režimu, třeba na cestách.',
      },
      {
        title: 'Ranní okno',
        text: 'Po probuzení a po jídle — hlavně po snídani — se tlusté střevo samo rozhýbe (gastrokolický reflex). Proto se vyplatí dát si ráno po snídani na záchod čas a nespěchat.',
      },
    ],
    today: [
      'Bílé pečivo, ultrazpracované jídlo a celý den vsedě — kombinace, která střevu nepomáhá.',
      'Projímadla a „detoxy“ se prodávají jako řešení všeho, příčinu ale neřeší.',
    ],
    helps: [
      {
        text: 'Doplněk vlákniny — nejlépe ověřené je psyllium; dávku přidávejte postupně a zapíjejte.',
        level: 'established',
      },
      { text: 'Dvě kiwi denně nebo hrst sušených švestek.', level: 'plausible' },
      { text: 'Žitný chléb místo bílého pečiva.', level: 'preliminary' },
      { text: 'Minerální voda s vyšším obsahem hořčíku.', level: 'preliminary' },
      { text: 'Pohyb a neodkládat nutkání jít na záchod.', level: 'plausible' },
      {
        text: 'Stolička pod nohy na záchodě (kolena výš než boky) — ve studii lidé méně tlačili a byli rychleji hotoví.',
        level: 'preliminary',
      },
    ],
    myths: [
      {
        myth: 'Na stolici se musí chodit každý den.',
        fact: 'Normální rozsah je od třikrát denně po třikrát týdně. Rozhoduje, jestli je to pro vás obvyklé a bez potíží.',
      },
      {
        myth: 'Stačí pít víc vody.',
        fact: 'Pomůže hlavně tomu, kdo pije málo. Samotná voda bez vlákniny zácpu většinou nevyřeší.',
      },
      {
        myth: 'Projímadla z lékárny jsou bezpečná na pořád.',
        fact: 'Při dlouhodobých potížích patří léčba k lékaři — je potřeba vyloučit příčiny jako nemoci štítné žlázy nebo léky.',
      },
    ],
    related: [
      { label: 'Střeva a mikrobiom', href: '/jak-funguje-telo/streva-a-mikrobiom' },
      { label: 'Pitný režim', href: '/jak-funguje-telo/pitny-rezim' },
      { label: 'Střeva v mapě těla', href: '/organ/intestines' },
    ],
    sources: [SOURCES.blackFord, SOURCES.schootFoods, SOURCES.bdaConstipation, SOURCES.modiPosture],
  },
  {
    slug: 'chronotyp',
    title: 'Ranní ptáče, nebo sova? Chronotyp a sociální jet lag',
    short: 'Chronotyp',
    icon: 'clock',
    hook: 'Pozdní usínání u mladých není lenost — vnitřní hodiny se v dospívání opravdu posouvají. Jen škola a práce začínají pořád stejně.',
    tldr: [
      'Chronotyp je přirozený sklon chodit spát dřív, nebo později. Je zčásti dědičný a mění se s věkem.',
      'Nejvíc „sovy“ jsme kolem 20 let; potom se vnitřní hodiny zase posouvají dřív.',
      'Sociální jet lag je rozdíl mezi spánkem ve všední dny a o víkendu — souvisí s únavou a ve studiích i s vyšší hmotností.',
    ],
    numbers: [
      { value: '~20 let', label: 'věk, kdy jsme největší sovy' },
      { value: 'Skupina 2A', label: 'IARC: noční práce je pravděpodobně karcinogenní' },
      { value: '~2 h', label: 'dřív se posunuly hodiny po týdnu pod stanem bez umělého světla' },
    ],
    how: [
      {
        title: 'Vnitřní hodiny',
        text: 'Centrum v mozku nastavuje 24hodinový rytmus spánku, hormonů a teploty. Hlavně podle světla — ranní světlo hodiny posouvá dřív, večerní později.',
      },
      {
        title: 'Proč se lidé liší',
        text: 'Chronotyp ovlivňují geny, věk i to, kolik denního světla dostanete. V dospívání se rytmus posouvá později a zhruba po dvacítce se zase vrací.',
      },
      {
        title: 'Sociální jet lag',
        text: 'Když budík ve všední dny „přetáčí“ vaše vnitřní hodiny a o víkendu spíte podle nich, tělo každý týden cestuje přes časová pásma. Výsledkem je chronický spánkový dluh.',
      },
      {
        title: 'Světlo umí hodiny přenastavit',
        text: 'Když lidé strávili týden pod stanem jen s denním světlem a ohněm, jejich vnitřní hodiny se posunuly zhruba o 2 hodiny dřív — a rozdíly mezi sovami a skřivany se zmenšily. Velká část „sovího“ rytmu je tedy dnešní světlo.',
      },
    ],
    today: [
      'Večerní obrazovky a málo denního světla přes den posouvají vnitřní hodiny ještě později.',
      'Škola a práce začínají brzy — nejvíc to odnesou dospívající a mladí dospělí.',
    ],
    helps: [
      {
        text: 'Ranní denní světlo — ideálně venku, hned po probuzení. Je to nejsilnější „seřizovač“ vnitřních hodin.',
        level: 'established',
      },
      { text: 'Tlumené světlo a méně obrazovek večer.', level: 'plausible' },
      {
        text: 'Vstávat zhruba ve stejnou dobu i o víkendu — klidně o hodinu později, ne o čtyři.',
        level: 'plausible',
      },
      {
        text: 'Při nočních směnách: stálý rozvrh, zatemněná a tichá ložnice na spánek přes den, pravidelné prohlídky.',
        level: 'plausible',
      },
    ],
    myths: [
      {
        myth: 'Kdo ráno nevstane, je líný.',
        fact: 'Chronotyp je zčásti biologie a genetika. Sovy nejsou líné — jen žijí v rozvrhu nastaveném pro skřivany.',
      },
      {
        myth: 'O víkendu si to prospím a je to v pořádku.',
        fact: 'Velký posun o víkendu zvětšuje sociální jet lag. V pondělí se pak spí ještě hůř.',
      },
      {
        myth: 'Melatonin je obyčejná pilulka na spaní.',
        fact: 'Je to hlavně signál „venku je tma“ pro vnitřní hodiny. Nejlépe ověřený je na jet lag. U dětí a při dlouhodobých potížích se spánkem jen po poradě s lékařem.',
      },
    ],
    related: [
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
      { label: 'Oči a obrazovky', href: '/jak-funguje-telo/oci-a-obrazovky' },
      { label: 'Energie a kofein', href: '/jak-funguje-telo/energie-a-kofein' },
    ],
    sources: [
      SOURCES.wittmann,
      SOURCES.roenneberg2004,
      SOURCES.roenneberg2012,
      SOURCES.kalmbach,
      SOURCES.iarcShift,
      SOURCES.wrightCamping,
      SOURCES.herxheimer,
    ],
  },
  {
    slug: 'posilovani-pro-zacatecniky',
    title: 'Posilování pro začátečníky: kolik, jak často a jak přidávat',
    short: 'Posilování od nuly',
    icon: 'dumbbell',
    hook: 'Nepotřebujete složitý plán ani hodiny v posilovně. Stačí dvakrát týdně celé tělo — a postupně přidávat.',
    tldr: [
      'Každou velkou svalovou skupinu trénujte aspoň 2× týdně — přináší to víc než jednou týdně.',
      'Začněte 1–3 sériemi po 8–12 opakováních s vahou, která je na konci série opravdu těžká.',
      'Klíč je postupné přidávání: když zvládnete o 1–2 opakování víc, přidejte zhruba 2–10 % váhy.',
    ],
    numbers: [
      { value: '2×', label: 'týdně na každou svalovou skupinu' },
      { value: '8–12', label: 'opakování v sérii na začátek' },
      { value: '10+', label: 'sérií na sval týdně pro výraznější růst' },
      { value: '30–60 min', label: 'posilování týdně — spojeno s 10–20 % nižší úmrtností' },
    ],
    how: [
      {
        title: 'Proč svaly rostou',
        text: 'Sval dostane signál k růstu, když pracuje proti zátěži blízko svého limitu. Bez postupného přidávání si na zátěž zvykne a přestane se měnit.',
      },
      {
        title: 'Objem a frekvence',
        text: 'Víc sérií za týden znamená v průměru víc svalů — u začátečníků ale stačí málo. Rozdělit trénink do dvou dnů funguje líp než všechno najednou.',
      },
      {
        title: 'Technika před váhou',
        text: 'Prvních pár týdnů se učí hlavně nervový systém: zlepšuje koordinaci a sílu ještě dřív, než svaly viditelně narostou.',
      },
      {
        title: 'Nejen o vzhledu',
        text: 'Lidé, kteří posilují 30–60 minut týdně, mají podle metaanalýzy o 10–20 % nižší riziko úmrtí, srdečních nemocí i cukrovky. Sval je největší „spotřebič“ cukru v těle a s věkem drží soběstačnost.',
      },
    ],
    today: [
      'Na sítích se prodávají „ideální“ plány — pro začátek ale funguje jakýkoli rozumný plán, který vydržíte.',
      'Mnoho lidí trénuje měsíce se stejnou vahou, protože si nezapisuje, co zvedli minule.',
    ],
    helps: [
      {
        text: 'Celé tělo 2× týdně: dřep nebo leg press, tlak (kliky, bench), přítah (veslování), mrtvý tah nebo hip thrust, core.',
        level: 'established',
      },
      {
        text: 'Zapisovat váhu a opakování — a přidat, když zvládnete o 1–2 opakování víc než plán.',
        level: 'established',
      },
      { text: 'Série končit 1–3 opakování před selháním, ne vždy do úplného vyčerpání.', level: 'plausible' },
      { text: 'Dost bílkovin a spánku — růst probíhá při odpočinku.', level: 'established' },
    ],
    myths: [
      {
        myth: 'Bez bolesti druhý den to nebyl dobrý trénink.',
        fact: 'Svalová bolest neukazuje, jak dobrý byl trénink. Rozhoduje postupné přidávání zátěže.',
      },
      {
        myth: 'Začátečník potřebuje trénovat každý den.',
        fact: 'Dvakrát až třikrát týdně celé tělo stačí — svaly rostou mezi tréninky.',
      },
      {
        myth: 'Ženy z posilování „zmohutní“.',
        fact: 'Velké svaly vyžadují roky cíleného tréninku a jídla. Běžné posilování přidá sílu a pevnost, ne objem navíc.',
      },
    ],
    related: [
      { label: 'Svaly a metabolismus', href: '/jak-funguje-telo/svaly-a-metabolismus' },
      { label: 'Kosti', href: '/jak-funguje-telo/kosti' },
      { label: 'Zapisovat trénink v aplikaci', href: '/login?mode=signup' },
    ],
    sources: [
      SOURCES.acsmProgression,
      SOURCES.schoenfeldFreq,
      SOURCES.schoenfeldVolume,
      SOURCES.who,
      SOURCES.momma,
    ],
  },
  {
    slug: 'alergie-a-pyl',
    title: 'Alergie a pyl: proč tělo bojuje s neškodnými věcmi',
    short: 'Alergie a pyl',
    icon: 'flower',
    hook: 'Kýchání, ucpaný nos a svědící oči každé jaro. Alergie se dá dobře léčit — jen ne medem z farmářských trhů.',
    tldr: [
      'Alergie je přehnaná reakce imunity na něco neškodného, třeba pyl, roztoče nebo srst.',
      'Alergická rýma patří k nejčastějším chronickým nemocem a často jde ruku v ruce s astmatem.',
      'Nejlépe fungují léky: antihistaminika a nosní spreje s kortikoidem; při dlouhodobých potížích imunoterapie od alergologa.',
    ],
    numbers: [{ value: '−81 %', label: 'arašídové alergie při časném zavádění u rizikových kojenců' }],
    how: [
      {
        title: 'Imunita si splete nepřítele',
        text: 'Při prvním setkání si tělo proti pylu vytvoří protilátky IgE. Ty se usadí na buňkách v nose a očích a při dalším kontaktu spustí poplach.',
      },
      {
        title: 'Histamin',
        text: 'Buňky uvolní histamin a další látky — sliznice oteče, teče z nosu, svědí oči a kýcháte. Antihistaminika blokují právě tenhle signál.',
      },
      {
        title: 'Nos a plíce spolu souvisejí',
        text: 'Neléčená alergická rýma zhoršuje spánek a soustředění a často se spojuje s astmatem. Proto má smysl ji léčit, ne jen přetrpět.',
      },
      {
        title: 'Prevence začíná u miminek',
        text: 'Dřív se alergenům u dětí raději vyhýbalo. Velká studie LEAP ukázala opak: rizikové děti, které jedly arašídy od kojeneckého věku, měly arašídovou alergii o 81 % méně často. Střevo se učí toleranci.',
      },
    ],
    today: [
      'Pylová sezóna se s teplejšími roky prodlužuje.',
      'Na sítích se doporučuje „místní med“ nebo detoxy — výzkum je nepotvrdil.',
    ],
    helps: [
      {
        text: 'Nosní sprej s kortikoidem — pravidelně, účinek nastupuje během několika dní.',
        level: 'established',
      },
      { text: 'Antihistaminika novější generace, která málo uspávají.', level: 'established' },
      {
        text: 'Při potížích, které trvají roky, alergenová imunoterapie od alergologa — „očkování“ proti alergii.',
        level: 'established',
      },
      {
        text: 'Sledovat pylové zpravodajství, po návratu zvenku se osprchovat a převléct, větrat při nízké koncentraci pylu.',
        level: 'plausible',
      },
      {
        text: 'U kojenců s ekzémem nebo alergií na vejce probrat s pediatrem časné zavádění arašídů (vždy jako krém, nikdy celé oříšky).',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Místní med alergii vyléčí.',
        fact: 'V randomizované studii med příznaky nezmírnil o nic víc než sladký sirup s medovou příchutí.',
      },
      {
        myth: 'Alergie je jen nepříjemnost, léčit se nemusí.',
        fact: 'Neléčená rýma zhoršuje spánek, školu i práci a souvisí s astmatem.',
      },
      {
        myth: 'Léky na alergii vždycky uspávají.',
        fact: 'To platí hlavně pro starší antihistaminika. Novější uspávají jen málo.',
      },
    ],
    related: [
      { label: 'Imunita', href: '/jak-funguje-telo/imunita' },
      { label: 'Dýchání', href: '/jak-funguje-telo/dychani' },
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
    ],
    sources: [SOURCES.bousquetAr, SOURCES.ariaGuideline, SOURCES.honeyRct, SOURCES.leap],
  },
  {
    slug: 'marihuana-a-thc',
    title: 'Marihuana a THC: co dělá s mozkem, hlavně v mladém věku',
    short: 'Marihuana a THC',
    icon: 'leaf',
    hook: 'Není to ani nevinná bylinka, ani ďábelská droga. Rozhoduje, jak často, jak silná — a v kolika letech.',
    tldr: [
      'THC působí na systém, který v mozku ladí paměť, náladu, chuť k jídlu i vnímání času.',
      'Závislost vznikne asi u 9 % uživatelů; u těch, kdo začnou v dospívání, zhruba u každého šestého.',
      'Denní užívání silné marihuany souvisí s téměř pětkrát vyšší šancí psychózy.',
    ],
    numbers: [
      { value: '~1 z 6', label: 'kdo začne v dospívání, se stane závislým' },
      { value: '~5×', label: 'vyšší šance psychózy při denním užívání silné trávy' },
      { value: '~47 %', label: 'pravidelných uživatelů má při vysazení abstinenční příznaky' },
    ],
    how: [
      {
        title: 'Endokanabinoidy',
        text: 'Mozek má vlastní „konopné“ látky, které jemně ladí přenos signálů. THC se naváže na stejné receptory, ale mnohem silněji a déle.',
      },
      {
        title: 'Mozek v dospívání',
        text: 'Mozek dozrává zhruba do pětadvacítky — naposledy oblasti pro plánování a sebeovládání. Pravidelné THC v tomto období ovlivňuje paměť a učení víc než u dospělých.',
      },
      {
        title: 'Silnější než dřív',
        text: 'Obsah THC v dnešní marihuaně je výrazně vyšší než před desítkami let. Čím silnější tráva a častější užívání, tím vyšší riziko závislosti i psychických potíží.',
      },
      {
        title: 'Když člověk přestane',
        text: 'Skoro polovina pravidelných uživatelů má po vysazení abstinenční příznaky: podrážděnost, úzkost, špatný spánek a živé sny, menší chuť k jídlu. Nejhorší bývají první dny, odezní obvykle do 2–3 týdnů.',
      },
    ],
    today: [
      'Vedle trávy se prodávají vapy a jedlé výrobky s THC a jeho syntetickými příbuznými, často s neznámou silou.',
      'Jedlé výrobky působí až za hodinu i později — lidé si pak přidávají a dávku přeženou.',
    ],
    helps: [
      { text: 'Po užití neřídit — THC zhoršuje reakce a koordinaci.', level: 'established' },
      {
        text: 'Čím později a méně často, tím menší riziko závislosti a dopadů na mozek.',
        level: 'plausible',
      },
      {
        text: 'Při psychóze nebo schizofrenii v rodině se THC vyhnout úplně.',
        level: 'plausible',
      },
      {
        text: 'Když užívání přerůstá přes hlavu, obrátit se na praktického lékaře nebo adiktologickou ambulanci — závislost se dá léčit.',
        level: 'established',
      },
    ],
    myths: [
      {
        myth: 'Je to přírodní, takže to neškodí.',
        fact: 'Přírodní neznamená bezpečné. Riziko závislosti i psychóz je doložené, hlavně u silné trávy a častého užívání.',
      },
      {
        myth: 'Na trávu závislost nevzniká.',
        fact: 'Vzniká — asi u 9 % uživatelů, u těch, kdo začali v dospívání, zhruba u každého šestého.',
      },
      {
        myth: 'Jedlé výrobky jsou bezpečnější než kouření.',
        fact: 'Plíce šetří, ale účinek nastupuje pozdě a nepředvídatelně, takže se snadno přejí.',
      },
      {
        myth: 'CBD je totéž co tráva, jen slabší.',
        fact: 'CBD neopíjí a závislost jako THC nevyvolává. Výrobky s CBD ale můžou obsahovat i THC a jejich složení se často liší od etikety.',
      },
    ],
    related: [
      { label: 'Dopamin a mobil', href: '/jak-funguje-telo/dopamin-a-mobil' },
      { label: 'Nálada a úzkost', href: '/jak-funguje-telo/nalada-a-uzkost' },
      { label: 'Mozek a učení', href: '/jak-funguje-telo/mozek-a-uceni' },
    ],
    sources: [SOURCES.volkowCannabis, SOURCES.diFortiPsychosis, SOURCES.bahji],
  },
]

export const BODY_GUIDE_BY_SLUG: Record<string, BodyGuide> = Object.fromEntries(
  BODY_GUIDES.map((g) => [g.slug, g]),
)

/** Guides that link to a given page — used for "read also" boxes on organ and supplement pages. */
export const guidesLinkingTo = (href: string): BodyGuide[] =>
  BODY_GUIDES.filter((g) => g.related.some((r) => r.href === href))

export type GuideCategory = 'mysl' | 'spanek' | 'jidlo' | 'pohyb' | 'prevence' | 'navyky'

export const GUIDE_CATEGORIES: { id: GuideCategory; label: string }[] = [
  { id: 'mysl', label: 'Mozek a psychika' },
  { id: 'spanek', label: 'Spánek a energie' },
  { id: 'jidlo', label: 'Jídlo a metabolismus' },
  { id: 'pohyb', label: 'Pohyb a tělo' },
  { id: 'prevence', label: 'Prevence a zdraví' },
  { id: 'navyky', label: 'Návyky a závislosti' },
]

/** Category of each guide (one per guide; the content test checks none is missing). */
export const GUIDE_CATEGORY: Record<string, GuideCategory> = {
  spanek: 'spanek',
  'energie-a-kofein': 'spanek',
  stres: 'mysl',
  'dopamin-a-mobil': 'mysl',
  'svaly-a-metabolismus': 'pohyb',
  'pohyb-a-sezeni': 'pohyb',
  'streva-a-mikrobiom': 'jidlo',
  'pitny-rezim': 'jidlo',
  alkohol: 'navyky',
  imunita: 'prevence',
  'oci-a-obrazovky': 'prevence',
  'kuze-a-slunce': 'prevence',
  'srdce-a-tlak': 'prevence',
  'mozek-a-uceni': 'mysl',
  'hubnuti-a-energie': 'jidlo',
  'cukr-a-inzulin': 'jidlo',
  'ultrazpracovane-potraviny': 'jidlo',
  'nikotin-a-vaping': 'navyky',
  'bolest-zad': 'pohyb',
  'sluch-a-sluchatka': 'prevence',
  'sauna-a-chlad': 'navyky',
  'menstruacni-cyklus': 'prevence',
  menopauza: 'prevence',
  dlouhovekost: 'prevence',
  'vysledky-krve': 'prevence',
  'nalada-a-uzkost': 'mysl',
  'zuby-a-usta': 'prevence',
  kosti: 'pohyb',
  dychani: 'spanek',
  'akne-a-plet': 'prevence',
  'bolest-hlavy': 'prevence',
  'prerusovany-pust': 'jidlo',
  'samota-a-vztahy': 'mysl',
  protahovani: 'pohyb',
  testosteron: 'prevence',
  cholesterol: 'prevence',
  'traveni-a-zacpa': 'jidlo',
  chronotyp: 'spanek',
  'posilovani-pro-zacatecniky': 'pohyb',
  'alergie-a-pyl': 'prevence',
  'marihuana-a-thc': 'navyky',
}
