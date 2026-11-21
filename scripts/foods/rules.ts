import type { PanelKey } from '../../src/lib/foods/panel'
/**
 * Curation rules applied on top of the raw FDC values: categories, flags, allergens, diet tags.
 * These are classifications, never nutrient numbers — every number comes from the dataset.
 */
import { CATEGORIES, type Category } from '../../src/lib/foods/categories'
export { CATEGORIES, type Category }

/** EU allergens (Reg. (EU) 1169/2011, Annex II) */
export const ALLERGENS = [
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soy',
  'milk',
  'nuts',
  'celery',
  'mustard',
  'sesame',
  'sulphites',
  'lupin',
  'molluscs',
] as const
export type Allergen = (typeof ALLERGENS)[number]

/** FDC food category → Czech subcategory label */
export const FDC_SUBCATEGORY: Record<string, string> = {
  'Beef Products': 'Hovězí',
  'Pork Products': 'Vepřové',
  'Lamb, Veal, and Game Products': 'Jehněčí, telecí a zvěřina',
  'Poultry Products': 'Drůbež',
  'Sausages and Luncheon Meats': 'Uzeniny',
  'Finfish and Shellfish Products': 'Ryby a plody moře',
  'Dairy and Egg Products': 'Mléko, sýry a vejce',
  'Vegetables and Vegetable Products': 'Zelenina',
  'Fruits and Fruit Juices': 'Ovoce a džusy',
  'Nut and Seed Products': 'Ořechy a semínka',
  'Legumes and Legume Products': 'Luštěniny',
  'Cereal Grains and Pasta': 'Obiloviny a těstoviny',
  'Breakfast Cereals': 'Snídaňové cereálie',
  'Baked Products': 'Pečivo',
  'Fats and Oils': 'Tuky a oleje',
  'Spices and Herbs': 'Koření a bylinky',
  Beverages: 'Nápoje',
  'Alcoholic Beverages': 'Alkoholické nápoje',
  Sweets: 'Sladkosti',
  Snacks: 'Snacky',
  'Soups, Sauces, and Gravies': 'Polévky a omáčky',
  'Meals, Entrees, and Side Dishes': 'Hotová jídla',
  'Restaurant Foods': 'Hotová jídla',
}

/**
 * Live cultures: only fermented foods normally sold unpasteurised after fermentation. Canned sauerkraut,
 * soy sauce, vinegar, beer and baked tempeh are heat-treated — no live cultures.
 */
export const LIVE_CULTURES: Record<string, string> = {
  yogurt: 'Jogurt obsahuje živé jogurtové kultury, pokud nebyl po fermentaci tepelně ošetřen (viz etiketa).',
  'yogurt-lowfat': 'Živé kultury, pokud nebyl po fermentaci tepelně ošetřen.',
  'yogurt-fruit': 'Živé kultury, pokud nebyl po fermentaci tepelně ošetřen.',
  'greek-yogurt': 'Živé kultury, pokud nebyl po fermentaci tepelně ošetřen.',
  'greek-yogurt-nonfat': 'Živé kultury, pokud nebyl po fermentaci tepelně ošetřen.',
  'greek-yogurt-lowfat': 'Živé kultury, pokud nebyl po fermentaci tepelně ošetřen.',
  kefir: 'Kefír obsahuje živé bakterie a kvasinky kefírových zrn.',
  buttermilk: 'Kysané podmáslí s živými kulturami (nepasterizované po zakysání).',
  kimchi: 'Čerstvé (nepasterizované) kimči obsahuje živé bakterie mléčného kvašení.',
  miso: 'Živé kultury jen v nepasterizovaném misu (bývá v chladicím boxu).',
  natto: 'Natto obsahuje živé Bacillus subtilis var. natto.',
}

/** Sources of complete protein (all essential amino acids in useful proportions). */
const COMPLETE_PROTEIN_CATS: Category[] = ['Maso', 'Drůbež', 'Ryby a mořské plody', 'Vejce', 'Mléčné výrobky']
const COMPLETE_PROTEIN_KEYS = new Set([
  'kefir',
  'tofu',
  'tofu-silken',
  'tempeh',
  'tempeh-cooked',
  'natto',
  'soybeans',
  'edamame',
  'quinoa',
  'quinoa-cooked',
  'buckwheat',
  'buckwheat-cooked',
  'hemp-seeds',
  'amaranth',
  'whey-protein',
])
const NOT_PROTEIN_SOURCE = new Set(['butter', 'ghee', 'cream', 'cream-light', 'chicken-broth', 'lard'])

