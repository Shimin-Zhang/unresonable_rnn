import { test, expect } from '@playwright/test'

test.describe('Module 7: LaTeX Equations and Color Coding', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Module 7 and wait for content to load
    await page.goto('/modules/7')
    // Wait for the module content to load (lazy loaded)
    await page.waitForSelector('.katex', { timeout: 10000 })
  })

  test('renders Module 7 page title correctly', async ({ page }) => {
    // Use exact match for the main page title
    const title = page.getByRole('heading', {
      name: 'Attention Mechanisms',
      exact: true,
    })
    await expect(title).toBeVisible()
  })

  test('displays Attention Score equation with KaTeX', async ({ page }) => {
    // Look for the Attention Score label and its equation
    const attentionScoreSection = page.locator('text=Attention Score').first()
    await expect(attentionScoreSection).toBeVisible()

    // Check that KaTeX rendered elements exist
    const katexElements = page.locator('.katex')
    await expect(katexElements.first()).toBeVisible()
  })

  test('displays Attention Weights equation with softmax', async ({ page }) => {
    // The attention weights equation should contain softmax-related content
    const attentionWeightsSection = page.locator('text=Attention Weights')
    await expect(attentionWeightsSection.first()).toBeVisible()

    // Check that the equation container exists
    const equationContainers = page.locator('.equation-container')
    expect(await equationContainers.count()).toBeGreaterThan(0)
  })

  test('displays Context Vector equation', async ({ page }) => {
    // Look for the Context Vector section
    const contextVectorSection = page.locator('text=Context Vector')
    await expect(contextVectorSection.first()).toBeVisible()
  })

  test('renders KaTeX elements with proper structure', async ({ page }) => {
    // Wait for KaTeX to finish rendering
    const katexContainers = page.locator('.katex-container .katex')

    // Module 7 has multiple equations - at least 3 main ones
    const count = await katexContainers.count()
    expect(count).toBeGreaterThanOrEqual(3)

    // Each KaTeX element should have the katex-html structure
    const firstKatex = katexContainers.first()
    await expect(firstKatex).toBeVisible()

    // KaTeX renders to katex-html span
    const katexHtml = firstKatex.locator('.katex-html')
    await expect(katexHtml).toBeVisible()
  })

  test('applies color coding to equation symbols', async ({ page }) => {
    // Check for colored elements in the KaTeX output
    // KaTeX applies colors via inline styles on span elements

    // Red color for attention score e_{t,i} - #dc2626
    const redElements = page.locator('.katex span[style*="color"]').filter({
      has: page.locator('text=/e/')
    })

    // Check that colored elements exist (any color)
    const coloredElements = page.locator('.katex span[style*="color"]')
    expect(await coloredElements.count()).toBeGreaterThan(0)
  })

  test('displays symbol table with meanings', async ({ page }) => {
    // Symbol tables should be visible below equations
    const symbolTables = page.locator('.symbol-table-container, [class*="symbol"]')
    expect(await symbolTables.count()).toBeGreaterThan(0)
  })

  test('all key attention mechanism terms are present', async ({ page }) => {
    // Check for key attention-related content using first() to avoid strict mode issues
    await expect(page.getByText('Attention score', { exact: false }).first()).toBeVisible()
    await expect(page.getByText('softmax', { exact: false }).first()).toBeVisible()
    await expect(page.getByText(/context vector/i).first()).toBeVisible()
    await expect(page.getByText(/weighted sum/i).first()).toBeVisible()
  })

  test('equations are accessible with aria-labels', async ({ page }) => {
    // Check for aria-label on equation containers
    const ariaLabeledEquations = page.locator('[aria-label*="equation"]')
    expect(await ariaLabeledEquations.count()).toBeGreaterThan(0)
  })

  test('inline equations render correctly', async ({ page }) => {
    // Module 7 has inline equations like c_t = Σα_{t,i}·h_i in summary
    // Look for inline katex elements
    const inlineKatex = page.locator('.katex').filter({
      hasNot: page.locator('.katex-display')
    })
    expect(await inlineKatex.count()).toBeGreaterThan(0)
  })

  test('three steps of attention are displayed', async ({ page }) => {
    // Module 7 explains three steps: Score, Normalize, Combine
    // Use heading role with exact names to avoid duplicate matches
    await expect(
      page.getByRole('heading', { name: 'Score: How relevant is each encoder state?' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Normalize: Convert scores to probabilities' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Combine: Weighted sum of encoder states' })
    ).toBeVisible()
  })

  test('equations render without errors', async ({ page }) => {
    // Check that there are no error messages from KaTeX
    const errorMessages = page.locator('text=/Error rendering/')
    expect(await errorMessages.count()).toBe(0)
  })

  test('summary section contains key equations', async ({ page }) => {
    // Scroll to summary section
    const summarySection = page.getByRole('heading', { name: 'Summary' })
    await summarySection.scrollIntoViewIfNeeded()
    await expect(summarySection).toBeVisible()

    // Summary should have the key equations section
    await expect(page.getByText('Key Equations')).toBeVisible()

    // Check that the summary card contains score, weights, and context labels
    const summaryCard = page.locator('.rounded-lg').filter({ hasText: 'Key Equations' })
    await expect(summaryCard.getByText('Score:')).toBeVisible()
    await expect(summaryCard.getByText('Weights:')).toBeVisible()
    await expect(summaryCard.getByText('Context:')).toBeVisible()
  })
})

