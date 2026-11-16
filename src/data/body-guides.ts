import type { Evidence, Source } from './types'

/**
 * „Jak funguje tělo“ — krátké, srozumitelné průvodce pro dnešní svět (obrazovky, kofein, sezení, stres).
 * Každé doporučení má úroveň důkazů; PubMed odkazy ověřeny přes NCBI E-utilities 16. 11. 2026.
 */
export interface BodyGuide {
  slug: string
  title: string
  /** krátký nadpis pro karty a menu */
  short: string
  icon: 'moon' | 'zap' | 'activity' | 'brain' | 'dumbbell' | 'footprints' | 'sprout' | 'droplet'
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
  reynolds: pm(30638909, 'Reynolds a kol. (2019) Kvalita sacharidů a zdraví — série metaanalýz, Lancet'),
  wastyk: pm(34256014, 'Wastyk a kol. (2021) Strava cílená na mikrobiom a imunita, Cell'),
  efsaWater: {
    title: 'EFSA (2010) Referenční hodnoty příjmu vody, EFSA Journal 8(3):1459',
    url: 'https://doi.org/10.2903/j.efsa.2010.1459',
  },
  popkin: pm(20646222, 'Popkin a kol. (2010) Voda, hydratace a zdraví, Nutr Rev'),
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
      { text: 'Poslední kofein 8 a více hodin před spaním.', level: 'established' },
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
      'Bezpečně pro dospělé do 400 mg denně, do 200 mg najednou.',
      'Účinek v těle přetrvává hodiny — odpolední kofein zhoršuje spánek, i když usnete.',
    ],
    numbers: [
      { value: '400 mg', label: 'bezpečně za den (dospělí)' },
      { value: '~5 h', label: 'průměrný poločas kofeinu' },
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
    ],
    today: [
      'Energetické nápoje, předtréninkovky a „kofeinové“ žvýkačky se snadno sčítají — 400 mg je rychle pryč.',
      'Káva místo snídaně a spánku vytváří kruh: málo spánku → víc kofeinu → horší spánek.',
    ],
    helps: [
      { text: 'Poslední kofein ideálně 8 a více hodin před spaním.', level: 'established' },
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
    ],
    related: [
      { label: 'Kofein — dávky a bezpečnost', href: '/doplnky/kofein' },
      { label: 'L-theanin', href: '/doplnky/l-theanin' },
      { label: 'Spánek', href: '/jak-funguje-telo/spanek' },
    ],
    sources: [SOURCES.efsaCaffeine, SOURCES.drake],
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
        text: 'Mozek nerozlišuje medvěda od e-mailu od šéfa. Když stres běží dlouhodobě, tělo platí „opotřebením“: horší spánek, podrážděnost, vyšší tlak a chuť na sladké.',
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
    sources: [SOURCES.mcewen, SOURCES.adrenal, SOURCES.who],
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
    numbers: [],
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
    sources: [SOURCES.schultz, SOURCES.orben],
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
      'Na bílkoviny stačí zhruba 1,6 g na kg tělesné hmotnosti denně — víc nárůst svalů dál nezvyšuje.',
    ],
    numbers: [
      { value: '2×', label: 'silový trénink týdně (WHO)' },
      { value: '~1,6 g/kg', label: 'bílkovin denně na růst svalů' },
    ],
    how: [
      {
        title: 'Podnět a obnova',
        text: 'Trénink sval „poškodí“ a dá mu signál k adaptaci. Růst probíhá až během odpočinku — s dostatkem bílkovin a spánku.',
      },
      {
        title: 'Postupné přetížení',
        text: 'Sval se přizpůsobí tomu, co zná. Aby rostl dál, potřebuje časem víc váhy, opakování nebo sérií.',
      },
      {
        title: 'Sval a metabolismus',
        text: 'Svaly jsou největší „spotřebič“ cukru v těle a zlepšují citlivost na inzulin. Kalorií ale v klidu spálí méně, než se často tvrdí — hlavní přínos je zdraví, ne „spalování“.',
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
    sources: [SOURCES.morton, SOURCES.who],
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
      'Dost pohybu (asi hodina denně) dokáže vyvážit rizika dlouhého sezení.',
    ],
    numbers: [
      { value: '150–300', label: 'minut pohybu týdně' },
      { value: '8–10 tis.', label: 'kroků, kde se přínos vyrovnává (pod 60 let)' },
      { value: '60–75 min', label: 'pohybu denně vyváží dlouhé sezení' },
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
        text: 'Při hodně sezení se hýbat víc — kolem 60–75 minut denně vyváží rizika.',
        level: 'established',
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
        myth: 'Stojací stůl vyřeší sezení.',
        fact: 'Samotné stání není pohyb. Pomáhá hlavně ho střídat a chodit.',
      },
    ],
    related: [
      { label: 'Kroky si můžete zapisovat v aplikaci', href: '/login?mode=signup' },
      { label: 'Svaly a metabolismus', href: '/jak-funguje-telo/svaly-a-metabolismus' },
    ],
    sources: [SOURCES.who, SOURCES.paluch, SOURCES.ekelund],
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
    ],
    today: [
      'Ultrazpracované potraviny často obsahují málo vlákniny — většina lidí jí sní méně, než by měla.',
      'Trh s probiotiky a „detoxy“ slibuje víc, než data dovolují.',
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
    ],
    related: [
      { label: 'Vláknina', href: '/doplnky/vlaknina' },
      { label: 'Probiotika a fermentované potraviny', href: '/doplnky/probiotika' },
      { label: 'Střeva v mapě těla', href: '/organ/intestines' },
    ],
    sources: [SOURCES.reynolds, SOURCES.wastyk],
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
    ],
    today: [
      'Sladké nápoje a energeťáky jsou zdrojem vody, ale i zbytečného cukru.',
      'Klimatizace, sport v posilovně a horká léta zvyšují potřebu.',
    ],
    helps: [
      { text: 'Pít při žízni a mít vodu po ruce; barva moči by měla být světle žlutá.', level: 'plausible' },
      { text: 'Při sportu delším než hodinu a v horku doplňovat i sůl (sodík).', level: 'plausible' },
      { text: 'Voda, neslazené čaje a káva v rozumném množství se počítají.', level: 'established' },
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
    ],
    related: [{ label: 'Kofein', href: '/doplnky/kofein' }],
    sources: [SOURCES.efsaWater, SOURCES.popkin],
  },
]

export const BODY_GUIDE_BY_SLUG: Record<string, BodyGuide> = Object.fromEntries(
  BODY_GUIDES.map((g) => [g.slug, g]),
)
