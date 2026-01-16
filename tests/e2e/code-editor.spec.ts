import { test, expect } from '@playwright/test'

test.describe('Code Editor Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/code-editor')
    // Wait for DOM to be loaded (not networkidle as Pyodide CDN loads continuously)
    await page.waitForLoadState('domcontentloaded')
  })

  test('displays the code editor component', async ({ page }) => {
    await expect(page.getByTestId('code-editor')).toBeVisible({ timeout: 10000 })
  })

  test('displays exercise title and description', async ({ page }) => {
    await expect(page.getByText('Sum Function')).toBeVisible({ timeout: 10000 })
    await expect(
      page.getByText(/Write a function called.*sum_numbers/)
    ).toBeVisible()
  })

  test('displays difficulty rating', async ({ page }) => {
    // Use getByLabel instead of getByLabelText in Playwright
    await expect(page.getByLabel(/Difficulty:/)).toBeVisible({ timeout: 10000 })
  })

  test('displays Run and Check Answer buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Run/i })).toBeVisible({ timeout: 10000 })
    await expect(
      page.getByRole('button', { name: /Check Answer/i })
    ).toBeVisible()
  })

  test('displays Hint button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Show hint/i })).toBeVisible({ timeout: 10000 })
  })

  test('displays the editor pane', async ({ page }) => {
    await expect(page.getByTestId('editor-pane')).toBeVisible({ timeout: 10000 })
  })

  test('displays the output panel', async ({ page }) => {
    await expect(page.getByTestId('output-panel')).toBeVisible({ timeout: 10000 })
    await expect(
      page.getByText('Click "Run" to execute your code')
    ).toBeVisible()
  })

  test('displays hint system', async ({ page }) => {
    await expect(page.getByTestId('hint-system')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Hints (0/3)')).toBeVisible()
  })

  test('reveals hints when clicking Reveal Next Hint', async ({ page }) => {
    await page.getByText('Reveal Next Hint').click()
    await expect(page.getByText('Hints (1/3)')).toBeVisible()
    await expect(page.getByText('Hint 1')).toBeVisible()
  })

  test('expands hint content when clicking on hint', async ({ page }) => {
    await page.getByText('Reveal Next Hint').click()
    await page.getByText('Hint 1').click()
    await expect(
      page.getByText('Start by initializing a variable')
    ).toBeVisible()
  })

  test('displays features list', async ({ page }) => {
    await expect(page.getByText('Features')).toBeVisible({ timeout: 10000 })
    await expect(
      page.getByText('Python syntax highlighting with CodeMirror 6')
    ).toBeVisible()
    await expect(
      page.getByText('Browser-based Python execution via Pyodide')
    ).toBeVisible()
  })
})

test.describe('Code Editor - Responsive', () => {
  test('renders correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/demo/code-editor')
    await page.waitForLoadState('domcontentloaded')

    await expect(page.getByTestId('code-editor')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('editor-pane')).toBeVisible()
    await expect(page.getByTestId('output-panel')).toBeVisible()
  })
})
