import type { Art } from '@/data/types'

export const CATEGORIES = [
  'Maso',
  'Drůbež',
  'Ryby a mořské plody',
  'Vejce',
  'Mléčné výrobky',
  'Fermentované',
  'Zelenina',
  'Ovoce',
  'Ořechy a semínka',
  'Luštěniny',
  'Obiloviny a pečivo',
  'Brambory a hlízy',
  'Houby',
  'Oleje a tuky',
  'Bylinky a koření',
  'Nápoje',
  'Sladidla a sladkosti',
  'Česká jídla',
] as const
export type Category = (typeof CATEGORIES)[number]

/** Illustration used for foods without their own artwork. */
export const CATEGORY_ART: Record<Category, Art> = {
  Maso: { kind: 'steak', a: '#c2414f', b: '#f4c7c3' },
  Drůbež: { kind: 'poultry', a: '#e0a36a', b: '#f6dcc0' },
  'Ryby a mořské plody': { kind: 'fish', a: '#e8826a', b: '#ffd6c8' },
  Vejce: { kind: 'egg', a: '#f2d58a', b: '#fff6e0' },
  'Mléčné výrobky': { kind: 'cheese', a: '#f2d58a', b: '#fff3cf' },
  Fermentované: { kind: 'jar', a: '#9cc56b', b: '#e3f2c8' },
  Zelenina: { kind: 'leaf', a: '#4fae6a', b: '#c9efd2' },
  Ovoce: { kind: 'berries', a: '#c2415f', b: '#f7c6d2' },
  'Ořechy a semínka': { kind: 'nut', a: '#b8875a', b: '#ecd5b8' },
  Luštěniny: { kind: 'pulses', a: '#b97b4f', b: '#efd2bd' },
  'Obiloviny a pečivo': { kind: 'oats', a: '#d9b26f', b: '#f5e6c4' },
  'Brambory a hlízy': { kind: 'potato', a: '#c49a5b', b: '#f0dcb8' },
  Houby: { kind: 'bowl', a: '#a88c72', b: '#e8dccd' },
  'Oleje a tuky': { kind: 'bottle', a: '#c9b34a', b: '#f3ecbc' },
  'Bylinky a koření': { kind: 'leaf', a: '#6aa84f', b: '#d6edc9' },
  Nápoje: { kind: 'bottle', a: '#5ec4e8', b: '#d4f1fb' },
  'Sladidla a sladkosti': { kind: 'jar', a: '#d98b5a', b: '#f7dcc8' },
  'Česká jídla': { kind: 'bowl', a: '#c26b4f', b: '#f2d0c3' },
}

export const categorySlug = (c: string) =>
  c
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Czech label for the state of the 100 g basis */
export const STATE_CS: Record<string, string> = {
  raw: 'syrové',
  cooked: 'tepelně upravené',
  dried: 'sušené',
  dry: 'suché, nevařené',
  canned: 'z konzervy',
  fermented: 'fermentované',
  frozen: 'mražené',
  pickled: 'nakládané',
  cured: 'uzené / sušené',
  roasted: 'pražené',
  baked: 'pečené',
  brewed: 'připravený nápoj',
  processed: 'průmyslově zpracované',
  recipe: 'vypočtený recept',
}

/** Cooking method from the FDC description (more specific than "cooked"). */
export function methodCs(description: string): string | null {
  const d = description.toLowerCase()
  const m: [RegExp, string][] = [
    [/pan-fried|fried/, 'smažené'],
    [/roasted/, 'pečené'],
    [/baked/, 'pečené'],
    [/broiled|grilled/, 'grilované'],
    [/braised|stewed/, 'dušené'],
    [/boiled|moist heat/, 'vařené'],
    [/dry heat/, 'pečené'],
    [/scrambled/, 'míchaná'],
    [/hard-boiled/, 'natvrdo'],
  ]
  return m.find(([re]) => re.test(d))?.[1] ?? null
}
