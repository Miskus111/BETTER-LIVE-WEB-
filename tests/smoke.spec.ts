import { expect, test } from '@playwright/test'

test.describe('anatomy', () => {
  test('select an organ by click, switch tabs, navigate with prev/next and keyboard', async ({ page }) => {
    await page.goto('/')
    const panel = page.getByTestId('organ-panel')
    await expect(panel).toHaveCount(0)

    await page.locator('[data-organ="heart"]').click()
    await expect(panel.getByRole('heading', { name: 'Srdce' })).toBeVisible()
    await expect(page).toHaveURL(/\?organ=heart/)

    await panel.getByRole('tab', { name: 'Živiny' }).click()
    await expect(panel.getByTestId('organ-nutrients')).toContainText('Draslík')
    await expect(panel.getByTestId('organ-nutrients')).toContainText('Prokázané')

    await panel.getByRole('button', { name: 'Další orgán' }).click()
    await expect(panel.getByRole('heading', { name: 'Plíce' })).toBeVisible()

    // keyboard: focus the brain and press Enter
    await page.locator('[data-organ="brain"]').focus()
    await page.keyboard.press('Enter')
    await expect(panel.getByRole('heading', { name: 'Mozek' })).toBeVisible()

    // full-body reset clears the selection
    await page.getByRole('button', { name: 'Celé tělo' }).click()
    await expect(panel).toHaveCount(0)
  })

  test('intestines panel explains fermentation; organ page is shareable', async ({ page }) => {
    await page.goto('/organ/intestines')
    await expect(page.getByRole('heading', { level: 1, name: /střeva/i })).toBeVisible()
    await expect(page.getByText('Fermentace bez mýtů').first()).toBeVisible()
    await expect(page.getByText(/Pasterované, sterilované/).first()).toBeVisible()
  })

  test('system filter dims non-matching organs', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Trávicí', exact: true }).click()
    await expect(page.locator('[data-organ="brain"]')).toHaveClass(/organ-dim/)
    await expect(page.locator('[data-organ="liver"]')).not.toHaveClass(/organ-dim/)
  })
})

test('search finds organs, nutrients, foods and pages', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Hledat orgány/ }).click()
  const box = page.getByRole('combobox')
  await box.press('Escape')
  await expect(box).toHaveCount(0)
  await page.keyboard.press('ControlOrMeta+k')
  await box.fill('kefir')
  await expect(page.getByRole('option').first()).toContainText('Kefír')
  await box.press('Enter')
  await expect(page).toHaveURL(/\/food\/kefir/)
})

test('looksmaxing page shows evidence and warns about harmful trends', async ({ page }) => {
  await page.goto('/looksmaxing')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Lepší vzhled')
  await expect(page.getByText('Ochrana před sluncem').first()).toBeVisible()
  await expect(page.getByText(/Bone smashing/).first()).toBeVisible()
  const shop = page.locator('a[href^="https://www.brainmarket.cz"], a[href^="https://vilgain.cz"]')
  expect(await shop.count()).toBeGreaterThan(2)
  await expect(shop.first()).toHaveAttribute('rel', /sponsored/)
})

test('supplements page: reference values, absorption forms and affiliate disclosure', async ({ page }) => {
  await page.goto('/doplnky')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Správná forma')
  const table = page.getByRole('table')
  await expect(table).toContainText('Vitamín D')
  await expect(table).toContainText('100 µg (4 000 IU)')
  const vitD = page.locator('section#vitD')
  await expect(vitD).toContainText('Vitamín D3 (cholekalciferol)')
  await expect(vitD).toContainText('Nejlepší volba')
  const link = vitD.locator('a[data-retailer]').first()
  await expect(link).toHaveAttribute('rel', /sponsored/)
  await expect(vitD.getByTestId('affiliate-disclosure')).toContainText('provizi')
})

test('organ panel has a supplements tab; old store URLs redirect', async ({ page }) => {
  await page.goto('/organ/bones')
  await page.getByRole('tab', { name: 'Doplňky' }).click()
  await expect(page.getByTestId('organ-panel')).toContainText('Vitamín D')
  await page.goto('/shop')
  await expect(page).toHaveURL(/\/doplnky$/)
})

test('app routes require sign-in (or show setup when Supabase is not configured)', async ({ page }) => {
  for (const path of ['/today', '/train', '/onboarding']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Supabase|Přihlášení|Sign in/)
  }
})

test('home links to the app: nav button and sign-up block', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('nav-app')).toHaveAttribute('href', '/today')
  const cta = page.getByTestId('cta-signup')
  await expect(cta).toHaveAttribute('href', '/login?mode=signup')
  await expect(page.locator('#aplikace')).toContainText('Trénink')
})
