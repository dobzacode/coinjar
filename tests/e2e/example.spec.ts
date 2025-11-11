import { expect, test } from '@playwright/test'

test('homepage loads successfully', async ({ page, context }) => {
	await context.clearCookies()
	await page.goto('/')
	await page.waitForLoadState('domcontentloaded')
	await expect(page).toHaveTitle(/CoinJar/)
})

test('login page is accessible and renders', async ({ page, context }) => {
	await context.clearCookies()
	await page.goto('/login')
	await page.waitForLoadState('domcontentloaded')
	await expect(page).toHaveTitle(/CoinJar/)
	const pageContent = await page.content()
	expect(pageContent.length).toBeGreaterThan(100)
})

test('French login page is accessible', async ({ page, context }) => {
	await context.clearCookies()
	await page.goto('/fr/login')
	await page.waitForLoadState('domcontentloaded')
	await expect(page).toHaveTitle(/CoinJar/)
	const pageContent = await page.content()
	expect(pageContent.length).toBeGreaterThan(100)
})
