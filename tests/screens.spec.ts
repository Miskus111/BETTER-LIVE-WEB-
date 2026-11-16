import { expect, test } from '@playwright/test'

/**
 * Responsive pass: screenshots at 390 / 768 / 1440 px into test-results/screens and a check that no page
 * scrolls horizontally. Review the images after running `npm run test:e2e`.
 */
const WIDTHS = [390, 768, 1440]
const PAGES = [
  ['home', '/'],
  ['home-heart', '/?organ=heart'],
  ['organ-intestines', '/organ/intestines'],
  ['food-kefir', '/food/kefir'],
  ['shop', '/shop'],
  ['product-kefir', '/product/kefir'],
  ['looksmaxing', '/looksmaxing'],
  ['science', '/science'],
  ['standard', '/our-standard'],
  ['cart', '/cart'],
  ['checkout', '/checkout'],
] as const

for (const width of WIDTHS) {
  test(`screens @${width}px`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width, height: width < 768 ? 844 : width < 1440 ? 1024 : 900 })
    await page.goto('/shop')
    await page.getByTestId('add-sauerkraut').click()
    for (const [name, path] of PAGES) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(900)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${path} overflows horizontally at ${width}px`).toBeLessThanOrEqual(0)
      await page.screenshot({
        path: `test-results/screens/${width}-${name}.png`,
        fullPage: name !== 'home' && name !== 'home-heart',
      })
      if (name === 'home')
        await page.screenshot({ path: `test-results/screens/${width}-home-full.png`, fullPage: true })
    }
  })
}