export const isCompleteProtein = (key: string, cat: Category) =>
  !NOT_PROTEIN_SOURCE.has(key) && (COMPLETE_PROTEIN_CATS.includes(cat) || COMPLETE_PROTEIN_KEYS.has(key))

/** Drinks: EU "source of" thresholds are per 100 ml at half the solid level. */
const LIQUID_KEYS = new Set([
  'milk',
  'milk-semi',
  'milk-skim',
  'milk-goat',
  'buttermilk',
  'kefir',
  'chicken-broth',
  'lemon-juice',
])
export const isLiquid = (key: string, cat: Category) => cat === 'Nápoje' || LIQUID_KEYS.has(key)

const ALLERGENS_BY_CATEGORY: Partial<Record<Category, Allergen>> = {
  'Mléčné výrobky': 'milk',
  Vejce: 'eggs',
}
const ANIMAL: Category[] = ['Maso', 'Drůbež', 'Ryby a mořské plody']
const NON_VEGETARIAN_KEYS = new Set(['lard', 'fish-oil', 'cod-liver-oil', 'gummy', 'liver-pate'])
const NON_VEGAN_KEYS = new Set(['honey', 'whey-protein', 'butter', 'ghee'])

export function allergensFor(key: string, cat: Category, listed: string): Allergen[] {
  const out = new Set<Allergen>()
  for (const a of listed
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)) {
    if (!(ALLERGENS as readonly string[]).includes(a)) throw new Error(`${key}: unknown allergen "${a}"`)
    out.add(a as Allergen)
  }
  const byCat = ALLERGENS_BY_CATEGORY[cat]
  if (byCat && !['tofu', 'tofu-silken'].includes(key)) out.add(byCat)
  if (cat === 'Ryby a mořské plody' && !out.has('crustaceans') && !out.has('molluscs')) out.add('fish')
  return [...out]
}

export function dietFor(key: string, cat: Category, allergens: Allergen[]) {
  const animalAllergen = allergens.some((a) => ['fish', 'crustaceans', 'molluscs'].includes(a))
  const vegetarian = !ANIMAL.includes(cat) && !animalAllergen && !NON_VEGETARIAN_KEYS.has(key)
  const vegan =
    vegetarian &&
    !['Vejce', 'Mléčné výrobky'].includes(cat) &&
    !allergens.includes('milk') &&
    !allergens.includes('eggs') &&
    !NON_VEGAN_KEYS.has(key)
  return { vegan, vegetarian, glutenFree: !allergens.includes('gluten') }
}

/**
 * Values in the source record that are clearly wrong, shown as "no data" instead (we never invent a
 * replacement). Each entry says why; the reason goes into the food's provenance notes.
 */

/** Nutrients US law adds to "enriched" white flour; Czech flour isn't enriched. */
const ENRICHMENT: PanelKey[] = ['folate', 'iron', 'b1', 'b2', 'b3']
const US_FLOUR =
  'Americký záznam z obohacené mouky (v USA povinné). Česká mouka se neobohacuje, proto folát, železo a vitamíny B1, B2 a B3 neuvádíme — u českého výrobku by byly výrazně nižší.'

export const SUSPECT_VALUES: Record<string, { keys: PanelKey[]; reason: string }> = {
  'bread-white': { keys: ENRICHMENT, reason: US_FLOUR },
  'bread-rye': { keys: ENRICHMENT, reason: US_FLOUR },
  'bread-pumpernickel': { keys: ENRICHMENT, reason: US_FLOUR },
  roll: { keys: ENRICHMENT, reason: US_FLOUR },
  baguette: { keys: ENRICHMENT, reason: US_FLOUR },
  tortilla: { keys: ENRICHMENT, reason: US_FLOUR },
  croissant: { keys: ENRICHMENT, reason: US_FLOUR },
  cookies: { keys: ENRICHMENT, reason: US_FLOUR },
  cake: { keys: ENRICHMENT, reason: US_FLOUR },
  pancakes: { keys: ENRICHMENT, reason: US_FLOUR },
  nutella: {
    keys: ['satFat', 'monoFat', 'polyFat'],
    reason:
      'Rozpad tuků v FDC 168000 je zjevně chybný (28,4 g nasycených, 0 g nenasycených u pomazánky z lískových ořechů) — uvádíme „bez údajů“.',
  },
}
