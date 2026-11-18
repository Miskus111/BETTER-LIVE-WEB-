/** Interactive calculators — each lives inside a guide (section "Vyzkoušejte si", anchor #try). */
export interface ToolInfo {
  guide: string
  title: string
  text: string
  basis: string
  icon: 'coffee' | 'headphones' | 'beef' | 'heart' | 'droplet'
}

export const TOOLS: ToolInfo[] = [
  {
    guide: 'energie-a-kofein',
    title: 'Kolik kofeinu vám zbude do spánku',
    text: 'Zadejte kávy a energeťáky během dne — graf ukáže, kolik kofeinu máte v těle, když jdete spát.',
    basis: 'EFSA, studie Drake 2013',
    icon: 'coffee',
  },
  {
    guide: 'srdce-a-tlak',
    title: 'Co znamená váš krevní tlak',
    text: 'Zadejte naměřené hodnoty a uvidíte kategorii, co z ní plyne a kdy jít k lékaři.',
    basis: 'Doporučení ESC 2024',
    icon: 'heart',
  },
  {
    guide: 'svaly-a-metabolismus',
    title: 'Kolik bílkovin potřebujete',
    text: 'Denní cíl podle vaší váhy — a poskládejte si ho z běžných jídel.',
    basis: 'EFSA, metaanalýza Morton 2018, data USDA',
    icon: 'beef',
  },
  {
    guide: 'pitny-rezim',
    title: 'Kolik vody denně',
    text: 'Potřeba vody podle EFSA a kolik jste vypotili při sportu, když se zvážíte před a po.',
    basis: 'EFSA 2010, ACSM 2007',
    icon: 'droplet',
  },
  {
    guide: 'sluch-a-sluchatka',
    title: 'Jak dlouho je hlasitost bezpečná',
    text: 'Vyberte hlasitost sluchátek nebo koncertu a zjistěte týdenní „příděl“ pro uši.',
    basis: 'WHO — bezpečný poslech',
    icon: 'headphones',
  },
]
