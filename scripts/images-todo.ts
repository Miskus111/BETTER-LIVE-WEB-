/** Writes IMAGES_TODO.md — the list of placeholder images to replace before launch. `npm run images:todo` */
import { writeFileSync } from 'node:fs'
import { FOODS } from '../src/data/foods'

const lines = [
  '# Images to replace before launch',
  '',
  'Every image below is a generated SVG placeholder (labelled "PLACEHOLDER" inside the image). Replace each with licensed',
  'photography — own shoots or properly licensed stock, never hotlinked. Keep a ≈ 10:9 frame with the subject centred and',
  'some margin (cards crop to 4:3 and 5:4), then update the path in `src/data` if the file extension changes.',
  '',
  '## Foods — `public/images/foods/`',
  '',
  ...FOODS.map((f) => `- [ ] \`${f.id}.svg\` — ${f.name} (${f.basis})`),
  '',
  '',
]
writeFileSync('IMAGES_TODO.md', lines.join('\n'))
console.log(`IMAGES_TODO.md: ${FOODS.length} food images`)
