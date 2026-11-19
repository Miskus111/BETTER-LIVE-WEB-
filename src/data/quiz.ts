/**
 * Kvíz „Mýtus, nebo fakt?“ — výroky převzaté z ověřeného obsahu průvodců (body-guides.ts).
 * Nuancované mýty (kde je správná odpověď „částečně“) záměrně vynecháváme.
 */
export interface QuizItem {
  id: string
  /** slug průvodce, kde je vysvětlení a zdroje */
  guide: string
  statement: string
  /** true = fakt, false = mýtus */
  fact: boolean
  explain: string
}

export const QUIZ: QuizItem[] = [
  // ——— mýty ———
  {
    id: 'kava-dehydratuje',
    guide: 'energie-a-kofein',
    statement: 'Káva dehydratuje.',
    fact: false,
    explain: 'V běžném množství se káva do pitného režimu normálně započítává.',
  },
  {
    id: 'sval-v-tuk',
    guide: 'svaly-a-metabolismus',
    statement: 'Když přestanete cvičit, svaly se změní v tuk.',
    fact: false,
    explain: 'Sval a tuk jsou různé tkáně. Sval může ubýt a tuk přibýt, ale jedno se nemění v druhé.',
  },
  {
    id: 'anabolicke-okno',
    guide: 'svaly-a-metabolismus',
    statement: 'Bílkoviny musíte sníst do 30 minut po tréninku, jinak trénink přijde vniveč.',
    fact: false,
    explain: 'Důležitější je celkové množství bílkovin za den. „Anabolické okno“ je mnohem širší.',
  },
  {
    id: 'deset-procent-mozku',
    guide: 'mozek-a-uceni',
    statement: 'Používáme jen 10 % mozku.',
    fact: false,
    explain: 'Zobrazovací metody ukazují aktivitu v celém mozku — jen ne všude najednou.',
  },
  {
    id: 'ucebni-styly',
    guide: 'mozek-a-uceni',
    statement: 'Nejlíp se naučíte, když se učíte podle svého typu — vizuálního nebo sluchového.',
    fact: false,
    explain: 'Pro „učební styly“ chybí důkazy. Všem pomáhají stejné metody: opakování a vybavování.',
  },
  {
    id: 'kava-vystrizlivi',
    guide: 'alkohol',
    statement: 'Káva vás po alkoholu vystřízliví.',
    fact: false,
    explain: 'Budete bdělejší, ale stejně opilí. Hladinu alkoholu v krvi snižuje jen čas.',
  },
  {
    id: 'antibiotika-chripka',
    guide: 'imunita',
    statement: 'Na chřipku pomáhají antibiotika.',
    fact: false,
    explain: 'Antibiotika na viry nefungují. Zbytečné užívání zvyšuje odolnost bakterií.',
  },
  {
    id: 'mrak-uv',
    guide: 'kuze-a-slunce',
    statement: 'Když je zataženo, spálit se nedá.',
    fact: false,
    explain: 'Velká část UV záření projde i mraky.',
  },
  {
    id: 'jidlo-po-seste',
    guide: 'hubnuti-a-energie',
    statement: 'Jídlo po šesté večer se ukládá do tuku.',
    fact: false,
    explain: 'O váze rozhoduje celkový příjem energie za den, ne hodina na hodinkách.',
  },
  {
    id: 'vape-para',
    guide: 'nikotin-a-vaping',
    statement: 'Z vape jde jen vodní pára.',
    fact: false,
    explain: 'Je to aerosol s nikotinem, rozpouštědly a dalšími látkami.',
  },
  {
    id: 'sauna-toxiny',
    guide: 'sauna-a-chlad',
    statement: 'V sauně se z těla vypotí toxiny.',
    fact: false,
    explain: 'Potem odchází hlavně voda a soli. Odpadní látky odstraňují játra a ledviny.',
  },
  {
    id: 'pasta-bez-fluoridu',
    guide: 'zuby-a-usta',
    statement: 'Zubní pasta bez fluoridu je pro zuby zdravější.',
    fact: false,
    explain: 'Fluorid v pastě je bezpečný a patří k nejlépe ověřeným ochranám proti kazu.',
  },
  {
    id: 'cukr-hyperaktivita',
    guide: 'cukr-a-inzulin',
    statement: 'Cukr dělá z dětí hyperaktivní.',
    fact: false,
    explain: 'Metaanalýza studií to nepotvrdila. Rodiče to často vnímají kvůli vlastnímu očekávání.',
  },
  {
    id: 'zada-lezet',
    guide: 'bolest-zad',
    statement: 'Při bolesti zad je nejlepší zůstat ležet.',
    fact: false,
    explain: 'Klid na lůžku zotavení spíš zpomaluje. Zůstat v pohybu pomáhá víc.',
  },
  {
    id: 'dopamin-detox',
    guide: 'dopamin-a-mobil',
    statement: '„Dopaminový detox“ vyčistí a resetuje mozek.',
    fact: false,
    explain:
      'Dopamin z mozku neodstraníte a ani byste nechtěli. Pauza od spouštěčů ale může pomoct změnit návyky.',
  },
  {
    id: 'vic-vody',
    guide: 'pitny-rezim',
    statement: 'Čím víc vody vypijete, tím líp.',
    fact: false,
    explain: 'Extrémní množství vody může být naopak nebezpečné — klesne hladina sodíku v krvi.',
  },

  {
    id: 'mackani-pupinku',
    guide: 'akne-a-plet',
    statement: 'Pupínek je nejlepší vymáčknout.',
    fact: false,
    explain: 'Mačkání zanese zánět hlouběji a zvyšuje riziko tmavých skvrn a jizev.',
  },
  {
    id: 'boostery',
    guide: 'testosteron',
    statement: 'Testosteronové boostery z e-shopu spolehlivě zvednou testosteron.',
    fact: false,
    explain: 'Jen asi čtvrtina jejich složek má data o zvýšení testosteronu, část dokonce opačný efekt.',
  },
  {
    id: 'protazeni-zraneni',
    guide: 'protahovani',
    statement: 'Protažení před sportem zabrání zranění.',
    fact: false,
    explain: 'Samotné protahování v metaanalýze zranění nesnížilo. Posilování je snížilo zhruba na třetinu.',
  },
  {
    id: 'pust-spaluje',
    guide: 'prerusovany-pust',
    statement: 'Přerušovaný půst spaluje tuk lépe než obyčejná dieta se stejnými kaloriemi.',
    fact: false,
    explain: 'V roční studii v NEJM časové okno nepřidalo k omezení kalorií nic navíc.',
  },

  {
    id: 'cista-voda',
    guide: 'pitny-rezim',
    statement: 'Do pitného režimu se počítá jen čistá voda.',
    fact: false,
    explain: 'Počítá se i čaj, káva, polévka nebo mléko — a zhruba pětinu vody dodá jídlo.',
  },
  {
    id: 'vic-bilkovin-vic-svalu',
    guide: 'svaly-a-metabolismus',
    statement: 'Čím víc bílkovin sníte, tím víc svalů naroste.',
    fact: false,
    explain: 'Nárůst svalů přestává přibývat zhruba u 1,6 g bílkovin na kg denně; víc už skoro nepřidá.',
  },

  {
    id: 'vejce-srdce',
    guide: 'cholesterol',
    statement: 'Jedno vejce denně zvyšuje riziko nemocí srdce.',
    fact: false,
    explain: 'Velká analýza kohortních studií u jednoho vejce denně vyšší riziko nenašla.',
  },

  {
    id: 'stolice-denne',
    guide: 'traveni-a-zacpa',
    statement: 'Na stolici se musí chodit každý den, jinak je to zácpa.',
    fact: false,
    explain: 'Normální rozsah je od třikrát denně po třikrát týdně.',
  },

  {
    id: 'med-alergie',
    guide: 'alergie-a-pyl',
    statement: 'Lžíce místního medu denně zmírní sennou rýmu.',
    fact: false,
    explain: 'V randomizované studii med příznaky nezmírnil víc než sladký sirup s medovou příchutí.',
  },
  {
    id: 'trava-zavislost',
    guide: 'marihuana-a-thc',
    statement: 'Na marihuanu nevzniká závislost.',
    fact: false,
    explain: 'Vzniká asi u 9 % uživatelů; u těch, kdo začnou v dospívání, zhruba u každého šestého.',
  },
  {
    id: 'svalovice',
    guide: 'posilovani-pro-zacatecniky',
    statement: 'Když vás druhý den nebolí svaly, trénink nebyl dobrý.',
    fact: false,
    explain: 'Svalová bolest neukazuje kvalitu tréninku. Rozhoduje postupné přidávání zátěže.',
  },

  // ——— fakta ———
  {
    id: 'spanek-7h',
    guide: 'spanek',
    statement: 'Dospělí potřebují pravidelně 7 a více hodin spánku.',
    fact: true,
    explain:
      'Tak to doporučuje konsenzus americké akademie spánkové medicíny (AASM) a Sleep Research Society.',
  },
  {
    id: 'kofein-adenosin',
    guide: 'energie-a-kofein',
    statement: 'Kofein únavu neodstraní — jen v mozku zablokuje signál únavy.',
    fact: true,
    explain: 'Kofein obsadí receptory pro adenosin. Když vyprchá, únava se vrátí.',
  },
  {
    id: 'voda-z-jidla',
    guide: 'pitny-rezim',
    statement: 'Zhruba pětinu vody přijmeme v jídle.',
    fact: true,
    explain: 'Proto EFSA počítá doporučený příjem vody včetně vody z jídla.',
  },
  {
    id: 'alkohol-spanek',
    guide: 'alkohol',
    statement: 'Alkohol pomáhá usnout, ale zhoršuje druhou polovinu noci.',
    fact: true,
    explain:
      'V první půlce noci spíte tvrdě, ve druhé se spánek rozpadá — častěji se budíte a máte méně REM fáze.',
  },
  {
    id: 'spanek-nachlazeni',
    guide: 'imunita',
    statement: 'Kdo spí méně než 6 hodin, snáz chytí nachlazení.',
    fact: true,
    explain: 'Ukázala to studie, ve které lidé dostali virus nachlazení přímo do nosu.',
  },
  {
    id: 'venku-oci',
    guide: 'oci-a-obrazovky',
    statement: 'Čas venku chrání dětské oči před krátkozrakostí.',
    fact: true,
    explain:
      'Ve studii ve školách 40 minut navíc venku každý školní den snížilo počet nových případů krátkozrakosti.',
  },
  {
    id: 'solarium',
    guide: 'kuze-a-slunce',
    statement: 'Solária patří do stejné skupiny karcinogenů jako tabák.',
    fact: true,
    explain: 'Mezinárodní agentura pro výzkum rakoviny je řadí do nejvyšší skupiny.',
  },
  {
    id: 'vybavovani',
    guide: 'mozek-a-uceni',
    statement: 'Zkoušet se z látky funguje lépe než ji znovu číst.',
    fact: true,
    explain: 'Vybavování paměť posiluje víc než pasivní čtení.',
  },
  {
    id: 'tlak-bez-priznaku',
    guide: 'srdce-a-tlak',
    statement: 'Vysoký krevní tlak často nemá žádné příznaky.',
    fact: true,
    explain: 'Proto se mu říká tichý zabiják. Jediná jistota je měření.',
  },
  {
    id: 'sluch-bunky',
    guide: 'sluch-a-sluchatka',
    statement: 'Smyslové buňky ve vnitřním uchu se po poškození neobnoví.',
    fact: true,
    explain: 'Hlukem poškozený sluch je trvalý — rozhoduje hlasitost krát čas.',
  },
  {
    id: 'led-svaly',
    guide: 'sauna-a-chlad',
    statement: 'Ledová lázeň hned po posilování může tlumit nárůst svalů.',
    fact: true,
    explain:
      'Ve studii lidé s ledovou lázní po posilování nabrali za 12 týdnů méně svalů a síly než ti s lehkým vyklusáním.',
  },
  {
    id: 'kosti-25',
    guide: 'kosti',
    statement: 'Nejvíc kostní hmoty máme zhruba ve 25–30 letech.',
    fact: true,
    explain: 'Potom už jde hlavně o její udržení — proto se základ buduje v mládí.',
  },
  {
    id: 'pohyb-deprese',
    guide: 'nalada-a-uzkost',
    statement: 'Pohyb je účinná součást léčby deprese.',
    fact: true,
    explain: 'Pomáhá chůze, běh, jóga i posilování — jako doplněk, ne náhrada léčby.',
  },
  {
    id: 'prediabetes-58',
    guide: 'cukr-a-inzulin',
    statement: 'Změna životního stylu snížila výskyt cukrovky 2. typu u lidí s prediabetem o 58 %.',
    fact: true,
    explain: 'Ukázala to velká randomizovaná studie Diabetes Prevention Program.',
  },
  {
    id: 'nos-filtr',
    guide: 'dychani',
    statement: 'Nos vzduch ohřeje, zvlhčí a přefiltruje.',
    fact: true,
    explain: 'Proto je dýchání nosem pro běžný den přirozené.',
  },
  {
    id: 'kaz-frekvence',
    guide: 'zuby-a-usta',
    statement: 'U zubního kazu hraje velkou roli, jak často během dne jíte cukr.',
    fact: true,
    explain:
      'Bakterie v plaku z cukru vyrábějí kyselinu, která rozpouští sklovinu — při každém „přísunu“ znovu.',
  },
  {
    id: 'prasky-hlava',
    guide: 'bolest-hlavy',
    statement: 'Prášky proti bolesti hlavy brané skoro denně můžou bolest hlavy samy vyvolávat.',
    fact: true,
    explain: 'Říká se tomu bolest hlavy z nadužívání léků. Pomáhá řízené vysazení s lékařem.',
  },
  {
    id: 'osamelost-teenageri',
    guide: 'samota-a-vztahy',
    statement: 'Nejvíc osamělých lidí je podle WHO mezi teenagery.',
    fact: true,
    explain: 'Osamělých se cítí 17–21 % lidí ve věku 13–29 let, nejvíc dospívající.',
  },
  {
    id: 'spanek-testosteron',
    guide: 'testosteron',
    statement: 'Po týdnu spánku 5 hodin za noc klesl mladým mužům testosteron o 10–15 %.',
    fact: true,
    explain: 'Velká část testosteronu se tvoří ve spánku. Ukázala to studie v časopise JAMA.',
  },
  {
    id: 'tlak-130',
    guide: 'srdce-a-tlak',
    statement: 'Tlak 130/85 už podle evropských doporučení není v pásmu „nezvýšený“.',
    fact: true,
    explain:
      'Podle ESC 2024 je tlak 120–139 / 70–89 „zvýšený“ — ještě ne nemoc, ale signál začít s prevencí.',
  },
  {
    id: 'hlasitost-90',
    guide: 'sluch-a-sluchatka',
    statement: 'Při hlasitosti 90 dB je bezpečný poslech jen asi 4 hodiny týdně.',
    fact: true,
    explain: 'Podle WHO lze 80 dB poslouchat až 40 hodin týdně, ale 90 dB jen 4 hodiny.',
  },
  {
    id: 'sovy-20',
    guide: 'chronotyp',
    statement: 'Nejvíc „sovy“ jsou lidé kolem dvacítky.',
    fact: true,
    explain: 'V dospívání se vnitřní hodiny posouvají později a zhruba po dvacítce se zase vracejí dřív.',
  },
  {
    id: 'frekvence-2x',
    guide: 'posilovani-pro-zacatecniky',
    statement: 'Posilovat každý sval dvakrát týdně přináší víc než jednou týdně.',
    fact: true,
    explain: 'Metaanalýza ukázala větší nárůst svalů při frekvenci aspoň dvakrát týdně.',
  },
  {
    id: 'navaly-par-mesicu',
    guide: 'menopauza',
    statement: 'Návaly horka v přechodu obvykle přejdou během pár měsíců.',
    fact: false,
    explain: 'Ve velké studii SWAN trvaly v průměru 7,4 roku — a dají se účinně léčit.',
  },
  {
    id: 'geny-delka-zivota',
    guide: 'dlouhovekost',
    statement: 'O délce života rozhodují hlavně geny.',
    fact: false,
    explain: 'Velká analýza rodokmenů odhadla dědičnost délky života pod 10 %. Rozhodují hlavně návyky.',
  },
  {
    id: 'hvezdicka-nemoc',
    guide: 'vysledky-krve',
    statement: 'Hodnota v krevním testu mimo referenční rozmezí znamená nemoc.',
    fact: false,
    explain:
      'Rozmezí pokrývá 95 % zdravých lidí — zhruba každá dvacátá hodnota zdravého člověka z něj vybočí.',
  },
  {
    id: 'artroza-setrit',
    guide: 'bolest-kolen',
    statement: 'S artrózou kolene je nejlepší kloub šetřit a necvičit.',
    fact: false,
    explain: 'Cvičení je základ léčby artrózy — podle přehledu Cochrane zmírní bolest a zlepší hybnost.',
  },
  {
    id: 'textovaci-krk',
    guide: 'bolest-krku',
    statement: 'Skloněná hlava nad mobilem je hlavní příčinou bolesti krku u mladých lidí.',
    fact: false,
    explain:
      'Studie u mladých dospělých souvislost nenašla. Víc vadí dlouhé hodiny v jedné poloze bez pohybu.',
  },
  {
    id: 'unava-vazna-nemoc',
    guide: 'unava',
    statement: 'Za dlouhodobou únavou obvykle stojí vážná tělesná nemoc.',
    fact: false,
    explain:
      'U unavených pacientů praktického lékaře měl vážnou tělesnou nemoc jen asi 1 z 25 — častější byla deprese a málo spánku.',
  },
  {
    id: 'maslo-vs-olej',
    guide: 'tuky',
    statement: 'Máslo je pro srdce zdravější než olivový olej.',
    fact: false,
    explain:
      'Máslo má hodně nasycených tuků, které zvyšují LDL cholesterol. Olivový olej srdci prospívá víc.',
  },
  {
    id: 'vyhoreni-volno',
    guide: 'vyhoreni',
    statement: 'Na vyhoření stačí týden dovolené.',
    fact: false,
    explain:
      'Odpočinek uleví, ale když se nezmění podmínky práce, vyčerpání se vrátí. Víc pomáhají změny v organizaci práce.',
  },
  {
    id: 'bez-pridaneho-cukru',
    guide: 'etikety-potravin',
    statement: 'Nápis „bez přidaného cukru“ znamená, že potravina neobsahuje žádný cukr.',
    fact: false,
    explain: 'Jen to, že výrobce cukr nepřidal. Přirozený cukr z ovoce nebo mléka v ní být může.',
  },
  {
    id: 'unik-moci-normalni',
    guide: 'panevni-dno',
    statement: 'Únik moči po porodu je normální a nedá se s ním nic dělat.',
    fact: false,
    explain:
      'Cvičení pánevního dna vedlo u žen se stresovým únikem k vyléčení osmkrát častěji než žádná léčba.',
  },
  {
    id: 'b12-rasy',
    guide: 'rostlinna-strava',
    statement: 'Vegan získá dost vitamínu B12 ze spiruliny nebo kysaného zelí.',
    fact: false,
    explain: 'Většinou jde o neúčinné formy B12. Spolehlivý je jen doplněk nebo obohacené potraviny.',
  },
  {
    id: 'rakovina-geny',
    guide: 'prevence-rakoviny',
    statement: 'Rakovina je hlavně otázka genů, životním stylem se jí předejít nedá.',
    fact: false,
    explain:
      'Podle WHO jde zhruba 38 % nádorů předejít — hlavně nekouřením, méně alkoholu, pohybem a očkováním.',
  },
  {
    id: 'klistata-antibiotika',
    guide: 'ockovani-dospelych',
    statement: 'Klíšťovou encefalitidu jde vyléčit antibiotiky.',
    fact: false,
    explain: 'Je to virus — antibiotika na něj nefungují. Chrání jen očkování.',
  },
  {
    id: 'bezlepkova-zdravejsi',
    guide: 'laktoza-a-lepek',
    statement: 'Bezlepková strava je zdravější pro každého, nejen pro lidi s celiakií.',
    fact: false,
    explain: 'Lidem bez celiakie přínos neprokázala. Bezlepkové výrobky bývají dražší a chudší na vlákninu.',
  },
]

export const QUIZ_LENGTH = 10
