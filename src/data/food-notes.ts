import type { Art } from './types'

/**
 * Curated texts and artwork for foods (never nutrient numbers — those come from the generated dataset).
 * Foods listed here keep their own illustration in /public/images/foods/<id>.svg.
 */
export const FOOD_NOTES: Record<string, { note?: string; art: Art }> = {
  beef: {
    note: 'Hemové železo se vstřebává účinněji než železo z rostlin.',
    art: { kind: 'steak', a: '#c2414f', b: '#f4c7c3' },
  },
  'beef-liver': {
    note: 'Mimořádně vysoký obsah vitamínu A — jezte v menších porcích a v těhotenství jen po poradě s lékařem.',
    art: { kind: 'liver', a: '#7a2a32', b: '#b9505a' },
  },
  chicken: { art: { kind: 'poultry', a: '#e9b9a0', b: '#fbe6d8' } },
  pork: {
    note: 'Jeden z nejbohatších běžných zdrojů thiaminu (B1).',
    art: { kind: 'steak', a: '#e48b8b', b: '#fde0dc' },
  },
  salmon: { art: { kind: 'fish', a: '#ff8a5c', b: '#ffd2b8' } },
  sardines: {
    note: 'Vápník pochází hlavně z měkkých jedlých kostí.',
    art: { kind: 'fish', a: '#8fa6b8', b: '#dfe8ef' },
  },
  mackerel: { art: { kind: 'fish', a: '#4f7fa0', b: '#cfe3ef' } },
  cod: {
    note: 'Obsah jódu v mořských rybách se mezi vzorky hodně liší; uvedená hodnota je orientační.',
    art: { kind: 'fish', a: '#d8dde2', b: '#f6f7f8' },
  },
  egg: {
    note: 'Většina cholinu, vitamínu D a luteinu je ve žloutku.',
    art: { kind: 'egg', a: '#ffb627', b: '#fff6e6' },
  },
  'greek-yogurt': {
    note: 'Živé kultury obsahuje, jen pokud nebyl po fermentaci tepelně ošetřen — čtěte etiketu.',
    art: { kind: 'bowl', a: '#f4f1ea', b: '#cfd9e3' },
  },
  yogurt: { art: { kind: 'bowl', a: '#ffffff', b: '#b7c6d4' } },
  milk: {
    note: 'Jód v mléce závisí na krmivu a v zimě je ho víc; neuvádíme ho, protože příliš kolísá.',
    art: { kind: 'bottle', a: '#f7f7f2', b: '#9fb4c7' },
  },
  emmental: { art: { kind: 'cheese', a: '#f6d36b', b: '#fff1bf' } },
  kefir: {
    note: 'Tradiční kefír se fermentuje kefírovými zrny, která obsahují bakterie i kvasinky.',
    art: { kind: 'bottle', a: '#eef3f6', b: '#5ee7ff' },
  },
  sauerkraut: {
    note: 'Hodnoty jsou pro sterilované kysané zelí, které už živé kultury neobsahuje. Živé bakterie mléčného kvašení najdete jen v čerstvém, nepasterovaném zelí.',
    art: { kind: 'jar', a: '#e8e2a5', b: '#a8b86a' },
  },
  kimchi: { art: { kind: 'jar', a: '#e2553b', b: '#f6b19c' } },
  banana: { art: { kind: 'banana', a: '#ffd54a', b: '#fff2b0' } },
  orange: { art: { kind: 'citrus', a: '#ff9a1f', b: '#ffd59a' } },
  blueberries: { art: { kind: 'berries', a: '#4a5bd4', b: '#9fb0ff' } },
  strawberries: { art: { kind: 'berries', a: '#e8334a', b: '#ffb3bd' } },
  spinach: {
    note: 'Vápník a železo ze špenátu se kvůli šťavelanům vstřebávají špatně.',
    art: { kind: 'leaf', a: '#2f9e5b', b: '#9be3b4' },
  },
  kale: { art: { kind: 'leaf', a: '#1f6f4a', b: '#7cc79b' } },
  carrot: {
    note: 'Vitamín A je uveden jako retinolový ekvivalent z beta-karotenu.',
    art: { kind: 'carrot', a: '#ff7a1a', b: '#3fa865' },
  },
  potato: { art: { kind: 'potato', a: '#c9955b', b: '#f0d3a6' } },
  'pumpkin-seeds': { art: { kind: 'seeds', a: '#4f7a3a', b: '#a9cf7e' } },
  almonds: { art: { kind: 'nut', a: '#b5743f', b: '#e8c39a' } },
  walnuts: { art: { kind: 'walnut', a: '#a77b4f', b: '#e6cfaa' } },
  lentils: {
    note: 'Kombinujte s potravinami bohatými na vitamín C — zlepší to vstřebání nehemového železa.',
    art: { kind: 'pulses', a: '#d9643a', b: '#f3b08f' },
  },
  'black-beans': { art: { kind: 'pulses', a: '#2a2730', b: '#6d6878' } },
  chickpeas: { art: { kind: 'pulses', a: '#e2b46c', b: '#f7deb0' } },
  oats: {
    note: 'Oves obsahuje beta-glukan, vlákninu, ke které se váže tvrzení EU o cholesterolu (3 g denně).',
    art: { kind: 'oats', a: '#d9c08f', b: '#f4e7c8' },
  },
  'olive-oil': {
    note: 'Převážně mononenasycená kyselina olejová. Běžná porce je 10–15 g, ne 100 g.',
    art: { kind: 'oil', a: '#b8b53a', b: '#e9e78f' },
  },
}
