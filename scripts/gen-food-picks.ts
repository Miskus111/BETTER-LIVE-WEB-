/** Writes the precomputed organ and nutrient food rankings used by browser components. */
import { writeFileSync } from 'node:fs'
import { buildFoodPicks } from '../src/lib/food-picks'

writeFileSync('src/data/food-picks.generated.json', JSON.stringify(buildFoodPicks()) + '\n')
console.log('✓ src/data/food-picks.generated.json')
