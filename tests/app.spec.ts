import { expect, test } from '@playwright/test'

/** Signed-in screens rendered through the test-only /preview route (ENABLE_PREVIEW=1). */

test('workout can be logged offline and is queued for sync', async ({ page, context }) => {
  await page.goto('/preview/train')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.getByTestId('start-workout').click()
  await expect(page).toHaveURL(/\/preview\/session/)

  await page.getByTestId('add-exercise').click()
  await page.getByTestId('exercise-search').fill('bench press')
  await page.getByTestId('pick-barbell-bench-press').click()
  const ex = page.getByTestId('exercise-barbell-bench-press')
  await ex.getByLabel('kg').first().fill('80')
  await ex
    .getByLabel(/Opak|Reps/)
    .first()
    .fill('8')

  await context.setOffline(true)
  await ex.getByTestId('set-done').first().click()
  await expect(page.getByRole('timer')).toBeVisible() // rest timer started
  await expect(ex).toContainText(/1RM/) // e1RM shown

  await page.getByTestId('finish-workout').click()
  await expect(page.getByTestId('saved-offline')).toContainText('1')
  const queued = await page.evaluate(
    () => JSON.parse(localStorage.getItem('blwb-session-v1') ?? '{}').state.queue,
  )
  expect(queued).toHaveLength(1)
  expect(queued[0].exercises[0].sets[0]).toMatchObject({ weightKg: 80, reps: 8, done: true })
  await context.setOffline(false)
  await page.getByRole('link', { name: /Zpět na trénink|Back to training/ }).click()
  await expect(page).toHaveURL(/\/preview\/train$/)
})

test('pain map red flags block the exercise plan', async ({ page }) => {
  await page.goto('/preview/pain-lower-back')
  await page.getByTestId('pain-next').click()
  const flags = page.getByTestId('red-flags')
  for (const b of await flags.locator('[data-testid$="-no"]').all()) await b.click()
  await page.getByTestId('flag-saddle_numbness-yes').click()
  await page.getByTestId('flags-next').click()
  await expect(page.getByTestId('gate-emergency')).toBeVisible()
  await expect(page.getByTestId('pain-plan')).toHaveCount(0)
})

test('pain map without red flags shows education and a plan', async ({ page }) => {
  await page.goto('/preview/pain-lower-back')
  await page.getByTestId('pain-next').click()
  for (const b of await page.getByTestId('red-flags').locator('[data-testid$="-no"]').all()) await b.click()
  await page.getByTestId('flags-next').click()
  await page.getByTestId('questions-next').click()
  await expect(page.getByTestId('pain-plan')).toBeVisible()
})

test('supplement stack flags upper limits and medication interactions', async ({ page }) => {
  await page.goto('/preview/stack')
  await expect(page.getByText(/125 µg/).first()).toBeVisible()
  await expect(page.getByText(/horní bezpečný limit|upper safe limit/).first()).toBeVisible()
  await expect(page.getByText(/lékařem|doctor/).first()).toBeVisible()
})

test('food diary shows targets and logged meals', async ({ page }) => {
  await page.goto('/preview/eat')
  await expect(page.getByTestId('eat-targets')).toBeVisible()
  await expect(page.getByTestId('meal-breakfast')).toContainText(/Ovesné vločky|Oats/)
})

test('mobility routine player steps through exercises', async ({ page }) => {
  await page.goto('/preview/routine')
  await page.getByTestId('routine-next').click()
  await page.getByTestId('routine-next').click()
  await expect(page.locator('h2').first()).toBeVisible()
})

test('labs: pasted results are parsed on-device and must be reviewed before saving', async ({ page }) => {
  await page.goto('/preview/labs')
  await expect(page.getByTestId('lab-vitd')).toBeVisible()
  await page.getByRole('tab', { name: /Vložit text|Paste text/ }).click()
  await page
    .getByTestId('labs-text')
    .fill('S-Glukóza 6,1 mmol/l 3,9 - 5,6\nFeritin 12 ug/l 30 - 300\nNěco jiného bez čísla')
  await page.getByTestId('labs-parse').click()
  const review = page.getByTestId('labs-review')
  await expect(review).toBeVisible()
  await expect(review.locator('tbody tr')).toHaveCount(2)
  await expect(review).toContainText(/vysoké|high/)
  await expect(review).toContainText(/nízké|low/)
})

