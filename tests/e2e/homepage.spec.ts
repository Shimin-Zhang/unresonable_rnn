import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays the hero section with title', async ({ page }) => {
    const title = page.getByRole('heading', {
      name: /The Unreasonable Effectiveness of RNNs/i,
    })
    await expect(title).toBeVisible()
  })

  test('displays the Start Learning button', async ({ page }) => {
    const startButton = page.getByRole('link', { name: /Start Learning/i })
    await expect(startButton).toBeVisible()
  })

  test('displays all four learning paths', async ({ page }) => {
    await expect(page.getByText('Conceptual')).toBeVisible()
    await expect(page.getByText('Full Practitioner')).toBeVisible()
    await expect(page.getByText('Quick Wins')).toBeVisible()
    await expect(page.getByText('Interview Prep')).toBeVisible()
  })

  test('displays all 11 modules', async ({ page }) => {
    await expect(page.getByText('Executive Context')).toBeVisible()
    await expect(page.getByText('Why Sequences Matter')).toBeVisible()
    await expect(page.getByText('RNN Architecture')).toBeVisible()
    await expect(page.getByText('Vanishing Gradients & LSTMs')).toBeVisible()
    await expect(page.getByText('Character-Level Modeling')).toBeVisible()
    await expect(page.getByText('Experiments')).toBeVisible()
    await expect(page.getByText('Beyond Text')).toBeVisible()
    await expect(page.getByText('Attention Mechanisms')).toBeVisible()
    await expect(page.getByText('Limitations & Path Forward')).toBeVisible()
    await expect(page.getByText('Implementation Deep Dive')).toBeVisible()
    await expect(page.getByText('Capstone Project')).toBeVisible()
  })

  test('navigates to module 0 when clicking Start Learning', async ({ page }) => {
    await page.getByRole('link', { name: /Start Learning/i }).first().click()
    await expect(page).toHaveURL('/modules/0')
    await expect(page.getByText('Executive Context')).toBeVisible()
  })
})

test.describe('Module Page', () => {
  test('displays module content placeholder', async ({ page }) => {
    await page.goto('/modules/0')
    await expect(page.getByText('Module Content Coming Soon')).toBeVisible()
  })

  test('shows navigation to next module', async ({ page }) => {
    await page.goto('/modules/0')
    await expect(page.getByText('Why Sequences Matter →')).toBeVisible()
  })

  test('can mark module as complete', async ({ page }) => {
    await page.goto('/modules/0')
    await page.getByRole('button', { name: /Mark as Complete/i }).click()
    await expect(page.getByText('Completed')).toBeVisible()
  })
})
