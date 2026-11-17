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
    explain: 'Spánek je po něm mělčí, přerušovaný a s méně REM fází.',
  },
  {
    id: 'spanek-nachlazeni',
    guide: 'imunita',
    statement: 'Lidé, kteří spí méně než 6 hodin, chytají nachlazení častěji.',
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
]

export const QUIZ_LENGTH = 10
