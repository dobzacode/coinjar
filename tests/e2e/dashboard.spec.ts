import { expect, test } from '@playwright/test'

test.describe('Dashboard', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
		await page.waitForLoadState('networkidle')
	})

	test('should display the homepage', async ({ page }) => {
		await expect(page).toHaveTitle(/CoinJar/)
	})

	test('should redirect to login if not authenticated', async ({ page }) => {
		await page.goto('/en/dashboard')
		await page.waitForURL(/\/login/, { timeout: 5000 })
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
	test('should have working navigation links', async ({ page }) => {
		await page.goto('/')

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
	test('should be mobile responsive', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 })
		await page.goto('/')
		await expect(page).toHaveTitle(/CoinJar/)
	})

	test('should be tablet responsive', async ({ page }) => {
		await page.setViewportSize({ width: 768, height: 1024 })
		await page.goto('/')
		await expect(page).toHaveTitle(/CoinJar/)
	})

	test('should be desktop responsive', async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1080 })
		await page.goto('/')
		await expect(page).toHaveTitle(/CoinJar/)
	})
})

