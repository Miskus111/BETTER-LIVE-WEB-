/** `npm run foods:validate` — validates the committed src/data/foods.generated.json. */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { FoodsFile } from '../../src/lib/foods/types'
import { validateFoods } from '../../src/lib/foods/validate'

const file = JSON.parse(
  readFileSync(join(process.cwd(), 'src/data/foods.generated.json'), 'utf8'),
) as FoodsFile
const issues = validateFoods(file.foods)
for (const i of issues) console.error(`✗ ${i.id}: ${i.problem}`)
if (file.foods.filter((f) => f.provenance.source === 'USDA FoodData Central').length < 400) {
  console.error('✗ fewer than 400 generic foods with FDC provenance')
  process.exit(1)
}
if (issues.length) process.exit(1)
console.log(`✓ ${file.foods.length} foods valid (${Object.values(file.datasets).join(', ')})`)
