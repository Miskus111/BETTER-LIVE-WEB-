import { expect, test } from '@playwright/test'
import { BODY_GUIDES } from '../src/data/body-guides'

test.describe('anatomy', () => {
  test('select an organ by click, switch tabs, navigate with prev/next and keyboard', async ({ page }) => {
    await page.goto('/')
    const panel = page.getByTestId('organ-panel')
    await expect(panel).toHaveCount(0)

    await page.locator('[data-organ="heart"]').click()
    await expect(panel.getByRole('heading', { name: 'Srdce', exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\?organ=heart/)

    await panel.getByRole('tab', { name: 'Živiny' }).click()
    await expect(panel.getByTestId('organ-nutrients')).toContainText('Draslík')
    await expect(panel.getByTestId('organ-nutrients')).toContainText('Prokázané')

    await panel.getByRole('button', { name: 'Další orgán' }).click()
    await expect(panel.getByRole('heading', { name: 'Plíce', exact: true })).toBeVisible()

    // keyboard: focus the brain and press Enter
    await page.locator('[data-organ="brain"]').focus()
    await page.keyboard.press('Enter')
    await expect(panel.getByRole('heading', { name: 'Mozek', exact: true })).toBeVisible()

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
  await page.getByRole('button', { name: /Hledat průvodce/ }).click()
  // the palette is code-split: scope to its dialog (the food explorer has its own selects)
  const box = page.getByRole('dialog').getByRole('combobox')
  await box.press('Escape')
  await expect(box).toHaveCount(0)
  await page.keyboard.press('ControlOrMeta+k')
  await box.fill('kefir')
  await expect(page.getByRole('dialog').getByRole('option').first()).toContainText('Kefír')
  await box.press('Enter')
  await expect(page).toHaveURL(/\/food\/kefir/)
  // guides and non-vitamin supplements are searchable too, without diacritics
  await page.keyboard.press('ControlOrMeta+k')
  await box.fill('spanek')
  await expect(page.getByRole('dialog').getByRole('option').first()).toContainText('Spánek')
  await box.fill('kreatin')
  await expect(page.getByRole('dialog').getByRole('option').first()).toContainText('Kreatin')
  await box.press('Enter')
  await expect(page).toHaveURL(/\/doplnky\/kreatin/)
})

test('guides page: search, category filter and shareable URL', async ({ page }) => {
  await page.goto('/jak-funguje-telo')
  const box = page.getByTestId('guides-search')
  await box.fill('kofein')
  await expect(page.getByTestId('guides-count')).toContainText(`z ${BODY_GUIDES.length}`)
  await expect(page.getByTestId('guides').locator('a').first()).toHaveAttribute('href', /energie-a-kofein/)
  await expect(page).toHaveURL(/q=kofein/)
  await page.goto('/jak-funguje-telo?q=mobil&k=mysl')
  await expect(page.getByTestId('guides-search')).toHaveValue('mobil')
  await expect(page.getByRole('button', { name: /Mozek a psychika/ })).toHaveAttribute('aria-pressed', 'true')
  await page.getByTestId('guides-search').fill('xyzqq')
  await expect(page.getByTestId('guides-empty')).toBeVisible()
  await page.getByRole('button', { name: 'kofein' }).click()
  await expect(page.getByTestId('guides').locator('li')).not.toHaveCount(0)
})

test('myth quiz: play a full round to the result', async ({ page }) => {
  await page.goto('/jak-funguje-telo')
  await page.getByTestId('quiz-link').click()
  await expect(page).toHaveURL(/\/jak-funguje-telo\/kviz$/)
  await page.getByTestId('quiz-start').click()
  for (let i = 0; i < 10; i++) {
    await page.getByRole('button', { name: i % 2 ? 'Mýtus' : 'Fakt', exact: true }).click()
    await expect(page.getByTestId('quiz-explain')).toBeVisible()
    await page.getByTestId('quiz-next').click()
  }
  await expect(page.getByTestId('quiz-result')).toContainText('/ 10')
})

test('guide page: reading time, table of contents and prev/next', async ({ page }) => {
  await page.goto('/jak-funguje-telo/spanek')
  await expect(page.getByTestId('reading-time')).toContainText('min čtení')
  await page.getByTestId('toc').getByRole('link', { name: 'Mýty' }).click()
  await expect(page).toHaveURL(/#myths$/)
  await expect(page.locator('a[rel=prev]')).toHaveAttribute('href', /\/jak-funguje-telo\/marihuana-a-thc$/)
  await expect(page.locator('a[rel=next]')).toHaveAttribute('href', /\/jak-funguje-telo\/energie-a-kofein$/)
})

test('legal pages name the operator and are linked from the footer', async ({ page }) => {
  for (const path of ['/privacy', '/terms']) {
    await page.goto(path)
    await expect(page.getByTestId('operator')).toContainText('Michal Major')
    await expect(page.getByText('Pracovní verze')).toHaveCount(0)
  }
  await page.goto('/')
  const legal = page.getByRole('navigation', { name: 'Právní informace' })
  await expect(legal.getByRole('link', { name: 'Ochrana osobních údajů' })).toHaveAttribute(
    'href',
    '/privacy',
  )
  await expect(legal.getByRole('link', { name: 'Podmínky' })).toHaveAttribute('href', '/terms')
})

test('glossary: terms open an explanation in the text and have their own page', async ({ page }) => {
  await page.goto('/jak-funguje-telo/energie-a-kofein')
  const term = page.locator('[data-term="adenosin"]').first()
  await term.click()
  await expect(page.getByRole('tooltip')).toContainText('tlak spánku')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('tooltip')).toHaveCount(0)
  await page.goto('/jak-funguje-telo')
  await page.getByTestId('glossary-link').click()
  await expect(page).toHaveURL(/\/jak-funguje-telo\/slovnik$/)
  expect(await page.getByTestId('glossary-term').count()).toBeGreaterThan(40)
})

test('pricing shows what Pro looks like, price per day and a fuller FAQ', async ({ page }) => {
  await page.goto('/pricing')
  await expect(page.getByTestId('pro-preview').getByRole('figure')).toHaveCount(4)
  await expect(page.getByTestId('per-day')).toContainText('Kč denně')
  await expect(page.locator('details')).toHaveCount(7)
})

test('guide page highlights one first step', async ({ page }) => {
  await page.goto('/jak-funguje-telo/spanek')
  await expect(page.getByTestId('first-step')).toContainText('stejnou dobu')
})

test('guide tools: caffeine left at bedtime and WHO safe listening time', async ({ page }) => {
  await page.goto('/jak-funguje-telo/energie-a-kofein')
  const calc = page.getByTestId('caffeine-calc')
  // default: 90 mg at 8:00 + 80 mg at 15:30, bed 23:00, half-life 5 h → ~40 mg
  await expect(calc.getByTestId('caffeine-at-bed')).toContainText('40 mg')
  await calc.getByRole('button', { name: /rychle/ }).click()
  await expect(calc.getByTestId('caffeine-at-bed')).not.toContainText('40 mg')
  await page.goto('/jak-funguje-telo/sluch-a-sluchatka')
  const ear = page.getByTestId('safe-listening')
  await ear.getByRole('button', { name: /Hlasitá hudba v pokoji/ }).click()
  await expect(ear.getByTestId('safe-week')).toContainText('40 h')
  await ear.getByRole('button', { name: /Sluchátka na maximum/ }).click()
  await expect(ear.getByTestId('safe-week')).toContainText('min')
})

test('protein calculator: EFSA minimum, training target and a plate tally', async ({ page }) => {
  await page.goto('/jak-funguje-telo/svaly-a-metabolismus')
  const calc = page.getByTestId('protein-calc')
  await expect(calc.getByTestId('protein-health')).toHaveText('58 g') // 70 kg × 0.83
  await expect(calc.getByTestId('protein-muscle')).toHaveText('112 g') // 70 kg × 1.6
  await expect(calc.getByTestId('protein-total')).toHaveText('65 g') // chicken 34 + eggs 13 + yogurt 18
  await calc.getByRole('button', { name: 'Přidat porci: Losos' }).click()
  await expect(calc.getByTestId('protein-total')).toHaveText('96 g')
})

test('blood pressure check uses ESC 2024 categories and the higher of both numbers', async ({ page }) => {
  await page.goto('/jak-funguje-telo/srdce-a-tlak')
  const bp = page.getByTestId('bp-check')
  await expect(bp.getByTestId('bp-result')).toContainText('Zvýšený tlak') // default 128/82
  await bp.getByTestId('bp-sys').fill('118')
  await bp.getByTestId('bp-dia').fill('92')
  await expect(bp.getByTestId('bp-result')).toContainText('Hypertenze')
  await bp.getByTestId('bp-dia').fill('68')
  await expect(bp.getByTestId('bp-result')).toContainText('Nezvýšený')
})

test('water calculator: EFSA totals and sweat loss from weighing', async ({ page }) => {
  await page.goto('/jak-funguje-telo/pitny-rezim')
  const w = page.getByTestId('water-calc')
  await expect(w.getByTestId('water-total')).toHaveText('2 l')
  await w.getByRole('button', { name: 'Kojím' }).click()
  await expect(w.getByTestId('water-total')).toHaveText('2,7 l')
  await w.getByRole('button', { name: 'Muž' }).click()
  await expect(w.getByTestId('water-total')).toHaveText('2,5 l')
  await w.getByTestId('water-before').fill('80')
  await w.getByTestId('water-after').fill('78')
  await expect(w.getByTestId('water-sweat')).toContainText('2 l')
  await expect(w.getByTestId('water-sweat')).toContainText('nad 2 %')
})

test('tools: homepage teaser leads to all calculators, each opens inside its guide', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('all-tools').click()
  await expect(page).toHaveURL(/\/nastroje$/)
  const cards = page.getByTestId('tool-cards').getByRole('link')
  await expect(cards).toHaveCount(5)
  await cards.first().click()
  await expect(page).toHaveURL(/\/jak-funguje-telo\/energie-a-kofein#try$/)
  await expect(page.getByTestId('caffeine-calc')).toBeVisible()
})

test('tool edge cases: drink after midnight, low blood pressure, quiet sound has no limit', async ({
  page,
}) => {
  await page.goto('/jak-funguje-telo/energie-a-kofein')
  const calc = page.getByTestId('caffeine-calc')
  // one energy drink at 00:30, bed at 01:30 → most of the 80 mg is still there
  await calc.getByRole('button', { name: 'Odebrat nápoj' }).first().click()
  await calc.getByRole('button', { name: 'Odebrat nápoj' }).first().click()
  await calc.getByRole('button', { name: 'Přidat nápoj' }).click()
  await calc.getByLabel('Nápoj', { exact: true }).selectOption('energy')
  await calc.getByLabel('Čas', { exact: true }).fill('00:30')
  await calc.locator('input[type=time]').last().fill('01:30')
  await expect(calc.getByTestId('caffeine-at-bed')).toContainText('70 mg')

  await page.goto('/jak-funguje-telo/srdce-a-tlak')
  const bp = page.getByTestId('bp-check')
  await bp.getByTestId('bp-sys').fill('82')
  await bp.getByTestId('bp-dia').fill('50')
  await expect(bp.getByTestId('bp-result')).toContainText('Nízký tlak')

  await page.goto('/jak-funguje-telo/sluch-a-sluchatka')
  const ear = page.getByTestId('safe-listening')
  await ear.getByRole('button', { name: /Běžný rozhovor/ }).click()
  await expect(ear).toContainText('bez limitu')
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

test('home links to the app: nav button and sign-up block', async ({ page }) => {
  await page.goto('/')
  // the app is its own site: links go to its address, not to a page on this domain
  await expect(page.getByTestId('nav-app')).toHaveAttribute('href', /^https?:\/\/[^/]+\/today$/)
  const cta = page.getByTestId('cta-signup')
  await expect(cta).toHaveAttribute('href', /^https?:\/\/[^/]+\/login\?mode=signup$/)
  await expect(page.locator('#aplikace')).toContainText('Trénink')
})

test('pricing: free and Pro plans, beta banner and comparison table', async ({ page }) => {
  await page.goto('/pricing')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jednoduché ceny')
  await expect(page.getByTestId('beta-banner')).toBeVisible()
  await expect(page.getByTestId('plan-pro')).toContainText('199')
  await expect(page.getByTestId('plan-pro')).toContainText('1 690')
  await expect(page.locator('section[aria-labelledby=compare-plans] table')).toContainText('Fotky pokroku')
})

test('supplement guide pages: own URL, one h1, FAQ and structured data; listed in the sitemap', async ({
  page,
  request,
}) => {
  await page.goto('/doplnky/vitamin-d')
  await expect(page).toHaveTitle(/Vitamín D — nejlepší forma, dávka a referenční hodnoty/)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Časté otázky' })).toBeVisible()
  const types = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) =>
      els.flatMap((e) =>
        [JSON.parse(e.textContent || '[]')].flat().map((x: { '@type': string }) => x['@type']),
      ),
    )
  expect(types).toEqual(expect.arrayContaining(['Article', 'FAQPage', 'BreadcrumbList']))
  await page.goto('/doplnky')
  await page.getByRole('link', { name: 'Hořčík' }).first().click()
  await expect(page).toHaveURL(/\/doplnky\/horcik$/)
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('/doplnky/omega-3')
  expect((await request.get('/doplnky/neexistuje')).status()).toBe(404)
})

test('homepage has exactly one h1', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveCount(1)
})

test('body guides: hub lists all topics; a guide has TL;DR, evidence levels, myths and sources', async ({
  page,
}) => {
  await page.goto('/jak-funguje-telo')
  await expect(page.getByTestId('guides').locator('li')).toHaveCount(BODY_GUIDES.length)
  await page.getByRole('link', { name: /Spánek: noční servis těla/ }).click()
  await expect(page).toHaveURL(/\/jak-funguje-telo\/spanek$/)
  await expect(page.getByTestId('tldr')).toContainText('7 a více hodin')
  await expect(page.getByText('Prokázané').first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Mýty' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Watson a kol\. \(2015\)/ })).toHaveAttribute('href', /pubmed/)
})

test('non-vitamin supplements: overview section and an honest compound page', async ({ page }) => {
  await page.goto('/doplnky#latky')
  await expect(page.locator('#latky')).toContainText('Kreatin')
  await page.goto('/doplnky/ashwagandha')
  await expect(page.locator('h1')).toHaveText('Ashwagandha')
  await expect(page.getByTestId('verdict')).toContainText('bezpečnost')
  await expect(page.getByText(/Dánsko ji v roce 2023/)).toBeVisible()
  await page.goto('/doplnky/kreatin')
  await expect(page.getByText(/Schválené tvrzení EU/)).toBeVisible()
})

test('food explorer: diacritics-insensitive search, filters and compare', async ({ page }) => {
  await page.goto('/potraviny')
  const search = page.getByTestId('food-search')
  await search.fill('cocka')
  await expect(page.getByTestId('food-lentils')).toBeVisible()
  await expect(page.getByTestId('food-count')).toContainText(/z \d+ potravin/)
  await search.fill('')
  await page.getByRole('combobox', { name: 'Strava' }).selectOption('vegan')
  await expect(page.getByTestId('food-salmon')).toHaveCount(0)
  await page.getByRole('combobox', { name: 'Strava' }).selectOption('')
  await search.fill('losos')
  await page.getByRole('checkbox', { name: 'Porovnat: Losos (chovaný)' }).check({ force: true })
  await page.getByRole('checkbox', { name: 'Porovnat: Losos pečený' }).check({ force: true })
  const table = page.getByTestId('food-compare')
  await expect(table).toContainText('Losos (chovaný)')
  await expect(table).toContainText('Losos pečený')
  await expect(table).toContainText('Vitamín D')
})

test('food page: full panel recalculates per portion, shows provenance and "no data"', async ({ page }) => {
  await page.goto('/food/egg')
  const panel = page.getByTestId('nutrition-panel')
  await expect(panel).toBeVisible()
  await page.getByRole('button', { name: /^100 g$/ }).click()
  const protein = panel.getByTestId('row-protein')
  const per100 = await protein.locator('td').first().innerText()
  await page.getByTestId('portion-grams').fill('200')
  await expect(protein.locator('td').first()).not.toHaveText(per100)
  await expect(page.getByRole('link', { name: /USDA FoodData Central, FDC \d+/ })).toBeVisible()
  // raw ↔ cooked variants link to each other
  await expect(page.getByRole('navigation', { name: 'Jiná úprava' })).toContainText('Vejce natvrdo')
  // a nutrient the dataset does not report is "bez údajů", never 0
  await page.goto('/food/houskovy-knedlik')
  await expect(page.getByTestId('nutrition-panel')).toContainText('bez údajů')
  await expect(page.getByText('Složení receptu')).toBeVisible()
})

test('barcode lookup rejects an invalid EAN without a request', async ({ page }) => {
  await page.goto('/potraviny')
  await page.getByTestId('barcode-input').fill('123')
  await page.getByRole('button', { name: 'Vyhledat' }).click()
  await expect(page.getByTestId('barcode-lookup')).toContainText('8 nebo 13 číslic')
})

test('accessibility: no serious or critical axe violations on key pages and app screens', async ({
  page,
}) => {
  test.setTimeout(120_000)
  for (const path of [
    ...[
      '/',
      '/?organ=heart',
      '/organ/heart',
      '/potraviny',
      '/food/almonds',
      '/food/spinach',
      '/food/beef-liver',
      '/food/nutella',
      '/doplnky',
      '/jak-funguje-telo',
      '/jak-funguje-telo/bilkoviny',
      '/pricing',
    ],
  ]) {
    await page.goto(path)
    await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' })
    const violations = await page.evaluate(async () => {
      const r = await (
        window as unknown as {
          axe: {
            run: (
              c: unknown,
              o: unknown,
            ) => Promise<{ violations: { id: string; impact: string; nodes: { target: string[] }[] }[] }>
          }
        }
      ).axe.run(document, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
      })
      return r.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
    })
    expect(violations, path).toEqual([])
  }
})

test('search with no results offers next steps and stays accessible', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Hledat průvodce/ }).click()
  await page.getByRole('dialog').getByRole('combobox').fill('kombucha')
  await expect(page.getByRole('status')).toContainText('nic nenašli')
  await expect(page.getByTestId('search-empty-help')).toBeVisible()
  await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' })
  const violations = await page.evaluate(async () => {
    const r = await (
      window as unknown as {
        axe: { run: (c: unknown) => Promise<{ violations: { id: string; impact: string }[] }> }
      }
    ).axe.run(document.querySelector('[role=dialog]'))
    return r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)
  })
  expect(violations).toEqual([])
  await page.getByRole('button', { name: /čárového kódu/ }).click()
  await expect(page.getByTestId('barcode-lookup')).toBeVisible()
})

