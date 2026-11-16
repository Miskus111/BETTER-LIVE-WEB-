/**
 * Generates clearly-marked placeholder images for foods and products:
 *   public/images/foods/<id>.svg
 *   public/images/products/<id>.svg and <id>-label.svg
 * Run: `npm run gen:placeholders`. Replace with licensed photography before launch (see IMAGES_TODO.md);
 * when you do, update `image` / `images` paths in src/data.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { FoodArt } from '../src/components/art/FoodArt'
import { FOODS } from '../src/data/foods'
import { PRODUCTS } from '../src/data/products'
import type { Art } from '../src/data/types'

const out = join(process.cwd(), 'public/images')
mkdirSync(join(out, 'foods'), { recursive: true })
mkdirSync(join(out, 'products'), { recursive: true })

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function frame(art: Art, id: string) {
  const inner = renderToStaticMarkup(<FoodArt kind={art.kind} a={art.a} b={art.b} />).replace(
    '<svg',
    '<svg x="0" y="40" width="800" height="640"',
  )
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 720" width="800" height="720">
<defs><radialGradient id="bg-${id}" cx="50%" cy="45%" r="75%"><stop offset="0%" stop-color="#16202b"/><stop offset="100%" stop-color="#0a0e13"/></radialGradient></defs>
<rect width="800" height="720" fill="url(#bg-${id})"/>
${inner}
<text x="28" y="44" font-family="ui-monospace, Menlo, monospace" font-size="18" letter-spacing="2" fill="#7f93a6">PLACEHOLDER · REPLACE WITH PHOTO</text>
</svg>`
}

function label(name: string, size: string, art: Art, organic: boolean, id: string) {
  const lines = name.length > 22 ? splitName(name) : [name]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 720" width="800" height="720">
<defs><linearGradient id="lb-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${art.b}"/><stop offset="100%" stop-color="${art.a}"/></linearGradient></defs>
<rect width="800" height="720" fill="#0b1016"/>
<rect x="190" y="90" width="420" height="540" rx="28" fill="url(#lb-${id})" opacity="0.9"/>
<rect x="220" y="300" width="360" height="220" rx="10" fill="#0b1016" opacity="0.82"/>
${lines.map((l, i) => `<text x="400" y="${360 + i * 40}" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="#f3f6f9">${esc(l)}</text>`).join('')}
<text x="400" y="${380 + lines.length * 40}" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="18" fill="#9fb3c4">${esc(size)}</text>
<text x="400" y="200" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="26" letter-spacing="8" fill="#0b1016" opacity="0.8">FLX</text>
${organic ? '<text x="400" y="590" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="16" letter-spacing="3" fill="#0b1016" opacity="0.7">EU ORGANIC · SAMPLE</text>' : ''}
<text x="28" y="44" font-family="ui-monospace, Menlo, monospace" font-size="18" letter-spacing="2" fill="#7f93a6">PLACEHOLDER · PACKSHOT</text>
</svg>`
}

function splitName(name: string) {
  const words = name.split(' ')
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

for (const f of FOODS) writeFileSync(join(out, 'foods', `${f.id}.svg`), frame(f.art, f.id))
for (const p of PRODUCTS) {
  writeFileSync(join(out, 'products', `${p.id}.svg`), frame(p.art, p.id))
  writeFileSync(
    join(out, 'products', `${p.id}-label.svg`),
    label(p.name, p.size, p.art, p.certification.status === 'eu-bio', p.id),
  )
}
console.log(`generated ${FOODS.length} food and ${PRODUCTS.length * 2} product placeholders`)
