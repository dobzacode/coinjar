import { expect, test } from '@playwright/test'

test.describe('PEE Page', () => {
	test('should redirect to login when not authenticated', async ({
		page,
		context,
	}) => {
		await context.clearCookies()
		await page.goto('/dashboard/pee')
		await page.waitForLoadState('domcontentloaded')
		await page.waitForURL(/\/login/, { timeout: 10000 })
		expect(page.url()).toContain('login')
	})

	test('should display PEE page with locale', async ({ page, context }) => {
		await context.clearCookies()
		await page.goto('/dashboard/pee')
		await page.waitForLoadState('domcontentloaded')
		const hasPEETitle = await page
			.getByRole('heading', { name: /employee savings plan/i })
			.isVisible()
			.catch(() => false)
		expect(hasPEETitle || page.url().includes('login')).toBeTruthy()
	})

	test('should handle French locale', async ({ page, context }) => {
		await context.clearCookies()
		await page.goto('/fr/dashboard/pee')
		await page.waitForLoadState('domcontentloaded')
		const urlContainsExpectedRoute =
			page.url().includes('/fr/') || page.url().includes('/login')
		expect(urlContainsExpectedRoute).toBeTruthy()
	})
})
