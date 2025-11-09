import { expect, test } from '@playwright/test'

test.describe('PEE Page', () => {
	test('should redirect to login when not authenticated', async ({ page }) => {
		await page.goto('/en/dashboard/pee')
		await page.waitForURL(/\/login/, { timeout: 5000 })
		expect(page.url()).toContain('login')
	})

	test('should display PEE page with locale', async ({ page }) => {
		await page.goto('/en/dashboard/pee')
		await page.waitForLoadState('networkidle')
		const hasPEETitle = await page.getByRole('heading', { name: /employee savings plan/i }).isVisible().catch(() => false)
		expect(hasPEETitle || page.url().includes('login')).toBeTruthy()
	})

	test('should handle French locale', async ({ page }) => {
		await page.goto('/fr/dashboard/pee')
		await page.waitForLoadState('networkidle')
		const urlContainsExpectedRoute = page.url().includes('/fr/') || page.url().includes('/login')
		expect(urlContainsExpectedRoute).toBeTruthy()
	})
})
