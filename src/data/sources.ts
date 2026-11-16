import type { Evidence, Source, SystemId } from './types'

export const SRC = {
  euRegister: {
    title: 'EU Register of nutrition and health claims (Reg. (EU) 432/2012)',
    url: 'https://ec.europa.eu/food/food-feed-portal/screen/health-claims/eu-register',
  },
  claimsReg: {
    title: 'Regulation (EC) 1924/2006 — nutrition claims ("source of", "high in")',
    url: 'https://eur-lex.europa.eu/eli/reg/2006/1924/oj',
  },
  fic: {
    title: 'Regulation (EU) 1169/2011, Annex XIII — Nutrient Reference Values',
    url: 'https://eur-lex.europa.eu/eli/reg/2011/1169/oj',
  },
  ods: {
    title: 'NIH Office of Dietary Supplements — fact sheets',
    url: 'https://ods.od.nih.gov/factsheets/list-all/',
  },
  efsa: {
    title: 'EFSA Dietary Reference Values',
    url: 'https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values',
  },
  fdc: { title: 'USDA FoodData Central', url: 'https://fdc.nal.usda.gov/' },
  isapp: {
    title: 'Marco et al. (2021) ISAPP consensus statement on fermented foods, Nat Rev Gastroenterol Hepatol',
    url: 'https://www.nature.com/articles/s41575-020-00390-5',
  },
  areds2: {
    title: 'AREDS2 Research Group (2013), JAMA',
    url: 'https://jamanetwork.com/journals/jama/fullarticle/1684847',
  },
  organicReg: {
    title: 'EU organic production rules — Regulation (EU) 2018/848',
    url: 'https://eur-lex.europa.eu/eli/reg/2018/848/oj',
  },
} satisfies Record<string, Source>

export const ALL_SOURCES: Source[] = Object.values(SRC)

export const EVIDENCE: Record<Evidence, { label: string; desc: string; color: string }> = {
  established: {
    label: 'Established',
    desc: 'EU-authorised health claim (Reg. 432/2012) or textbook physiology.',
    color: '#5ee7ff',
  },
  plausible: {
    label: 'Plausible',
    desc: 'Biologically sound mechanism supported by data, but not an authorised claim for this organ.',
    color: '#a5beff',
  },
  preliminary: {
    label: 'Preliminary',
    desc: 'Emerging or population-specific research. Not a basis for claims.',
    color: '#f5c46a',
  },
}

export const SYSTEMS: { id: SystemId; name: string }[] = [
  { id: 'nervous', name: 'Nervous' },
  { id: 'cardio', name: 'Cardiorespiratory' },
  { id: 'digestive', name: 'Digestive' },
  { id: 'musculoskeletal', name: 'Musculoskeletal' },
  { id: 'urinary', name: 'Urinary' },
  { id: 'integumentary', name: 'Skin' },
]
