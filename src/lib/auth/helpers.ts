'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Get the current authenticated user's ID
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	return session?.user?.id ?? null
}

/**
 * Require authentication for server actions
 * @throws Error if user is not authenticated
 * @returns User ID
 */
export async function requireAuth(): Promise<string> {
	const userId = await getCurrentUserId()

	if (!userId) {
		throw new Error('Non authentifié')
	}

	return userId
}
