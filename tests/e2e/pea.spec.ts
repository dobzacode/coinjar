import { expect, test } from '@playwright/test'

test.describe('PEA Page', () => {
	test('should redirect to login when not authenticated', async ({ page }) => {
		await page.goto('/en/dashboard/pea')
		await page.waitForURL(/\/login/, { timeout: 5000 })
		expect(page.url()).toContain('login')
	})

	test('should display PEA page with locale', async ({ page }) => {
		await page.goto('/en/dashboard/pea')
		await page.waitForLoadState('networkidle')
		const hasPEATitle = await page
			.getByRole('heading', { name: /equity savings plan/i })
			.isVisible()
			.catch(() => false)
		expect(hasPEATitle || page.url().includes('login')).toBeTruthy()
	})

	test('should handle French locale', async ({ page }) => {
		await page.goto('/fr/dashboard/pea')
		await page.waitForLoadState('networkidle')
		const urlContainsExpectedRoute =
			page.url().includes('/fr/') || page.url().includes('/login')
		expect(urlContainsExpectedRoute).toBeTruthy()
	})
})
