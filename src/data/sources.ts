import type { Evidence, Source, SystemId } from './types'

export const SRC = {
  euRegister: {
    title: 'Registr výživových a zdravotních tvrzení EU (nař. (EU) 432/2012)',
    url: 'https://ec.europa.eu/food/food-feed-portal/screen/health-claims/eu-register',
  },
  claimsReg: {
    title: 'Nařízení (ES) 1924/2006 — výživová tvrzení („zdroj“, „vysoký obsah“)',
    url: 'https://czk-lex.europa.eu/eli/reg/2006/1924/oj',
  },
  fic: {
    title: 'Nařízení (EU) 1169/2011, příloha XIII — referenční hodnoty příjmu',
    url: 'https://czk-lex.europa.eu/eli/reg/2011/1169/oj',
  },
  ods: {
    title: 'NIH Office of Dietary Supplements — přehledy živin',
    url: 'https://ods.od.nih.gov/factsheets/list-all/',
  },
  efsa: {
    title: 'EFSA — referenční hodnoty příjmu živin',
    url: 'https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values',
  },
  fdc: { title: 'USDA FoodData Central', url: 'https://fdc.nal.usda.gov/' },
  isapp: {
    title: 'Marco a kol. (2021) Konsenzus ISAPP o fermentovaných potravinách, Nat Rev Gastroenterol Hepatol',
    url: 'https://www.nature.com/articles/s41575-020-00390-5',
  },
  areds2: {
    title: 'AREDS2 Research Group (2013), JAMA',
    url: 'https://jamanetwork.com/journals/jama/fullarticle/1684847',
  },
  organicReg: {
    title: 'Pravidla ekologické produkce EU — nařízení (EU) 2018/848',
    url: 'https://czk-lex.europa.eu/eli/reg/2018/848/oj',
  },
} satisfies Record<string, Source>

export const ALL_SOURCES: Source[] = Object.values(SRC)

export const EVIDENCE: Record<Evidence, { label: string; desc: string; color: string }> = {
  established: {
    label: 'Prokázané',
    desc: 'Zdravotní tvrzení schválené EU (nař. 432/2012) nebo učebnicová fyziologie.',
    color: '#5ee7ff',
  },
  plausible: {
    label: 'Pravděpodobné',
    desc: 'Biologicky podložený mechanismus doložený daty, ale ne schválené tvrzení pro tento orgán.',
    color: '#a5beff',
  },
  preliminary: {
    label: 'Předběžné',
    desc: 'Nový nebo jen pro určitou skupinu platný výzkum. Není základem pro tvrzení.',
    color: '#f5c46a',
  },
}

export const SYSTEMS: { id: SystemId; name: string }[] = [
  { id: 'nervous', name: 'Nervová' },
  { id: 'cardio', name: 'Srdce a dýchání' },
  { id: 'digestive', name: 'Trávicí' },
  { id: 'musculoskeletal', name: 'Pohybová' },
  { id: 'urinary', name: 'Močová' },
  { id: 'integumentary', name: 'Kůže' },
]