test('coach: emergency messages get a fixed safety reply', async ({ page }) => {
  await page.goto('/preview/coach')
  await page.getByTestId('coach-input').fill('Mám silnou bolest na hrudi při běhu')
  await page.getByTestId('coach-input').press('Enter')
  await expect(page.getByTestId('msg-assistant')).toContainText('112')
})

test('PWA: manifest, icons and offline page are served', async ({ request, page }) => {
  const m = await (await request.get('/manifest.webmanifest')).json()
  expect(m.short_name).toBe('BLWB')
  expect(m.start_url).toBe('/today')
  const icon = await request.get('/pwa-icon/192')
  expect(icon.headers()['content-type']).toContain('image/png')
  expect((await request.get('/sw.js')).ok()).toBe(true)
  await page.goto('/offline')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/offline/i)
})

test('looks: habits can be ticked off and survive a reload', async ({ page }) => {
  await page.goto('/preview/looks')
  await page.evaluate(() => localStorage.removeItem('blwb-looks-v1'))
  await page.reload()
  const habit = page.getByTestId('habit-spanek')
  await habit.click()
  await expect(habit).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page.getByTestId('habit-spanek')).toHaveAttribute('aria-pressed', 'true')
})

test('progress: weekly volume and strength charts render with a table view', async ({ page }) => {
  await page.goto('/preview/progress')
  await expect(page.getByTestId('volume-chart').locator('.recharts-bar-rectangle').first()).toBeVisible()
  await expect(page.getByTestId('strength-chart').locator('.recharts-line-curve')).toBeVisible()
  await page.getByText('Zobrazit jako tabulku').first().click()
  await expect(page.locator('table').first()).toContainText('kg')
})

test('weight: trend chart, stats and entries render from weigh-ins', async ({ page }) => {
  await page.goto('/preview/weight')
  await expect(page.getByTestId('weight-chart').locator('.recharts-line-curve')).toBeVisible()
  await expect(page.getByTestId('waist-chart')).toBeVisible()
  await expect(page.getByText('Aktuálně (trend)')).toBeVisible()
  await page.getByRole('button', { name: '30 dní' }).click()
  await expect(page.getByRole('button', { name: '30 dní' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('tbody tr').first()).toContainText('kg')
})

test('photos: filter by pose and compare two photos side by side or with a slider', async ({ page }) => {
  await page.goto('/preview/photos')
  await expect(page.getByTestId('gallery').locator('li')).toHaveCount(3)
  await page.getByRole('button', { name: 'Z boku', exact: true }).click()
  await expect(page.getByTestId('gallery').locator('li')).toHaveCount(1)
  await page.getByRole('button', { name: 'Vše', exact: true }).click()
  await page.getByTestId('compare-toggle').click()
  const items = page.getByTestId('gallery').locator('li button')
  await items.nth(0).click()
  await items.nth(2).click()
  const cmp = page.getByTestId('compare')
  await expect(cmp).toContainText('63 dní mezi fotkami')
  await expect(cmp).toContainText('−2 kg')
  await cmp.getByRole('button', { name: 'Posuvník' }).click()
  await expect(cmp.getByRole('slider')).toBeVisible()
})

test('a deep link keeps its query through the login redirect (food page → diary)', async ({ request }) => {
  const res = await request.get('/eat?add=almonds', { maxRedirects: 0 })
  // without Supabase keys (CI) the app shows a setup screen instead of redirecting
  test.skip(res.status() !== 307, 'Supabase not configured')
  expect(res.headers()['location']).toContain(`next=${encodeURIComponent('/eat?add=almonds')}`)
})

test('the diary opens with a food from a deep link already searched', async ({ page }) => {
  await page.goto('/preview/eat?add=almonds')
  const lunch = page.getByTestId('meal-lunch')
  await expect(lunch.getByRole('textbox').first()).toHaveValue('Mandle')
  await expect(lunch.getByRole('button', { name: /Mandle/ }).first()).toBeVisible()
})
