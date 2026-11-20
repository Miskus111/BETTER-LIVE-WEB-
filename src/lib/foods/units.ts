/**
 * Unit conversions used by the food import pipeline. Factors from the official definitions:
 * - vitamin D: 1 IU = 0.025 µg (cholecalciferol/ergocalciferol)
 * - vitamin A: 1 IU retinol = 0.3 µg RAE; 1 IU β-carotene (supplement) = 0.3 µg β-carotene → 0.15 µg RAE
 *   is NOT used — food β-carotene IU cannot be converted to RAE without knowing the source, so we only
 *   convert retinol IU (animal foods).
 * - vitamin E: 1 IU natural d-α-tocopherol = 0.67 mg α-tocopherol; 1 IU synthetic dl-α = 0.45 mg
 * - folate: µg DFE = µg food folate + 1.7 × µg folic acid
 * - energy: 1 kcal = 4.184 kJ (Reg. (EU) 1169/2011 Annex XIV uses kJ/kcal factors with the same ratio)
 * - salt: salt (g) = sodium (g) × 2.5 (Reg. (EU) 1169/2011 Annex I)
 */
export const iuToUgVitD = (iu: number) => iu * 0.025
export const iuToUgRetinol = (iu: number) => iu * 0.3
export const iuToMgAlphaTocopherol = (iu: number, form: 'natural' | 'synthetic') =>
  iu * (form === 'natural' ? 0.67 : 0.45)
export const folateDfe = (foodFolateUg: number, folicAcidUg: number) => foodFolateUg + 1.7 * folicAcidUg
export const kcalToKj = (kcal: number) => kcal * 4.184
export const kjToKcal = (kj: number) => kj / 4.184
/** sodium in mg → salt in g */
export const saltFromSodiumMg = (sodiumMg: number) => (sodiumMg / 1000) * 2.5

/** Atwater energy (kcal) from macros: protein 4, available carbohydrate 4, fat 9, alcohol 7, fibre 2. */
export function atwaterKcal(m: {
  protein: number
  fat: number
  carbsAvailable: number
  fiber: number
  alcohol: number
}) {
  return 4 * m.protein + 4 * m.carbsAvailable + 9 * m.fat + 7 * m.alcohol + 2 * m.fiber
}

/** Round to a sensible number of significant digits for display/storage without inventing precision. */
export function round(v: number) {
  if (v === 0) return 0
  const a = Math.abs(v)
  const d = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : 3
  return Number(v.toFixed(d))
}
