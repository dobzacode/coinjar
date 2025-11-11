import { getLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getCurrentUserId } from './helpers'

/**
 * Get authenticated user ID for page components
 * @returns User ID or null if not authenticated
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
	return getCurrentUserId()
}

/**
 * Require authentication for page components (redirects to login if not authenticated)
 * @returns User ID
 */
export async function requireAuthForPage(): Promise<string> {
	const userId = await getCurrentUserId()

	if (!userId) {
		const locale = await getLocale()
		redirect(`/${locale}/login`)
	}

	return userId
}

/**
 * Redirect authenticated users to dashboard (for login/signup pages)
 * @param locale - Current locale
 */
export async function redirectIfAuthenticated(locale: string): Promise<void> {
	const userId = await getCurrentUserId()

	if (userId) {
		redirect(`/${locale}/dashboard`)
	}
}
