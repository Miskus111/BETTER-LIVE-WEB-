/**
 * Typical Czech dishes as calculated recipes: nutrients are summed from the ingredients' FDC values
 * and divided by the total ingredient weight. No yield or cooking-loss correction is applied (it is not
 * known for home cooking), so these values are marked as calculated and unverified.
 * Ingredient weights describe one batch of a standard home recipe.
 */
export interface RecipeDef {
  key: string
  nameCs: string
  nameEn: string
  portion: { label: string; grams: number }
  ingredients: { key: string; grams: number }[]
  note: string
}

export const RECIPES: RecipeDef[] = [
  {
    key: 'houskovy-knedlik',
    nameCs: 'Houskový knedlík',
    nameEn: 'Czech bread dumpling',
    portion: { label: '4 plátky', grams: 120 },
    ingredients: [
      { key: 'flour-wheat', grams: 500 },
      { key: 'milk', grams: 300 },
      { key: 'egg', grams: 50 },
      { key: 'roll', grams: 150 },
      { key: 'yeast-dry', grams: 7 },
      { key: 'salt', grams: 8 },
    ],
    note: 'Těsto z mouky, mléka, vejce, droždí a na kostičky nakrájených rohlíků; vařeno ve vodě.',
  },
  {
    key: 'svickova-omacka',
    nameCs: 'Svíčková omáčka',
    nameEn: 'Svíčková cream sauce',
    portion: { label: 'porce omáčky', grams: 200 },
    ingredients: [
      { key: 'carrot-cooked', grams: 150 },
      { key: 'celeriac', grams: 100 },
      { key: 'parsnip', grams: 100 },
      { key: 'onion-cooked', grams: 100 },
      { key: 'cream', grams: 200 },
      { key: 'butter', grams: 30 },
      { key: 'flour-wheat', grams: 20 },
      { key: 'sugar', grams: 10 },
      { key: 'lemon-juice', grams: 15 },
      { key: 'mustard', grams: 10 },
      { key: 'water', grams: 300 },
    ],
    note: 'Zelenina dušená a rozmixovaná se smetanou, zahuštěná moukou.',
  },
  {
    key: 'svickova',
    nameCs: 'Svíčková na smetaně s knedlíkem',
    nameEn: 'Svíčková: beef in cream sauce with dumplings',
    portion: { label: '1 talíř', grams: 470 },
    ingredients: [
      { key: 'beef-sirloin-cooked', grams: 120 },
      { key: 'svickova-omacka', grams: 200 },
      { key: 'houskovy-knedlik', grams: 150 },
    ],
    note: 'Porce: pečené hovězí, svíčková omáčka a houskový knedlík (bez brusinek a šlehačky).',
  },
  {
    key: 'hovezi-gulas',
    nameCs: 'Hovězí guláš',
    nameEn: 'Czech beef goulash',
    portion: { label: 'porce bez přílohy', grams: 300 },
    ingredients: [
      { key: 'beef-chuck-cooked', grams: 600 },
      { key: 'onion-cooked', grams: 300 },
      { key: 'lard', grams: 30 },
      { key: 'paprika-spice', grams: 10 },
      { key: 'tomato-paste', grams: 30 },
      { key: 'caraway', grams: 2 },
      { key: 'garlic', grams: 10 },
      { key: 'flour-wheat', grams: 20 },
      { key: 'water', grams: 300 },
      { key: 'salt', grams: 8 },
    ],
    note: 'Dušené hovězí s cibulí na sádle, mletou paprikou a rajčatovým protlakem.',
  },
  {
    key: 'bramboracka',
    nameCs: 'Bramborová polévka (bramboračka)',
    nameEn: 'Czech potato soup',
    portion: { label: '1 talíř', grams: 300 },
    ingredients: [
      { key: 'potato-boiled', grams: 300 },
      { key: 'carrot-cooked', grams: 50 },
      { key: 'celeriac', grams: 50 },
      { key: 'parsnip', grams: 30 },
      { key: 'mushrooms-cooked', grams: 50 },
      { key: 'onion-cooked', grams: 50 },
      { key: 'butter', grams: 20 },
      { key: 'flour-wheat', grams: 20 },
      { key: 'marjoram', grams: 2 },
      { key: 'garlic', grams: 10 },
      { key: 'water', grams: 800 },
      { key: 'salt', grams: 8 },
    ],
    note: 'Vývar z brambor, kořenové zeleniny a hub s jíškou, česnekem a majoránkou.',
  },
]
