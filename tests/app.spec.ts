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
  await ex.getByLabel(/Opak|Reps/).first().fill('8')

  await context.setOffline(true)
  await ex.getByTestId('set-done').first().click()
  await expect(page.getByRole('timer')).toBeVisible() // rest timer started
  await expect(ex).toContainText(/1RM/) // e1RM shown

  await page.getByTestId('finish-workout').click()
  await expect(page.getByTestId('saved-offline')).toContainText('1')
  const queued = await page.evaluate(() => JSON.parse(localStorage.getItem('blwb-session-v1') ?? '{}').state.queue)
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
