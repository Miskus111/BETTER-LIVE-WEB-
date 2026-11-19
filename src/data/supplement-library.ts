import type { Evidence } from './types'

/**
 * Supplement library. Food supplements only — never prescription drugs, steroids, SARMs, peptides
 * or research chemicals. Doses are typical adult ranges from official sources (EFSA, NIH ODS, EU claim
 * conditions); `ul` is the EFSA tolerable upper intake level (all sources) where one exists.
 */
export type SupplementId =
  | 'vitamin-d3'
  | 'omega-3'
  | 'magnesium'
  | 'creatine'
  | 'zinc'
  | 'iron'
  | 'vitamin-b12'
  | 'folic-acid'
  | 'vitamin-c'
  | 'caffeine'
  | 'whey-protein'
  | 'probiotics'
  | 'melatonin'
  | 'iodine'
  | 'calcium'
  | 'collagen'
  | 'beta-alanine'
  | 'electrolytes'
  | 'vitamin-b6'
  | 'selenium'

export interface Supplement {
  id: SupplementId
  name: { cs: string; en: string }
  evidence: Evidence
  what: { cs: string; en: string }
  /** typical daily intake */
  dose: { min: number; max: number; unit: 'µg' | 'mg' | 'g' | 'CFU'; note?: { cs: string; en: string } }
  /** EFSA UL (all sources) or safe level, in the same unit as dose */
  ul?: { value: number; scope: 'total' | 'supplements'; note?: string }
  timing: { cs: string; en: string }
  interactions: {
    with: InteractionKey
    severity: 'avoid' | 'caution' | 'timing'
    text: { cs: string; en: string }
  }[]
  avoidIf: ('pregnancy' | 'breastfeeding' | 'kidney' | 'liver' | 'anticoagulants' | 'thyroid' | 'under18')[]
  /** link to the absorption/where-to-buy module */
  nutrient?: string
}

export type InteractionKey =
  | 'anticoagulants'
  | 'levothyroxine'
  | 'antibiotics_quinolone_tetracycline'
  | 'metformin'
  | 'antidepressants'
  | 'blood_pressure'
  | 'diuretics'
  | 'sedatives'
  | 'calcium_supplement'
  | 'iron_supplement'
  | 'stimulants'
  | 'immunosuppressants'

