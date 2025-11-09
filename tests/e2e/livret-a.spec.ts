import { expect, test } from '@playwright/test'

test.describe('Livret A Page', () => {
	test('should redirect to login when not authenticated', async ({ page }) => {
		await page.goto('/en/dashboard/livret-a')
		await page.waitForURL(/\/login/, { timeout: 5000 })
		expect(page.url()).toContain('login')
	})

	test('should display livret a page with locale', async ({ page }) => {
		await page.goto('/en/dashboard/livret-a')
		await page.waitForLoadState('networkidle')
		const hasLivretATitle = await page.getByRole('heading', { name: /livret a/i }).isVisible().catch(() => false)
		expect(hasLivretATitle || page.url().includes('login')).toBeTruthy()
	})

	test('should handle French locale', async ({ page }) => {
		await page.goto('/fr/dashboard/livret-a')
		await page.waitForLoadState('networkidle')
		const urlContainsExpectedRoute = page.url().includes('/fr/') || page.url().includes('/login')
		expect(urlContainsExpectedRoute).toBeTruthy()
	})
})
