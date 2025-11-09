import { expect, test } from '@playwright/test'

test('homepage loads successfully', async ({ page }) => {
	await page.goto('/')
	await page.waitForLoadState('networkidle')
	await expect(page).toHaveTitle(/CoinJar/)
})

test('login page is accessible and renders', async ({ page }) => {
	await page.goto('/en/login')
	await page.waitForLoadState('networkidle')
	await expect(page).toHaveTitle(/CoinJar/)
	const pageContent = await page.content()
	expect(pageContent.length).toBeGreaterThan(100)
})

test('French login page is accessible', async ({ page }) => {
	await page.goto('/fr/login')
	await page.waitForLoadState('networkidle')
	await expect(page).toHaveTitle(/CoinJar/)
	const pageContent = await page.content()
	expect(pageContent.length).toBeGreaterThan(100)
})