test('the food page image (largest element on screen) is not lazy-loaded', async ({ page }) => {
  await page.goto('/food/almonds')
  const img = page.getByRole('img', { name: /Mandle/ }).first()
  await expect(img).toHaveAttribute('loading', 'eager')
  await expect(img).toHaveAttribute('fetchpriority', 'high')
})

test('food page compares raw and cooked forms per 100 g', async ({ page }) => {
  await page.goto('/food/spinach')
  const block = page.getByTestId('raw-cooked')
  await expect(block.getByRole('heading', { name: 'Jak se mění úpravou' })).toBeVisible()
  await expect(block.getByRole('row', { name: /Vitamín C/ })).toContainText('%')
  await expect(block.getByRole('link', { name: /upravené podoby/ })).toHaveAttribute(
    'href',
    '/food/spinach-cooked',
  )
})

test('junk food pages explain why they are not a recommended source', async ({ page }) => {
  await page.goto('/food/nutella')
  await expect(page.getByTestId('not-recommended')).toContainText('nedoporučujeme')
  await page.goto('/food/spinach')
  await expect(page.getByTestId('not-recommended')).toHaveCount(0)
})

test('404 suggests pages from the words in the URL', async ({ page }) => {
  const res = await page.goto('/food/losos-uzeny')
  expect(res?.status()).toBe(404)
  const s = page.getByTestId('not-found-suggestions')
  await expect(s.getByRole('link').first()).toContainText('Losos')
})

