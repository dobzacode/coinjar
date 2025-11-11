import { auth } from '@/lib/auth'
import { getCurrentUserId, requireAuth } from '@/lib/auth/helpers'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAuthSession } from '../utils/test-helpers'

vi.mock('@/lib/auth', () => ({
	auth: {
		api: {
			getSession: vi.fn(),
		},
	},
}))

vi.mock('next/headers', () => ({
	headers: vi.fn(async () => new Headers()),
}))

describe('Auth Helpers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('getCurrentUserId', () => {
		it('should return user ID when authenticated', async () => {
			const userId = 'test-user-123'
			vi.mocked(auth.api.getSession).mockResolvedValue(mockAuthSession(userId))

			const result = await getCurrentUserId()

			expect(result).toBe(userId)
		})

		it('should return null when not authenticated', async () => {
			vi.mocked(auth.api.getSession).mockResolvedValue(null)

			const result = await getCurrentUserId()

			expect(result).toBeNull()
		})
	})

	describe('requireAuth', () => {
		it('should return user ID when authenticated', async () => {
			const userId = 'test-user-456'
			vi.mocked(auth.api.getSession).mockResolvedValue(mockAuthSession(userId))

			const result = await requireAuth()

			expect(result).toBe(userId)
		})

		it('should throw error when not authenticated', async () => {
			vi.mocked(auth.api.getSession).mockResolvedValue(null)

			await expect(requireAuth()).rejects.toThrow('Non authentifié')
		})
	})
})
