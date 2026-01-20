import { test, expect } from '@playwright/test'

test.describe('Module 5: Experiments Content', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Module 5 and wait for content to load
    await page.goto('/modules/5')
    // Wait for the main content to load
    await page.waitForSelector('h2', { timeout: 10000 })
  })

  test('renders Module 5 page title correctly', async ({ page }) => {
    // Check for "Experiments" in the module header
    await expect(page.getByRole('heading', { name: /Experiments/i }).first()).toBeVisible()
  })

  test('displays The Unreasonable Effectiveness section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Unreasonable Effectiveness/i })
    ).toBeVisible()
  })

  test('displays all experiment cards', async ({ page }) => {
    // Check for the main experiment types using headings for uniqueness
    await expect(page.getByRole('heading', { name: 'Shakespeare' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Paul Graham Essays' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Wikipedia' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'LaTeX (Algebraic Geometry)' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Linux Kernel Source' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Baby Names' })).toBeVisible()
  })

  test('displays code samples with proper styling', async ({ page }) => {
    // Check that code samples are displayed in dark-themed pre blocks
    // The pre element contains spans with text-green-400 or text-cyan-400
    const codeBlocks = page.locator('.bg-slate-900 pre')
    expect(await codeBlocks.count()).toBeGreaterThan(0)
  })

  test('displays Training Dynamics section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Training Dynamics/i })
    ).toBeVisible()

    // Check for iteration markers
    await expect(page.getByText('Random babbling').first()).toBeVisible()
    await expect(page.getByText('Learning word boundaries').first()).toBeVisible()
    await expect(page.getByText('Basic structure emerges').first()).toBeVisible()
    await expect(page.getByText('Coherent generation').first()).toBeVisible()
  })

  test('displays Neuron Visualization section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Looking Inside/i })
    ).toBeVisible()

    // Check for neuron types
    await expect(page.getByText('URL Detector Neuron').first()).toBeVisible()
    await expect(page.getByText('Quote State Neuron').first()).toBeVisible()
    await expect(page.getByText('Bracket Depth Cell').first()).toBeVisible()
    await expect(page.getByText('Line Position Neuron').first()).toBeVisible()
  })

  test('displays Key Takeaways section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Key Takeaways/i })
    ).toBeVisible()

    // Check for numbered takeaways
    const takeawayItems = page.locator('.rounded-full.bg-emerald-100')
    expect(await takeawayItems.count()).toBeGreaterThanOrEqual(5)
  })

  test('displays legacy comparison section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /char-rnn to GPT/i })
    ).toBeVisible()

    // Check for comparison content
    await expect(page.getByText('Then (char-rnn, 2015)').first()).toBeVisible()
    await expect(page.getByText('Now (GPT-4, 2023+)').first()).toBeVisible()
  })

  test('displays stakeholder explanation cards', async ({ page }) => {
    // Check for explanation card headers
    await expect(page.getByText('Dinner Party').first()).toBeVisible()
    await expect(page.getByText('For Managers').first()).toBeVisible()
    await expect(page.getByText('Technical').first()).toBeVisible()
    await expect(page.getByText('Interview').first()).toBeVisible()
  })

  test('renders without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.reload()
    await page.waitForSelector('h2', { timeout: 10000 })

    // Filter out known benign errors
    const significantErrors = errors.filter(
      (err) => !err.includes('favicon') && !err.includes('404')
    )
    expect(significantErrors).toHaveLength(0)
  })

  test('no LaTeX rendering in Module 5 (text samples only)', async ({ page }) => {
    // Module 5 shows code/text samples, not rendered LaTeX
    // Verify that code is displayed as text, not rendered equations
    const latexSample = page.locator('pre').filter({ hasText: '\\begin{proof}' })
    await expect(latexSample.first()).toBeVisible()

    // The LaTeX should be displayed as text, not rendered
    // So we should see the raw LaTeX commands in the pre block
    const latexText = await latexSample.first().textContent()
    expect(latexText).toContain('\\begin{proof}')
    expect(latexText).toContain('\\mathcal')
  })

  test('Shakespeare sample contains expected content', async ({ page }) => {
    // Look for the Shakespeare heading first
    await expect(page.getByRole('heading', { name: 'Shakespeare' })).toBeVisible()

    // Check for characteristic Shakespeare content in the pre blocks
    const shakespeareContent = page.locator('pre').filter({ hasText: 'PANDARUS' })
    await expect(shakespeareContent.first()).toBeVisible()
  })
})