test('nutrition guides list the best foods for the topic', async ({ page }) => {
  await page.goto('/jak-funguje-telo/bilkoviny')
  const block = page.getByTestId('guide-foods')
  await expect(block.getByRole('heading', { name: 'Potraviny k tématu' })).toBeVisible()
  await expect(block.getByRole('link')).toHaveCount(6)
})

test('Content-Security-Policy is sent and blocks nothing the site needs', async ({ page }) => {
  const blocked: string[] = []
  page.on('console', (m) => {
    if (/Content Security Policy/i.test(m.text())) blocked.push(m.text().slice(0, 200))
  })
  const res = await page.goto('/')
  expect(res?.headers()['content-security-policy']).toContain("default-src 'self'")
  for (const path of ['/food/almonds', '/jak-funguje-telo/bilkoviny', '/pricing', '/doplnky']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  }
  expect(blocked).toEqual([])
})

test('a clicked organ shows its glow, not a browser focus rectangle', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?organ=liver') // zoomed in, so the liver is large and unobstructed
  const liver = page.locator('[data-organ="liver"]').first()
  const box = (await liver.boundingBox())!
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2) // a real pointer click, not keyboard
  expect(await page.evaluate(() => document.activeElement?.getAttribute('data-organ'))).toBe('liver')
  expect(await liver.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('none')
})

test('old app addresses send visitors to the app; public pages are static', async ({ request }) => {
  for (const path of ['/login', '/today', '/train', '/eat/explore', '/signup']) {
    const res = await request.get(path, { maxRedirects: 0 })
    expect([307, 308], path).toContain(res.status())
    expect(res.headers()['location'], path).toMatch(/^https?:\/\//)
  }
  // a statically rendered page is cacheable (a dynamic one is sent with no-store)
  const home = await request.get('/')
  expect(home.headers()['cache-control']).not.toContain('no-store')
})

test('the retired service worker cleans up after itself', async ({ request }) => {
  const sw = await (await request.get('/sw.js')).text()
  expect(sw).toContain('unregister')
  expect(sw).toContain('caches.delete')
})