test.describe('Module 7: Color Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modules/7')
    await page.waitForSelector('.katex', { timeout: 10000 })
  })

  test('verifies red color for attention scores', async ({ page }) => {
    // Find elements with red color styling (hex or rgb)
    // #dc2626 = rgb(220, 38, 38)
    const redSpans = page.locator('.katex span[style*="#dc2626"], .katex span[style*="rgb(220, 38, 38)"]')
    const count = await redSpans.count()

    // Should have at least some red colored elements for e_{t,i}
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('verifies blue color for decoder state', async ({ page }) => {
    // #2563eb = rgb(37, 99, 235)
    const blueSpans = page.locator('.katex span[style*="#2563eb"], .katex span[style*="rgb(37, 99, 235)"]')
    const count = await blueSpans.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('verifies green color for encoder state', async ({ page }) => {
    // #16a34a = rgb(22, 163, 74)
    const greenSpans = page.locator('.katex span[style*="#16a34a"], .katex span[style*="rgb(22, 163, 74)"]')
    const count = await greenSpans.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('verifies orange color for attention weights', async ({ page }) => {
    // #ea580c = rgb(234, 88, 12)
    const orangeSpans = page.locator('.katex span[style*="#ea580c"], .katex span[style*="rgb(234, 88, 12)"]')
    const count = await orangeSpans.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('verifies cyan color for context vector', async ({ page }) => {
    // #0891b2 = rgb(8, 145, 178)
    const cyanSpans = page.locator('.katex span[style*="#0891b2"], .katex span[style*="rgb(8, 145, 178)"]')
    const count = await cyanSpans.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('verifies purple color for alignment model and softmax', async ({ page }) => {
    // #9333ea = rgb(147, 51, 234)
    const purpleSpans = page.locator('.katex span[style*="#9333ea"], .katex span[style*="rgb(147, 51, 234)"]')
    const count = await purpleSpans.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Module 7: Visual Regression', () => {
  test.skip('takes screenshot of equations section', async ({ page }) => {
    // Skip visual regression until baseline is established
    await page.goto('/modules/7')
    await page.waitForSelector('.katex', { timeout: 10000 })

    // Scroll to the Three Steps of Attention section
    const stepsSection = page.getByText('The Three Steps of Attention')
    await stepsSection.scrollIntoViewIfNeeded()

    // Take a screenshot for visual verification
    await expect(page).toHaveScreenshot('module7-attention-equations.png', {
      fullPage: false,
      mask: [page.locator('header'), page.locator('footer')],
    })
  })
})
