import type { Nutrient, NutrientId } from './types'

const RHP = (value: number) => ({ ref: { value, kind: 'RHP' as const } })

/**
 * Referenční hodnoty: RHP (EU NRV, nař. 1169/2011, příloha XIII), kde existují; jinak adekvátní příjem EFSA.
 * Prahy „zdroj“: 15 % referenční hodnoty na 100 g, pokud neplatí výslovné pravidlo výživového tvrzení EU
 * (nař. 1924/2006) nebo zdokumentované pravidlo aplikace.
 * Funkce = znění zdravotních tvrzení schválených EU (nař. 432/2012) v české verzi, mírně zkrácené.
 */
export const NUTRIENTS: Record<NutrientId, Nutrient> = {
  protein: {
    id: 'protein',
    name: 'Bílkoviny',
    kind: 'Bílkoviny a aminokyseliny',
    unit: 'g',
    ref: { value: 50, kind: 'RHP' },
    threshold: {
      value: 10,
      basis:
        'Pravidlo aplikace: ≥ 10 g na 100 g. (Výživové tvrzení EU „zdroj bílkovin“ se počítá z energie — ≥ 12 % kcal — a označilo by i nízkokalorickou listovou zeleninu.)',
    },
    blurb:
      'Řetězce aminokyselin, ze kterých tělo staví a obnovuje tkáně, enzymy, hormony a transportní bílkoviny.',
    functions: [
      'Přispívají k růstu svalové hmoty',
      'Přispívají k udržení svalové hmoty',
      'Přispívají k udržení normálního stavu kostí',
    ],
  },
  eaa: {
    id: 'eaa',
    name: 'Esenciální aminokyseliny',
    kind: 'Bílkoviny a aminokyseliny',
    unit: 'g',
    qualitative: {
      rule: 'Plnohodnotná bílkovina (všech devět EAA ve vyváženém poměru) a ≥ 10 g bílkovin na 100 g.',
    },
    blurb:
      'Devět aminokyselin, které si tělo neumí vyrobit (mj. leucin, lysin, methionin). Živočišné potraviny je obsahují všechny v dobrém poměru; rostlinné je vhodné kombinovat.',
    functions: [],
  },
  fiber: {
    id: 'fiber',
    name: 'Vláknina',
    kind: 'Ostatní',
    unit: 'g',
    ref: { value: 25, kind: 'AI EFSA' },
    threshold: { value: 3, basis: 'Výživové tvrzení EU „zdroj vlákniny“: ≥ 3 g na 100 g (nař. 1924/2006).' },
    blurb:
      'Rostlinné sacharidy, které se v tenkém střevě nestráví. Část z nich ve tlustém střevě fermentují bakterie na mastné kyseliny s krátkým řetězcem.',
    functions: [
      'Vláknina z ovesných zrn přispívá ke zvětšení objemu stolice',
      'Vláknina z pšeničných otrub přispívá k urychlení střevního tranzitu',
      'Bylo prokázáno, že ovesný beta-glukan snižuje hladinu cholesterolu v krvi (3 g denně)',
    ],
  },
  vitA: {
    id: 'vitA',
    name: 'Vitamín A',
    kind: 'Vitamín',
    unit: 'µg',
    ...RHP(800),
    blurb:
      'Retinol a provitamínové karotenoidy. Je potřeba pro zrakový pigment rodopsin a pro epitelové tkáně.',
    functions: [
      'Přispívá k udržení normálního stavu zraku',
      'Přispívá k udržení normálního stavu pokožky',
      'Přispívá k udržení normálního stavu sliznic',
      'Přispívá k normální činnosti imunitního systému',
    ],
  },
  vitC: {
    id: 'vitC',
    name: 'Vitamín C',
    kind: 'Vitamín',
    unit: 'mg',
    ...RHP(80),
    blurb: 'Ve vodě rozpustný antioxidant a kofaktor enzymů, mimo jiné těch, které stabilizují kolagen.',
    functions: [
      'Přispívá k normální tvorbě kolagenu pro normální funkci kůže',
      'Zvyšuje vstřebávání železa',
      'Přispívá k ochraně buněk před oxidativním stresem',
    ],
  },
  vitD: {
    id: 'vitD',
    name: 'Vitamín D',
    kind: 'Vitamín',
    unit: 'µg',
    ...RHP(5),
    blurb:
      'Vzniká v kůži působením UVB záření, v potravinách je ho málo. Aktivuje se v játrech a ledvinách; řídí hospodaření s vápníkem a fosforem.',
    functions: [
      'Přispívá k udržení normálního stavu kostí',
      'Přispívá k normálnímu vstřebávání/využití vápníku a fosforu',
      'Přispívá k udržení normální funkce svalů',
    ],
  },
  vitE: {
    id: 'vitE',
    name: 'Vitamín E',
    kind: 'Vitamín',
    unit: 'mg',
    ...RHP(12),
    blurb: 'V tucích rozpustný antioxidant, který sedí v buněčných membránách.',
    functions: ['Přispívá k ochraně buněk před oxidativním stresem'],
  },
  vitK: {
    id: 'vitK',
    name: 'Vitamín K',
    kind: 'Vitamín',
    unit: 'µg',
    ...RHP(75),
    blurb: 'Kofaktor bílkovin pro srážení krve a mineralizaci kostí (např. osteokalcinu).',
    functions: ['Přispívá k normální srážlivosti krve', 'Přispívá k udržení normálního stavu kostí'],
  },
  b1: {
    id: 'b1',
    name: 'Vitamín B1 (thiamin)',
    kind: 'Vitamín',
    unit: 'mg',
    ...RHP(1.1),
    blurb: 'Koenzym metabolismu sacharidů — klíčový pro přísun energie do náročných tkání.',
    functions: [
      'Přispívá k normální činnosti srdce',
      'Přispívá k normálnímu energetickému metabolismu',
      'Přispívá k normální činnosti nervové soustavy',
    ],
  },
  b6: {
    id: 'b6',
    name: 'Vitamín B6',
    kind: 'Vitamín',
    unit: 'mg',
    ...RHP(1.4),
    blurb: 'Koenzym ve více než 100 reakcích, mnoha z nich v metabolismu aminokyselin a neurotransmiterů.',
    functions: [
      'Přispívá k normální činnosti nervové soustavy',
      'Přispívá k normálnímu metabolismu bílkovin a glykogenu',
      'Přispívá k normálnímu metabolismu homocysteinu',
    ],
  },
  b12: {
    id: 'b12',
    name: 'Vitamín B12',
    kind: 'Vitamín',
    unit: 'µg',
    ...RHP(2.5),
    blurb:
      'Přirozeně jen v živočišných potravinách. Vstřebává se s vnitřním faktorem v konečné části tenkého střeva; zásoby jsou v játrech.',
    functions: [
      'Přispívá k normální činnosti nervové soustavy',
      'Přispívá k normální psychické činnosti',
      'Přispívá k normální tvorbě červených krvinek',
      'Přispívá k normálnímu metabolismu homocysteinu',
    ],
  },
  folate: {
    id: 'folate',
    name: 'Folát',
    kind: 'Vitamín',
    unit: 'µg',
    ...RHP(200),
    blurb: 'Přenašeč jednouhlíkatých skupin pro syntézu DNA a metabolismus aminokyselin.',
    functions: [
      'Přispívá k normální syntéze aminokyselin',
      'Přispívá k normálnímu metabolismu homocysteinu',
      'Přispívá k normální krvetvorbě',
    ],
  },
  choline: {
    id: 'choline',
    name: 'Cholin',
    kind: 'Ostatní',
    unit: 'mg',
    ref: { value: 400, kind: 'AI EFSA' },
    blurb: 'Stavební kámen buněčných membrán (fosfatidylcholin) a prekurzor neurotransmiteru acetylcholinu.',
    functions: [
      'Přispívá k normálnímu metabolismu homocysteinu',
      'Přispívá k normálnímu metabolismu lipidů',
      'Přispívá k udržení normální funkce jater',
    ],
  },
  calcium: {
    id: 'calcium',
    name: 'Vápník',
    kind: 'Minerální látka',
    unit: 'mg',
    ...RHP(800),
    blurb: 'Asi 99 % vápníku je v kostech a zubech; zbytek řídí stah svalů a přenos nervových signálů.',
    functions: [
      'Je potřebný pro udržení normálního stavu kostí',
      'Přispívá k normální činnosti svalů',
      'Přispívá k normálnímu přenosu nervových vzruchů',
    ],
  },
  phosphorus: {
    id: 'phosphorus',
    name: 'Fosfor',
    kind: 'Minerální látka',
    unit: 'mg',
    ...RHP(700),
    blurb: 'S vápníkem tvoří hydroxyapatit a je součástí ATP, DNA i buněčných membrán.',
    functions: [
      'Přispívá k udržení normálního stavu kostí',
      'Přispívá k normálnímu energetickému metabolismu',
    ],
  },
  magnesium: {
    id: 'magnesium',
    name: 'Hořčík',
    kind: 'Minerální látka',
    unit: 'mg',
    ...RHP(375),
    blurb: 'Kofaktor stovek enzymů, nakládání s ATP a elektrické stability svalových a nervových buněk.',
    functions: [
      'Přispívá k normální činnosti svalů',
      'Přispívá k elektrolytické rovnováze',
      'Přispívá k udržení normálního stavu kostí',
    ],
  },
  potassium: {
    id: 'potassium',
    name: 'Draslík',
    kind: 'Minerální látka',
    unit: 'mg',
    ...RHP(2000),
    blurb: 'Hlavní kladný iont uvnitř buněk; nastavuje klidový membránový potenciál nervů a svalů.',
    functions: [
      'Přispívá k udržení normálního krevního tlaku',
      'Přispívá k normální činnosti svalů',
      'Přispívá k normální činnosti nervové soustavy',
    ],
  },
  iron: {
    id: 'iron',
    name: 'Železo',
    kind: 'Minerální látka',
    unit: 'mg',
    ...RHP(14),
    blurb:
      'Jádro hemoglobinu a myoglobinu. Hemové železo (maso, ryby) se vstřebává lépe než nehemové (rostliny).',
    functions: [
      'Přispívá k normální kognitivní funkci',
      'Přispívá k normálnímu přenosu kyslíku v těle',
      'Přispívá k normální tvorbě červených krvinek',
    ],
  },
  zinc: {
    id: 'zinc',
    name: 'Zinek',
    kind: 'Minerální látka',
    unit: 'mg',
    ...RHP(10),
    blurb: 'Strukturní a katalytická součást mnoha enzymů a transkripčních faktorů.',
    functions: [
      'Přispívá k udržení normálního stavu pokožky',
      'Přispívá k udržení normálního stavu vlasů a nehtů',
      'Přispívá k udržení normálního stavu zraku',
      'Přispívá k normálnímu acidobazickému metabolismu',
      'Přispívá k normální činnosti imunitního systému',
    ],
  },
  iodine: {
    id: 'iodine',
    name: 'Jód',
    kind: 'Minerální látka',
    unit: 'µg',
    ...RHP(150),
    blurb:
      'Nezbytný pro tvorbu hormonů štítné žlázy. Obsah v potravinách silně kolísá podle půdy, krmiva a zpracování.',
    functions: ['Přispívá k normální kognitivní funkci', 'Přispívá k normální tvorbě hormonů štítné žlázy'],
  },
  omega3: {
    id: 'omega3',
    name: 'Omega-3 EPA + DHA',
    kind: 'Mastná kyselina',
    unit: 'mg',
    ref: { value: 250, kind: 'dle tvrzení EU' },
    threshold: {
      value: 40,
      basis: 'Výživové tvrzení EU „zdroj omega-3“: ≥ 40 mg EPA + DHA na 100 g (nař. 1924/2006).',
    },
    blurb: 'Omega-3 s dlouhým řetězcem z ryb a řas. DHA je hlavní stavební tuk mozku a sítnice.',
    functions: [
      'EPA a DHA přispívají k normální činnosti srdce (250 mg denně)',
      'DHA přispívá k udržení normální činnosti mozku (250 mg denně)',
      'DHA přispívá k udržení normálního stavu zraku (250 mg denně)',
    ],
  },
  ala: {
    id: 'ala',
    name: 'Omega-3 ALA',
    kind: 'Mastná kyselina',
    unit: 'g',
    ref: { value: 2, kind: 'dle tvrzení EU' },
    threshold: {
      value: 0.3,
      basis: 'Výživové tvrzení EU „zdroj omega-3“: ≥ 0,3 g ALA na 100 g (nař. 1924/2006).',
    },
    blurb: 'Rostlinná omega-3 (kyselina alfa-linolenová). Na EPA/DHA se přeměňuje jen v malé míře.',
    functions: ['ALA přispívá k udržení normální hladiny cholesterolu v krvi (2 g denně)'],
  },
  lutein: {
    id: 'lutein',
    name: 'Lutein + zeaxantin',
    kind: 'Ostatní',
    unit: 'µg',
    threshold: {
      value: 1000,
      basis:
        'Pravidlo aplikace: ≥ 1 mg na 100 g. Pro lutein neexistuje referenční hodnota EU ani schválené zdravotní tvrzení.',
    },
    blurb:
      'Žluté karotenoidy, které se hromadí ve žluté skvrně sítnice jako „makulární pigment“. Schválené zdravotní tvrzení EU neexistuje.',
    functions: [],
  },
  cultures: {
    id: 'cultures',
    name: 'Živé kultury',
    kind: 'Ostatní',
    unit: 'g',
    qualitative: { rule: 'Obsahuje živé mikroorganismy (po fermentaci tepelně neošetřeno).' },
    blurb:
      'Živé mikroorganismy v některých fermentovaných potravinách. Označení „probiotikum“ patří jen konkrétním kmenům s prokázaným účinkem.',
    functions: [
      'Živé kultury v jogurtu nebo zakysaném mléčném výrobku zlepšují trávení laktózy obsažené ve výrobku u osob, které mají potíže s trávením laktózy',
    ],
  },
  water: {
    id: 'water',
    name: 'Voda',
    kind: 'Ostatní',
    unit: 'g',
    qualitative: { rule: 'Neřadí se podle potravin — většinu příjmu tvoří nápoje.' },
    blurb: 'Rozpouštědlo a transportní médium téměř všech dějů; ledviny řídí, kolik jí tělo udrží.',
    functions: [
      'Přispívá k udržení normálních fyzických a kognitivních funkcí',
      'Přispívá k udržení normální termoregulace',
    ],
  },
}

export const NUTRIENT_LIST = Object.values(NUTRIENTS)
export const NUTRIENT_IDS = Object.keys(NUTRIENTS) as NutrientId[]
