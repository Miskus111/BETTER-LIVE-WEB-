import { expect, test } from '@playwright/test'

/**
 * Responsive pass: screenshots at 320 / 390 / 768 / 1440 px into test-results/screens and a check that no page
 * scrolls horizontally. Review the images after running `npm run test:e2e`.
 */
const WIDTHS = [320, 390, 768, 1440]
const PAGES = [
  ['home', '/'],
  ['home-heart', '/?organ=heart'],
  ['organ-intestines', '/organ/intestines'],
  ['food-kefir', '/food/kefir'],
  ['doplnky', '/doplnky'],
  ['jak-doporucujeme', '/jak-doporucujeme'],
  ['looksmaxing', '/looksmaxing'],
  ['science', '/science'],
  ['pricing', '/pricing'],
  ['supplement-guide', '/doplnky/horcik'],
  ['compound', '/doplnky/kreatin'],
  ['guides', '/jak-funguje-telo'],
  ['guide', '/jak-funguje-telo/dopamin-a-mobil'],
] as const

// one test per page and width: a slow page can't eat the others' time budget, and a failure names the page
for (const width of WIDTHS) {
  for (const [name, path] of PAGES) {
    test(`screen ${name} @${width}px`, async ({ page }) => {
      test.setTimeout(90_000) // full-page shots of long pages are slow on a busy machine
      await page.setViewportSize({ width, height: width < 768 ? 844 : width < 1440 ? 1024 : 900 })
      await page.goto(path)
      // app screens prefetch protected routes; logged out, those streams never close, so cap the wait
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
      await page.waitForTimeout(900)
      const { overflow, culprits } = await page.evaluate(() => {
        const W = window.innerWidth
        // the outermost elements that stick out (their parent fits), so a failure names its cause
        // skip what sits inside a scrolling or clipping box: it can't widen the page
        const clipped = (e: Element) => {
          for (let x = e.parentElement; x && x !== document.body; x = x.parentElement)
            if (getComputedStyle(x).overflowX !== 'visible') return true
          return false
        }
        const out = [...document.querySelectorAll('body *')].filter(
          (e) => e.getBoundingClientRect().right > W + 0.5 && !clipped(e),
        )
        const roots = out.filter((e) => !out.includes(e.parentElement as Element)).slice(0, 4)
        return {
          overflow: document.documentElement.scrollWidth - W,
          culprits: roots.map(
            (e) =>
              `<${e.tagName.toLowerCase()} class="${String(e.getAttribute('class') ?? '').slice(0, 60)}"> ` +
              `right=${Math.round(e.getBoundingClientRect().right)} "${(e.textContent ?? '').trim().slice(0, 30)}"`,
          ),
        }
      })
      expect(
        overflow,
        `${path} overflows horizontally at ${width}px: ${culprits.join(' | ')}`,
      ).toBeLessThanOrEqual(0)
      await page.screenshot({
        path: `test-results/screens/${width}-${name}.png`,
        fullPage: name !== 'home' && name !== 'home-heart',
      })
      if (name === 'home')
        await page.screenshot({ path: `test-results/screens/${width}-home-full.png`, fullPage: true })
    })
  }
}
