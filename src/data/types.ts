/**
 * Shared domain types for FLX. All content lives in typed modules under src/data;
 * derived relationships (food → organ, nutrient → food, …) are computed in src/lib/nutrition.ts.
 */

// ── Evidence ────────────────────────────────────────────────────────────────
export type Evidence = 'established' | 'plausible' | 'preliminary'

// ── Nutrients ───────────────────────────────────────────────────────────────
export type NutrientKind =
  'Vitamín' | 'Minerální látka' | 'Mastná kyselina' | 'Bílkoviny a aminokyseliny' | 'Ostatní'
export type Unit = 'g' | 'mg' | 'µg'

export type NutrientId =
  | 'protein'
  | 'eaa'
  | 'fiber'
  | 'vitA'
  | 'vitC'
  | 'vitD'
  | 'vitE'
  | 'vitK'
  | 'b1'
  | 'b6'
  | 'b12'
  | 'folate'
  | 'choline'
  | 'calcium'
  | 'phosphorus'
  | 'magnesium'
  | 'potassium'
  | 'iron'
  | 'zinc'
  | 'iodine'
  | 'omega3'
  | 'ala'
  | 'lutein'
  | 'cultures'
  | 'water'

/** RHP = referenční hodnota příjmu (EU NRV, nař. 1169/2011); AI EFSA = adekvátní příjem dle EFSA */
export type RefKind = 'RHP' | 'AI EFSA' | 'dle tvrzení EU'

export interface Nutrient {
  id: NutrientId
  name: string
  kind: NutrientKind
  unit: Unit
  /** Daily reference value and what it is (EU NRV from Reg. 1169/2011 where one exists). */
  ref?: { value: number; kind: RefKind }
  /**
   * Override for the "source of" threshold per 100 g. Without it the threshold is
   * computed as 15 % of `ref` (EU "source of" rule for vitamins/minerals).
   */
  threshold?: { value: number; basis: string }
  /** Qualitative nutrients (live cultures, essential amino acids, water) are not ranked by amount. */
  qualitative?: { rule: string }
  blurb: string
  /** EU-authorised function statements (Reg. 432/2012), condensed wording. Empty = no authorised claim. */
  functions: string[]
}

// ── Organs ──────────────────────────────────────────────────────────────────
export type SystemId = 'nervous' | 'cardio' | 'digestive' | 'musculoskeletal' | 'urinary' | 'integumentary'

export type OrganId =
  | 'brain'
  | 'eyes'
  | 'heart'
  | 'lungs'
  | 'liver'
  | 'stomach'
  | 'intestines'
  | 'kidneys'
  | 'bones'
  | 'muscles'
  | 'skin'

export interface OrganNutrient {
  id: NutrientId
  role: string
  level: Evidence
  /**
   * 'supports' (default): the organ depends on this nutrient — foods rich in it are linked to the organ.
   * 'handles': the organ absorbs, stores or activates it — shown as physiology, not used to link foods.
   */
  relation?: 'supports' | 'handles'
}

export interface Source {
  title: string
  url: string
}

export type ViewBox = [number, number, number, number]

export interface Organ {
  id: OrganId
  name: string
  shortName: string
  system: SystemId
  accent: string
  tagline: string
  what: string
  how: string
  why: string
  nutrients: OrganNutrient[]
  science: { points: string[]; notShown: string[]; sources: Source[] }
  /** viewBox the anatomy viewer zooms into when the organ is selected */
  zoom: ViewBox
  /** leader-line anchor in body coordinates */
  anchor: [number, number]
  /** body layer the organ belongs to (bones live on the skeleton layer, etc.) */
  layer: 'organs' | 'skeleton' | 'muscles' | 'skin'
  fermentation?: boolean
}

// ── Foods ───────────────────────────────────────────────────────────────────
export type FoodCategory =
  | 'Maso'
  | 'Ryby a mořské plody'
  | 'Vejce'
  | 'Mléčné výrobky'
  | 'Fermentované'
  | 'Ovoce'
  | 'Zelenina'
  | 'Ořechy a semínka'
  | 'Luštěniny'
  | 'Obiloviny a oleje'

export type ArtKind =
  | 'steak'
  | 'liver'
  | 'poultry'
  | 'fish'
  | 'egg'
  | 'bowl'
  | 'bottle'
  | 'jar'
  | 'cheese'
  | 'banana'
  | 'citrus'
  | 'berries'
  | 'leaf'
  | 'carrot'
  | 'potato'
  | 'seeds'
  | 'nut'
  | 'walnut'
  | 'pulses'
  | 'oats'
  | 'oil'

export interface Art {
  kind: ArtKind
  a: string
  b: string
}

export interface Food {
  id: string
  name: string
  category: FoodCategory
  /** what the 100 g refers to (raw, cooked, drained …) */
  basis: string
  /** USDA FoodData Central reference (description of the matched entry) */
  fdc: string
  kcal: number
  macros: { protein: number; fat: number; carbs: number; fiber: number }
  micros: Partial<Record<NutrientId, number>>
  completeProtein?: boolean
  liveCultures?: boolean
  sodiumMg?: number
  note?: string
  /** public path; placeholder SVG until licensed photography is supplied */
  image: string
  art: Art
}

// ── Products ────────────────────────────────────────────────────────────────
export type ShopCategory =
  | 'Zdraví střev'
  | 'Výživa mozku'
  | 'Zdraví srdce'
  | 'Zdraví kostí'
  | 'Výživa svalů'
  | 'Výživa pokožky'
  | 'Obecná výživa'

/** eu-bio: certified organic (EU leaf). conventional: not organic. wild: wild-caught, not eligible for organic. */
export type CertStatus = 'eu-bio' | 'conventional' | 'wild'

export interface Certification {
  status: CertStatus
  /** EU organic control-body code, e.g. "CZ-BIO-000" (sample codes in this prototype) */
  controlBody?: string
  verified: boolean
  note?: string
}

export interface ProductNutrition {
  kcal: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  micros: Partial<Record<NutrientId, number>>
  /** where the numbers come from */
  basis: string
}

export interface Product {
  id: string
  name: string
  size: string
  /** Kč, ukázkové ceny */
  price: number
  categories: ShopCategory[]
  shortDescription: string
  description: string
  highlights: string[]
  /** organic ingredients are marked with * */
  ingredients: string
  origin: string
  certification: Certification
  pasture?: 'verified'
  liveCultures?: boolean
  processing: string
  /** reference food in src/data/foods.ts used for nutrition and organ relevance */
  food?: string
  /** recipe blend of reference foods (shares sum to 1) */
  blend?: { food: string; share: number }[]
  /** manual nutrition, only where no reference food applies */
  nutrition?: ProductNutrition
  /** manual organ list, only where no reference food applies */
  organs?: OrganId[]
  images: string[]
  art: Art
  featured?: boolean
}
