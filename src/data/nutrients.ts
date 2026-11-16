import type { Nutrient, NutrientId } from './types'

const NRV = (value: number) => ({ ref: { value, kind: 'EU NRV' as const } })

/**
 * Reference values: EU NRVs (Reg. 1169/2011, Annex XIII) where they exist; EFSA adequate intakes otherwise.
 * "Source of" thresholds: 15 % of the reference per 100 g unless an explicit EU nutrition-claim rule
 * (Reg. 1924/2006) or a documented app rule applies.
 */
export const NUTRIENTS: Record<NutrientId, Nutrient> = {
  protein: {
    id: 'protein',
    name: 'Protein',
    kind: 'Protein & amino acids',
    unit: 'g',
    ref: { value: 50, kind: 'EU RI' },
    threshold: {
      value: 10,
      basis:
        'App rule: ≥ 10 g per 100 g. (The EU "source of protein" claim is energy-based — ≥ 12 % of kcal — which would flag low-calorie leafy vegetables.)',
    },
    blurb:
      'Chains of amino acids used to build and maintain tissues, enzymes, hormones and transport proteins.',
    functions: [
      'Contributes to a growth in muscle mass',
      'Contributes to the maintenance of muscle mass',
      'Contributes to the maintenance of normal bones',
    ],
  },
  eaa: {
    id: 'eaa',
    name: 'Essential amino acids',
    kind: 'Protein & amino acids',
    unit: 'g',
    qualitative: { rule: 'Complete protein (all nine EAAs in proportion) and ≥ 10 g protein per 100 g.' },
    blurb:
      'The nine amino acids the body cannot make (incl. leucine, lysine, methionine). Animal foods supply all nine in proportion; plant foods are best combined.',
    functions: [],
  },
  fiber: {
    id: 'fiber',
    name: 'Dietary fibre',
    kind: 'Other',
    unit: 'g',
    ref: { value: 25, kind: 'EFSA AI' },
    threshold: { value: 3, basis: 'EU nutrition claim "source of fibre": ≥ 3 g per 100 g (Reg. 1924/2006).' },
    blurb:
      'Plant carbohydrates not digested in the small intestine. Some are fermented by colonic bacteria into short-chain fatty acids.',
    functions: [
      'Oat grain fibre contributes to an increase in faecal bulk',
      'Wheat bran fibre contributes to an acceleration of intestinal transit',
      'Oat beta-glucan has been shown to lower blood cholesterol (3 g/day)',
    ],
  },
  vitA: {
    id: 'vitA',
    name: 'Vitamin A',
    kind: 'Vitamin',
    unit: 'µg',
    ...NRV(800),
    blurb:
      'Retinol and pro-vitamin A carotenoids. Needed for the light-sensitive pigment rhodopsin and for epithelial tissues.',
    functions: [
      'Contributes to the maintenance of normal vision',
      'Contributes to the maintenance of normal skin',
      'Contributes to the maintenance of normal mucous membranes',
      'Contributes to the normal function of the immune system',
    ],
  },
  vitC: {
    id: 'vitC',
    name: 'Vitamin C',
    kind: 'Vitamin',
    unit: 'mg',
    ...NRV(80),
    blurb:
      'Water-soluble antioxidant and enzyme cofactor, including for the enzymes that stabilise collagen.',
    functions: [
      'Contributes to normal collagen formation for the normal function of skin',
      'Increases iron absorption',
      'Contributes to the protection of cells from oxidative stress',
    ],
  },
  vitD: {
    id: 'vitD',
    name: 'Vitamin D',
    kind: 'Vitamin',
    unit: 'µg',
    ...NRV(5),
    blurb:
      'Made in skin under UVB light and found in few foods. Activated in the liver and kidneys; regulates calcium and phosphate.',
    functions: [
      'Contributes to the maintenance of normal bones',
      'Contributes to normal absorption/utilisation of calcium and phosphorus',
      'Contributes to the maintenance of normal muscle function',
    ],
  },
  vitE: {
    id: 'vitE',
    name: 'Vitamin E',
    kind: 'Vitamin',
    unit: 'mg',
    ...NRV(12),
    blurb: 'Fat-soluble antioxidant that sits in cell membranes.',
    functions: ['Contributes to the protection of cells from oxidative stress'],
  },
  vitK: {
    id: 'vitK',
    name: 'Vitamin K',
    kind: 'Vitamin',
    unit: 'µg',
    ...NRV(75),
    blurb: 'Cofactor for proteins involved in blood clotting and bone mineralisation (e.g. osteocalcin).',
    functions: ['Contributes to normal blood clotting', 'Contributes to the maintenance of normal bones'],
  },
  b1: {
    id: 'b1',
    name: 'Vitamin B1 (thiamine)',
    kind: 'Vitamin',
    unit: 'mg',
    ...NRV(1.1),
    blurb: 'Coenzyme in carbohydrate metabolism — central to energy supply in high-demand tissues.',
    functions: [
      'Contributes to the normal function of the heart',
      'Contributes to normal energy-yielding metabolism',
      'Contributes to normal functioning of the nervous system',
    ],
  },
  b6: {
    id: 'b6',
    name: 'Vitamin B6',
    kind: 'Vitamin',
    unit: 'mg',
    ...NRV(1.4),
    blurb: 'Coenzyme in more than 100 reactions, many in amino-acid and neurotransmitter metabolism.',
    functions: [
      'Contributes to normal functioning of the nervous system',
      'Contributes to normal protein and glycogen metabolism',
      'Contributes to normal homocysteine metabolism',
    ],
  },
  b12: {
    id: 'b12',
    name: 'Vitamin B12',
    kind: 'Vitamin',
    unit: 'µg',
    ...NRV(2.5),
    blurb:
      'Found naturally only in animal foods. Absorbed with intrinsic factor in the terminal ileum; stored in the liver.',
    functions: [
      'Contributes to normal functioning of the nervous system',
      'Contributes to normal psychological function',
      'Contributes to normal red blood cell formation',
      'Contributes to normal homocysteine metabolism',
    ],
  },
  folate: {
    id: 'folate',
    name: 'Folate',
    kind: 'Vitamin',
    unit: 'µg',
    ...NRV(200),
    blurb: 'Carrier of one-carbon units for DNA synthesis and amino-acid metabolism.',
    functions: [
      'Contributes to normal amino acid synthesis',
      'Contributes to normal homocysteine metabolism',
      'Contributes to normal blood formation',
    ],
  },
  choline: {
    id: 'choline',
    name: 'Choline',
    kind: 'Other',
    unit: 'mg',
    ref: { value: 400, kind: 'EFSA AI' },
    blurb:
      'Building block of cell membranes (phosphatidylcholine) and precursor of the neurotransmitter acetylcholine.',
    functions: [
      'Contributes to normal homocysteine metabolism',
      'Contributes to normal lipid metabolism',
      'Contributes to the maintenance of normal liver function',
    ],
  },
  calcium: {
    id: 'calcium',
    name: 'Calcium',
    kind: 'Mineral',
    unit: 'mg',
    ...NRV(800),
    blurb:
      'About 99 % of body calcium is in bones and teeth; the rest drives muscle contraction and nerve signalling.',
    functions: [
      'Is needed for the maintenance of normal bones',
      'Contributes to normal muscle function',
      'Contributes to normal neurotransmission',
    ],
  },
  phosphorus: {
    id: 'phosphorus',
    name: 'Phosphorus',
    kind: 'Mineral',
    unit: 'mg',
    ...NRV(700),
    blurb: 'Forms hydroxyapatite with calcium and is part of ATP, DNA and cell membranes.',
    functions: [
      'Contributes to the maintenance of normal bones',
      'Contributes to normal energy-yielding metabolism',
    ],
  },
  magnesium: {
    id: 'magnesium',
    name: 'Magnesium',
    kind: 'Mineral',
    unit: 'mg',
    ...NRV(375),
    blurb:
      'Cofactor for hundreds of enzymes, ATP handling and the electrical stability of muscle and nerve cells.',
    functions: [
      'Contributes to normal muscle function',
      'Contributes to electrolyte balance',
      'Contributes to the maintenance of normal bones',
    ],
  },
  potassium: {
    id: 'potassium',
    name: 'Potassium',
    kind: 'Mineral',
    unit: 'mg',
    ...NRV(2000),
    blurb: 'The main positive ion inside cells; sets the resting membrane potential of nerve and muscle.',
    functions: [
      'Contributes to the maintenance of normal blood pressure',
      'Contributes to normal muscle function',
      'Contributes to normal functioning of the nervous system',
    ],
  },
  iron: {
    id: 'iron',
    name: 'Iron',
    kind: 'Mineral',
    unit: 'mg',
    ...NRV(14),
    blurb:
      'Core of haemoglobin and myoglobin. Haem iron (meat, fish) is absorbed better than non-haem iron (plants).',
    functions: [
      'Contributes to normal cognitive function',
      'Contributes to normal oxygen transport in the body',
      'Contributes to normal formation of red blood cells',
    ],
  },
  zinc: {
    id: 'zinc',
    name: 'Zinc',
    kind: 'Mineral',
    unit: 'mg',
    ...NRV(10),
    blurb: 'Structural and catalytic component of many enzymes and transcription factors.',
    functions: [
      'Contributes to the maintenance of normal skin',
      'Contributes to the maintenance of normal vision',
      'Contributes to normal acid-base metabolism',
      'Contributes to the normal function of the immune system',
    ],
  },
  iodine: {
    id: 'iodine',
    name: 'Iodine',
    kind: 'Mineral',
    unit: 'µg',
    ...NRV(150),
    blurb:
      'Required to make thyroid hormones. Content in foods varies strongly with soil, feed and processing.',
    functions: [
      'Contributes to normal cognitive function',
      'Contributes to the normal production of thyroid hormones',
    ],
  },
  omega3: {
    id: 'omega3',
    name: 'Omega-3 EPA + DHA',
    kind: 'Fatty acid',
    unit: 'mg',
    ref: { value: 250, kind: 'EU claim basis' },
    threshold: {
      value: 40,
      basis: 'EU nutrition claim "source of omega-3": ≥ 40 mg EPA + DHA per 100 g (Reg. 1924/2006).',
    },
    blurb: 'Long-chain omega-3s from fish and algae. DHA is a major structural fat of the brain and retina.',
    functions: [
      'EPA and DHA contribute to the normal function of the heart (250 mg/day)',
      'DHA contributes to the maintenance of normal brain function (250 mg/day)',
      'DHA contributes to the maintenance of normal vision (250 mg/day)',
    ],
  },
  ala: {
    id: 'ala',
    name: 'Omega-3 ALA',
    kind: 'Fatty acid',
    unit: 'g',
    ref: { value: 2, kind: 'EU claim basis' },
    threshold: {
      value: 0.3,
      basis: 'EU nutrition claim "source of omega-3": ≥ 0.3 g ALA per 100 g (Reg. 1924/2006).',
    },
    blurb: 'Plant omega-3 (alpha-linolenic acid). Converted to EPA/DHA only in small amounts.',
    functions: ['ALA contributes to the maintenance of normal blood cholesterol levels (2 g/day)'],
  },
  lutein: {
    id: 'lutein',
    name: 'Lutein + zeaxanthin',
    kind: 'Other',
    unit: 'µg',
    threshold: {
      value: 1000,
      basis:
        'App rule: ≥ 1 mg per 100 g. There is no EU reference value and no EU-authorised health claim for lutein.',
    },
    blurb:
      'Yellow carotenoids that concentrate in the macula of the retina as "macular pigment". No EU-authorised health claim exists.',
    functions: [],
  },
  cultures: {
    id: 'cultures',
    name: 'Live cultures',
    kind: 'Other',
    unit: 'g',
    qualitative: { rule: 'Contains live microorganisms (not heat-treated after fermentation).' },
    blurb:
      'Living microorganisms present in some fermented foods. "Probiotic" is reserved for specific strains with demonstrated benefit.',
    functions: [
      'Live yoghurt cultures improve lactose digestion in individuals with difficulty digesting lactose',
    ],
  },
  water: {
    id: 'water',
    name: 'Water',
    kind: 'Other',
    unit: 'g',
    qualitative: { rule: 'Not ranked by food — drinks supply most intake.' },
    blurb: 'Solvent and transport medium for nearly every process; kidneys regulate how much is kept.',
    functions: [
      'Contributes to the maintenance of normal physical and cognitive functions',
      "Contributes to the maintenance of normal regulation of the body's temperature",
    ],
  },
}

export const NUTRIENT_LIST = Object.values(NUTRIENTS)
export const NUTRIENT_IDS = Object.keys(NUTRIENTS) as NutrientId[]
