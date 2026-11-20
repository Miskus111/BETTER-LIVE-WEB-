/**
 * Download + load the official USDA FoodData Central bulk files (public domain, CC0 1.0).
 * Files are cached in .cache/fdc (git-ignored); the pipeline never scrapes the website.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const DATASETS = {
  'SR Legacy': {
    version: 'SR Legacy 2018-04',
    url: 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip',
    root: 'SRLegacyFoods',
    dir: 'srj',
  },
  Foundation: {
    version: 'Foundation Foods 2026-10-29',
    url: 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_json_2026-10-29.zip',
    root: 'FoundationFoods',
    dir: 'fndj',
  },
} as const
export type DatasetName = keyof typeof DATASETS

export interface FdcNutrient {
  nutrient: { id: number; name: string; unitName: string }
  amount?: number
}
export interface FdcPortion {
  amount?: number
  gramWeight: number
  modifier?: string
  portionDescription?: string
  measureUnit?: { name?: string; abbreviation?: string }
}
export interface FdcFood {
  fdcId: number
  description: string
  foodCategory?: { description: string }
  foodNutrients: FdcNutrient[]
  foodPortions?: FdcPortion[]
  nutrientConversionFactors?: {
    type: string
    proteinValue?: number
    fatValue?: number
    carbohydrateValue?: number
  }[]
}

const CACHE = join(process.cwd(), '.cache/fdc')

/** Downloads (once) and unzips a dataset; returns the retrieval date recorded at download time. */
export function ensureDataset(name: DatasetName): string {
  const d = DATASETS[name]
  const dir = join(CACHE, d.dir)
  const stamp = join(dir, '.retrieved')
  if (!existsSync(dir) || !readdirSync(dir).some((f) => f.endsWith('.json'))) {
    mkdirSync(dir, { recursive: true })
    const zip = join(CACHE, `${d.dir}.zip`)
    console.log(`↓ ${name}: ${d.url}`)
    execFileSync('curl', ['-sSL', '--fail', '-o', zip, d.url], { stdio: 'inherit' })
    execFileSync('unzip', ['-oq', zip, '-d', dir], { stdio: 'inherit' })
    writeFileSync(stamp, new Date().toISOString().slice(0, 10))
  }
  if (!existsSync(stamp)) {
    const json = readdirSync(dir).find((f) => f.endsWith('.json'))!
    writeFileSync(stamp, statSync(join(dir, json)).mtime.toISOString().slice(0, 10))
  }
  return readFileSync(stamp, 'utf8').trim()
}

export function loadDataset(name: DatasetName): Map<number, FdcFood> {
  const d = DATASETS[name]
  const dir = join(CACHE, d.dir)
  const file = readdirSync(dir).find((f) => f.endsWith('.json'))!
  const data = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Record<string, FdcFood[]>
  return new Map(data[d.root].map((f) => [f.fdcId, f]))
}