export const SUPPLEMENTS: Supplement[] = [
  {
    id: 'vitamin-d3',
    name: { cs: 'Vitamín D3', en: 'Vitamin D3' },
    evidence: 'established',
    what: {
      cs: 'Udržení normálního stavu kostí a funkce svalů; v ČR v zimě často chybí.',
      en: 'Maintains normal bones and muscle function; often low in winter at northern latitudes.',
    },
    dose: {
      min: 10,
      max: 25,
      unit: 'µg',
      note: {
        cs: '400–1 000 IU; vyšší dávky jen po změření hladiny.',
        en: '400–1,000 IU; higher only after a blood test.',
      },
    },
    ul: { value: 100, scope: 'total' },
    timing: { cs: 'S jídlem obsahujícím tuk.', en: 'With a meal containing fat.' },
    interactions: [
      {
        with: 'diuretics',
        severity: 'caution',
        text: {
          cs: 'Thiazidová diuretika + vysoké dávky D mohou zvýšit vápník v krvi.',
          en: 'Thiazide diuretics plus high-dose D can raise blood calcium.',
        },
      },
    ],
    avoidIf: ['kidney'],
    nutrient: 'vitD',
  },
  {
    id: 'omega-3',
    name: { cs: 'Omega-3 (EPA + DHA)', en: 'Omega-3 (EPA + DHA)' },
    evidence: 'established',
    what: {
      cs: 'EPA a DHA přispívají k normální činnosti srdce (250 mg/den).',
      en: 'EPA and DHA contribute to normal heart function (250 mg/day).',
    },
    dose: { min: 250, max: 1000, unit: 'mg' },
    ul: { value: 5000, scope: 'supplements', note: 'EFSA: up to 5 g/day EPA+DHA raises no safety concern' },
    timing: { cs: 'S nejtučnějším jídlem dne.', en: 'With the largest fatty meal of the day.' },
    interactions: [
      {
        with: 'anticoagulants',
        severity: 'caution',
        text: {
          cs: 'Vyšší dávky (> 1–3 g) mohou zesílit účinek léků na ředění krve.',
          en: 'Higher doses (> 1–3 g) may add to blood-thinner effects.',
        },
      },
    ],
    avoidIf: ['anticoagulants'],
    nutrient: 'omega3',
  },
  {
    id: 'magnesium',
    name: { cs: 'Hořčík', en: 'Magnesium' },
    evidence: 'established',
    what: {
      cs: 'Normální činnost svalů a nervové soustavy, snížení únavy.',
      en: 'Normal muscle and nerve function, reduction of tiredness.',
    },
    dose: {
      min: 100,
      max: 250,
      unit: 'mg',
      note: {
        cs: 'Elementární hořčík; bisglycinát nebo citrát.',
        en: 'Elemental magnesium; bisglycinate or citrate.',
      },
    },
    ul: { value: 250, scope: 'supplements' },
    timing: { cs: 'Večer nebo rozděleně, s jídlem.', en: 'Evening or split, with food.' },
    interactions: [
      {
        with: 'antibiotics_quinolone_tetracycline',
        severity: 'timing',
        text: {
          cs: 'Odstup alespoň 2 h před / 4–6 h po antibiotiku.',
          en: 'Separate by 2 h before / 4–6 h after the antibiotic.',
        },
      },
      {
        with: 'levothyroxine',
        severity: 'timing',
        text: {
          cs: 'Odstup alespoň 4 h od hormonu štítné žlázy.',
          en: 'Separate by at least 4 h from thyroid hormone.',
        },
      },
    ],
    avoidIf: ['kidney'],
    nutrient: 'magnesium',
  },
  {
    id: 'creatine',
    name: { cs: 'Kreatin monohydrát', en: 'Creatine monohydrate' },
    evidence: 'established',
    what: {
      cs: 'Zvyšuje výkon při opakovaných krátkých intenzivních výkonech (3 g/den).',
      en: 'Increases performance in repeated short high-intensity efforts (3 g/day).',
    },
    dose: { min: 3, max: 5, unit: 'g' },
    timing: { cs: 'Kdykoli, denně; na čase nezáleží.', en: 'Any time, daily; timing doesn’t matter.' },
    interactions: [],
    avoidIf: ['kidney', 'pregnancy', 'breastfeeding'],
  },
  {
    id: 'zinc',
    name: { cs: 'Zinek', en: 'Zinc' },
    evidence: 'established',
    what: {
      cs: 'Imunita, pokožka, vlasy, nehty; vyšší riziko nedostatku u veganů.',
      en: 'Immunity, skin, hair, nails; higher deficiency risk in vegans.',
    },
    dose: { min: 5, max: 15, unit: 'mg' },
    ul: { value: 25, scope: 'total' },
    timing: { cs: 'S jídlem, odděleně od železa a vápníku.', en: 'With food, apart from iron and calcium.' },
    interactions: [
      {
        with: 'antibiotics_quinolone_tetracycline',
        severity: 'timing',
        text: {
          cs: 'Odstup 2 h před / 4–6 h po antibiotiku.',
          en: 'Separate 2 h before / 4–6 h after the antibiotic.',
        },
      },
      {
        with: 'iron_supplement',
        severity: 'timing',
        text: { cs: 'Neužívat současně se železem.', en: 'Don’t take at the same time as iron.' },
      },
    ],
    avoidIf: [],
    nutrient: 'zinc',
  },
  {
    id: 'iron',
    name: { cs: 'Železo', en: 'Iron' },
    evidence: 'established',
    what: {
      cs: 'Jen při prokázaném nedostatku (feritin) — nadbytek škodí.',
      en: 'Only for confirmed deficiency (ferritin) — excess is harmful.',
    },
    dose: {
      min: 10,
      max: 40,
      unit: 'mg',
      note: {
        cs: 'Dávku určuje lékař podle krevních testů.',
        en: 'Dose set by a doctor based on blood tests.',
      },
    },
    ul: { value: 40, scope: 'total', note: 'EFSA 2024 safe level' },
    timing: {
      cs: 'Obden ráno nalačno s vitamínem C, bez kávy a čaje.',
      en: 'Alternate mornings, fasted, with vitamin C, no coffee or tea.',
    },
    interactions: [
      {
        with: 'calcium_supplement',
        severity: 'timing',
        text: {
          cs: 'Vápník snižuje vstřebání železa — odstup 2 h.',
          en: 'Calcium reduces iron absorption — separate by 2 h.',
        },
      },
      {
        with: 'levothyroxine',
        severity: 'timing',
        text: {
          cs: 'Odstup alespoň 4 h od hormonu štítné žlázy.',
          en: 'Separate by at least 4 h from thyroid hormone.',
        },
      },
      {
        with: 'antibiotics_quinolone_tetracycline',
        severity: 'timing',
        text: {
          cs: 'Odstup 2 h před / 4–6 h po antibiotiku.',
          en: 'Separate 2 h before / 4–6 h after the antibiotic.',
        },
      },
    ],
    avoidIf: [],
    nutrient: 'iron',
  },
  {
    id: 'vitamin-b12',
    name: { cs: 'Vitamín B12', en: 'Vitamin B12' },
    evidence: 'established',
    what: {
      cs: 'Nezbytný při veganské stravě; nervová soustava a krvetvorba.',
      en: 'Essential on a vegan diet; nervous system and blood formation.',
    },
    dose: {
      min: 4,
      max: 250,
      unit: 'µg',
      note: {
        cs: 'Denně 25–250 µg, nebo 1× týdně 2 000 µg.',
        en: '25–250 µg daily, or 2,000 µg once a week.',
      },
    },
    timing: { cs: 'Kdykoli.', en: 'Any time.' },
    interactions: [
      {
        with: 'metformin',
        severity: 'caution',
        text: {
          cs: 'Metformin dlouhodobě snižuje B12 — vhodné kontrolovat hladinu.',
          en: 'Long-term metformin lowers B12 — worth monitoring.',
        },
      },
    ],
    avoidIf: [],
    nutrient: 'b12',
  },
  {
    id: 'folic-acid',
    name: { cs: 'Kyselina listová', en: 'Folic acid' },
    evidence: 'established',
    what: {
      cs: 'Ženy plánující těhotenství: 400 µg denně (prevence vad neurální trubice).',
      en: 'Women planning pregnancy: 400 µg daily (neural-tube defect prevention).',
    },
    dose: { min: 200, max: 400, unit: 'µg' },
    ul: { value: 1000, scope: 'supplements' },
    timing: { cs: 'Kdykoli.', en: 'Any time.' },
    interactions: [],
    avoidIf: [],
    nutrient: 'folate',
  },
  {
    id: 'vitamin-c',
    name: { cs: 'Vitamín C', en: 'Vitamin C' },
    evidence: 'established',
    what: {
      cs: 'Většinou stačí strava; zvyšuje vstřebání železa.',
      en: 'Diet is usually enough; increases iron absorption.',
    },
    dose: { min: 80, max: 500, unit: 'mg' },
    timing: { cs: 'S jídlem; s železem pro lepší vstřebání.', en: 'With food; with iron to aid absorption.' },
    interactions: [],
    avoidIf: ['kidney'],
    nutrient: 'vitC',
  },
  {
    id: 'caffeine',
    name: { cs: 'Kofein', en: 'Caffeine' },
    evidence: 'established',
    what: {
      cs: 'Zvyšuje vytrvalostní výkon a bdělost (3 mg/kg 1 h před výkonem).',
      en: 'Improves endurance performance and alertness (3 mg/kg 1 h before).',
    },
    dose: {
      min: 100,
      max: 300,
      unit: 'mg',
      note: {
        cs: '≈ 3 mg/kg před výkonem; EFSA: do 400 mg denně a 200 mg najednou je pro dospělé bezpečné.',
        en: '≈ 3 mg/kg before exercise; EFSA: up to 400 mg/day and 200 mg per dose is safe for adults.',
      },
    },
    ul: { value: 400, scope: 'total', note: 'EFSA safe intake (mg/day)' },
    timing: { cs: 'Nejpozději 8 h před spaním.', en: 'At least 8 h before bed.' },
    interactions: [
      {
        with: 'stimulants',
        severity: 'avoid',
        text: { cs: 'Nekombinovat s dalšími stimulanty.', en: 'Don’t combine with other stimulants.' },
      },
      {
        with: 'blood_pressure',
        severity: 'caution',
        text: { cs: 'Může zvýšit krevní tlak.', en: 'May raise blood pressure.' },
      },
    ],
    avoidIf: ['pregnancy'],
  },
  {
    id: 'whey-protein',
    name: { cs: 'Syrovátkový protein', en: 'Whey protein' },
    evidence: 'established',
    what: {
      cs: 'Pohodlný zdroj bílkovin, když je strava nepokryje.',
      en: 'Convenient protein when meals fall short.',
    },
    dose: {
      min: 20,
      max: 40,
      unit: 'g',
      note: { cs: 'Na jednu porci; celkový příjem dle cíle.', en: 'Per serving; total intake per goal.' },
    },
    timing: { cs: 'Kdykoli, ideálně rozloženě během dne.', en: 'Any time, ideally spread through the day.' },
    interactions: [],
    avoidIf: ['kidney'],
    nutrient: 'protein',
  },
  {
    id: 'probiotics',
    name: { cs: 'Probiotika', en: 'Probiotics' },
    evidence: 'preliminary',
    what: {
      cs: 'Účinek je kmenově specifický; nejlépe doložené při užívání antibiotik.',
      en: 'Effects are strain-specific; best evidence around antibiotic use.',
    },
    dose: { min: 1e9, max: 1e10, unit: 'CFU' },
    timing: {
      cs: 'Podle výrobce; s odstupem 2 h od antibiotika.',
      en: 'Per the label; 2 h apart from antibiotics.',
    },
    interactions: [
      {
        with: 'immunosuppressants',
        severity: 'avoid',
        text: {
          cs: 'Při oslabené imunitě jen po poradě s lékařem.',
          en: 'With a weakened immune system only after medical advice.',
        },
      },
    ],
    avoidIf: [],
    nutrient: 'cultures',
  },
  {
    id: 'melatonin',
    name: { cs: 'Melatonin', en: 'Melatonin' },
    evidence: 'plausible',
    what: {
      cs: 'Zkracuje dobu usínání a zmírňuje jet lag (0,5–1 mg před spaním).',
      en: 'Shortens time to fall asleep and eases jet lag (0.5–1 mg before bed).',
    },
    dose: { min: 0.5, max: 1, unit: 'mg' },
    timing: { cs: '30–60 min před spaním.', en: '30–60 min before bed.' },
    interactions: [
      {
        with: 'sedatives',
        severity: 'avoid',
        text: { cs: 'Nekombinovat se sedativy a alkoholem.', en: 'Don’t combine with sedatives or alcohol.' },
      },
      {
        with: 'anticoagulants',
        severity: 'caution',
        text: { cs: 'Možná interakce s warfarinem.', en: 'Possible interaction with warfarin.' },
      },
    ],
    avoidIf: ['pregnancy', 'breastfeeding'],
  },
  {
    id: 'iodine',
    name: { cs: 'Jód', en: 'Iodine' },
    evidence: 'established',
    what: {
      cs: 'Pro těhotné, kojící a vegany bez jodidované soli.',
      en: 'For pregnancy, breastfeeding and vegans not using iodised salt.',
    },
    dose: { min: 100, max: 150, unit: 'µg' },
    ul: { value: 600, scope: 'total' },
    timing: { cs: 'Kdykoli.', en: 'Any time.' },
    interactions: [],
    avoidIf: ['thyroid'],
    nutrient: 'iodine',
  },
  {
    id: 'calcium',
    name: { cs: 'Vápník', en: 'Calcium' },
    evidence: 'established',
    what: {
      cs: 'Jen když strava nepokryje potřebu (např. bez mléčných výrobků).',
      en: 'Only if diet falls short (e.g. no dairy).',
    },
    dose: {
      min: 200,
      max: 500,
      unit: 'mg',
      note: { cs: 'Max. 500 mg najednou.', en: 'Max 500 mg at a time.' },
    },
    ul: { value: 2500, scope: 'total' },
    timing: {
      cs: 'Uhličitan s jídlem; odděleně od železa a zinku.',
      en: 'Carbonate with food; apart from iron and zinc.',
    },
    interactions: [
      {
        with: 'levothyroxine',
        severity: 'timing',
        text: { cs: 'Odstup alespoň 4 h.', en: 'Separate by at least 4 h.' },
      },
      {
        with: 'antibiotics_quinolone_tetracycline',
        severity: 'timing',
        text: { cs: 'Odstup 2 h před / 4–6 h po antibiotiku.', en: 'Separate 2 h before / 4–6 h after.' },
      },
      {
        with: 'iron_supplement',
        severity: 'timing',
        text: { cs: 'Snižuje vstřebání železa.', en: 'Reduces iron absorption.' },
      },
    ],
    avoidIf: ['kidney'],
    nutrient: 'calcium',
  },
  {
    id: 'collagen',
    name: { cs: 'Kolagen', en: 'Collagen' },
    evidence: 'preliminary',
    what: {
      cs: 'Studie o pleti a kloubech jsou malé a často placené výrobci.',
      en: 'Skin and joint studies are small and often industry-funded.',
    },
    dose: { min: 2.5, max: 10, unit: 'g' },
    timing: { cs: 'Kdykoli; s vitamínem C.', en: 'Any time; with vitamin C.' },
    interactions: [],
    avoidIf: [],
  },
  {
    id: 'beta-alanine',
    name: { cs: 'Beta-alanin', en: 'Beta-alanine' },
    evidence: 'plausible',
    what: {
      cs: 'Může zlepšit výkon v intervalech 1–4 min.',
      en: 'May improve performance in 1–4 min efforts.',
    },
    dose: {
      min: 3.2,
      max: 6.4,
      unit: 'g',
      note: { cs: 'Rozdělit do menších dávek (mravenčení).', en: 'Split into smaller doses (tingling).' },
    },
    timing: { cs: 'Denně, rozděleně.', en: 'Daily, split.' },
    interactions: [],
    avoidIf: ['pregnancy', 'breastfeeding'],
  },
  {
    id: 'electrolytes',
    name: { cs: 'Elektrolyty', en: 'Electrolytes' },
    evidence: 'plausible',
    what: {
      cs: 'Při dlouhém výkonu a velkém pocení (sodík 300–600 mg/h).',
      en: 'For long sessions and heavy sweating (300–600 mg sodium/h).',
    },
    dose: {
      min: 300,
      max: 600,
      unit: 'mg',
      note: { cs: 'Sodík za hodinu výkonu.', en: 'Sodium per hour of exercise.' },
    },
    timing: { cs: 'Během dlouhého tréninku.', en: 'During long training.' },
    interactions: [
      {
        with: 'blood_pressure',
        severity: 'caution',
        text: { cs: 'Při vysokém tlaku omezit sodík.', en: 'Limit sodium with high blood pressure.' },
      },
    ],
    avoidIf: ['kidney'],
  },
  {
    id: 'vitamin-b6',
    name: { cs: 'Vitamín B6', en: 'Vitamin B6' },
    evidence: 'established',
    what: {
      cs: 'Doplněk většinou zbytečný; pozor na vysoké dávky v B-komplexech.',
      en: 'Rarely needed; watch high doses in B-complexes.',
    },
    dose: { min: 1.4, max: 5, unit: 'mg' },
    ul: { value: 12, scope: 'total', note: 'EFSA 2023: 12 mg/day for adults' },
    timing: { cs: 'Kdykoli.', en: 'Any time.' },
    interactions: [],
    avoidIf: [],
    nutrient: 'b6',
  },
  {
    id: 'selenium',
    name: { cs: 'Selen', en: 'Selenium' },
    evidence: 'established',
    what: {
      cs: 'Většinou stačí strava (2 para ořechy pokryjí potřebu).',
      en: 'Diet is usually enough (2 Brazil nuts cover needs).',
    },
    dose: { min: 50, max: 100, unit: 'µg' },
    ul: { value: 255, scope: 'total', note: 'EFSA 2023' },
    timing: { cs: 'Kdykoli.', en: 'Any time.' },
    interactions: [],
    avoidIf: [],
  },
]

export const SUPPLEMENT_BY_ID = Object.fromEntries(SUPPLEMENTS.map((s) => [s.id, s])) as Record<
  SupplementId,
  Supplement
>

/** Never offered, recommended or stacked (hard exclusion list, checked in tests and by the coach). */
export const EXCLUDED =
  /steroid|anabol|sarm|ostarine|ligandrol|rad-?140|mk-?677|peptide|bpc-?157|tb-?500|melanotan|hgh|growth hormone|clenbuterol|dnp|trenbolon|testosteron|research chemical|tirzepatid|semaglutid/i
