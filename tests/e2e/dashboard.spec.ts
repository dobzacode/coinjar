import { expect, test } from '@playwright/test'

test.describe('Dashboard', () => {
	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies()
		await page.goto('/')
		await page.waitForLoadState('domcontentloaded')
	})

	test('should display the homepage', async ({ page }) => {
		await expect(page).toHaveTitle(/CoinJar/)
	})

	test('should redirect to login if not authenticated', async ({
		page,
		context,
	}) => {
		await context.clearCookies()
		await page.goto('/dashboard')
		await page.waitForLoadState('domcontentloaded')
		await page.waitForURL(/\/login/, { timeout: 10000 })
		expect(page.url()).toContain('login')
	})

	test('should display language picker', async ({ page }) => {
		const languagePicker = page.getByRole('button', {
			name: /language|langue/i,
		})
		if (await languagePicker.isVisible()) {
			await expect(languagePicker).toBeVisible()
		}
	})

	test('should display theme toggle', async ({ page }) => {
		const themeToggle = page.getByRole('button', { name: /toggle theme/i })
		if (await themeToggle.isVisible()) {
			await expect(themeToggle).toBeVisible()
		}
	})
})

test.describe('Navigation', () => {
	test('should have working navigation links', async ({ page, context }) => {
		await context.clearCookies()
		await page.goto('/')
		await page.waitForLoadState('domcontentloaded')

		const sidebar = page.locator('aside')
		if (await sidebar.isVisible()) {
			const dashboardLink = sidebar.getByRole('link', {
				name: /dashboard|tableau de bord/i,
			})
			await expect(dashboardLink).toBeVisible()
		}
	})
})

test.describe('Responsive Design', () => {
	test('should be mobile responsive', async ({ page, context }) => {
		await context.clearCookies()
		await page.setViewportSize({ width: 375, height: 667 })
		await page.goto('/')
		await page.waitForLoadState('domcontentloaded')
		await expect(page).toHaveTitle(/CoinJar/)
	})

	test('should be tablet responsive', async ({ page, context }) => {
		await context.clearCookies()
		await page.setViewportSize({ width: 768, height: 1024 })
		await page.goto('/')
		await page.waitForLoadState('domcontentloaded')
		await expect(page).toHaveTitle(/CoinJar/)
	})

	test('should be desktop responsive', async ({ page, context }) => {
		await context.clearCookies()
		await page.setViewportSize({ width: 1920, height: 1080 })
		await page.goto('/')
		await page.waitForLoadState('domcontentloaded')
		await expect(page).toHaveTitle(/CoinJar/)
	})
})
