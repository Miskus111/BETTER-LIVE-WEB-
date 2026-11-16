import { expect, test } from '@playwright/test'

test.describe('anatomy', () => {
  test('select an organ by click, switch tabs, navigate with prev/next and keyboard', async ({ page }) => {
    await page.goto('/')
    const panel = page.getByTestId('organ-panel')
    await expect(panel).toHaveCount(0)

    await page.locator('[data-organ="heart"]').click()
    await expect(panel.getByRole('heading', { name: 'Heart' })).toBeVisible()
    await expect(page).toHaveURL(/\?organ=heart/)

    await panel.getByRole('tab', { name: 'Nutrients' }).click()
    await expect(panel.getByTestId('organ-nutrients')).toContainText('Potassium')
    await expect(panel.getByTestId('organ-nutrients')).toContainText('Established')

    await panel.getByRole('button', { name: 'Next organ' }).click()
    await expect(panel.getByRole('heading', { name: 'Lungs' })).toBeVisible()

    // keyboard: focus the brain and press Enter
    await page.locator('[data-organ="brain"]').focus()
    await page.keyboard.press('Enter')
    await expect(panel.getByRole('heading', { name: 'Brain' })).toBeVisible()

    // full-body reset clears the selection
    await page.getByRole('button', { name: 'Full body' }).click()
    await expect(panel).toHaveCount(0)
  })

  test('intestines panel explains fermentation; organ page is shareable', async ({ page }) => {
    await page.goto('/organ/intestines')
    await expect(page.getByRole('heading', { level: 1, name: /Intestines/ })).toBeVisible()
    await expect(page.getByText('Fermentation, decoded').first()).toBeVisible()
    await expect(page.getByText(/Pasteurised, canned/).first()).toBeVisible()
  })

  test('system filter dims non-matching organs', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Digestive', exact: true }).click()
    await expect(page.locator('[data-organ="brain"]')).toHaveClass(/organ-dim/)
    await expect(page.locator('[data-organ="liver"]')).not.toHaveClass(/organ-dim/)
  })
})

test('search finds organs, foods and products', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Search organs/ }).click()
  const box = page.getByRole('combobox')
  await box.press('Escape')
  await expect(box).toHaveCount(0)
  await page.keyboard.press('ControlOrMeta+k')
  await box.fill('kefir')
  await expect(page.getByRole('option').first()).toContainText('Kefir')
  await box.press('Enter')
  await expect(page).toHaveURL(/\/(food|product)\/kefir/)
})

test('add to cart persists across reload', async ({ page }) => {
  await page.goto('/shop')
  await page.getByTestId('add-kefir').click()
  await expect(page.getByTestId('cart-count')).toHaveText('1')
  await expect(page.getByRole('status').first()).toContainText('Added to cart')
  await page.reload()
  await expect(page.getByTestId('cart-count')).toHaveText('1')
  await page.goto('/cart')
  await expect(page.getByTestId('cart-lines')).toContainText('Whole-Milk Kefir')
  await page.getByRole('button', { name: 'Increase quantity' }).click()
  await expect(page.getByTestId('subtotal')).toHaveText('€5.80')
})

test('EU BIO filter hides conventional and wild products', async ({ page }) => {
  await page.goto('/shop')
  await expect(page.locator('[data-cert="wild"]').first()).toBeVisible()
  await page.getByTestId('bio-only').click()
  await expect(page.getByTestId('bio-only')).toBeChecked()
  await expect(page).toHaveURL(/bio=1/)
  await expect(page.locator('[data-cert="wild"]')).toHaveCount(0)
  await expect(page.locator('[data-cert="conventional"]')).toHaveCount(0)
})

test('checkout demo end to end', async ({ page }) => {
  await page.goto('/product/eggs')
  await page.getByTestId('add-eggs').click()
  await page.goto('/checkout')
  await page.getByTestId('place-order').click()
  await expect(page.getByText('Enter your full name.')).toBeVisible()
  await page.getByLabel('Full name').fill('Test Person')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Street and number').fill('Testovací 1')
  await page.getByLabel('Postcode').fill('110 00')
  await page.getByLabel('City').fill('Praha')
  await page.getByTestId('place-order').click()
  await expect(page.getByTestId('order-confirmation')).toBeVisible()
  await expect(page.getByTestId('order-number')).toHaveText(/^FLX-DEMO-[A-Z0-9]{6}$/)
  await expect(page.getByTestId('cart-count')).toHaveCount(0)
})
