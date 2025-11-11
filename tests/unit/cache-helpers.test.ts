import {
	invalidateFeatureCache,
	invalidateDashboardCache,
	invalidateAllUserCache,
} from '@/lib/cache/helpers'
import { getCacheTag } from '@/lib/cache/tags'
import { revalidatePath, updateTag } from 'next/cache'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/cache', () => ({
	revalidatePath: vi.fn(),
	updateTag: vi.fn(),
}))

describe('Cache Helpers', () => {
	const testUserId = 'test-user-123'

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('invalidateFeatureCache', () => {
		it('should invalidate livret-a cache and dashboard', async () => {
			await invalidateFeatureCache(testUserId, 'livret-a')

			expect(updateTag).toHaveBeenCalledWith(getCacheTag.livretA(testUserId))
			expect(updateTag).toHaveBeenCalledWith(getCacheTag.dashboard(testUserId))
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard/livret-a', 'page')
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard', 'page')
		})

		it('should invalidate pea cache and dashboard', async () => {
			await invalidateFeatureCache(testUserId, 'pea')

			expect(updateTag).toHaveBeenCalledWith(getCacheTag.pea(testUserId))
			expect(updateTag).toHaveBeenCalledWith(getCacheTag.dashboard(testUserId))
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard/pea', 'page')
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard', 'page')
		})

		it('should invalidate pee cache and dashboard', async () => {
			await invalidateFeatureCache(testUserId, 'pee')

			expect(updateTag).toHaveBeenCalledWith(getCacheTag.pee(testUserId))
			expect(updateTag).toHaveBeenCalledWith(getCacheTag.dashboard(testUserId))
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard/pee', 'page')
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard', 'page')
		})
	})

	describe('invalidateDashboardCache', () => {
		it('should invalidate dashboard cache only', async () => {
			await invalidateDashboardCache(testUserId)

			expect(updateTag).toHaveBeenCalledWith(getCacheTag.dashboard(testUserId))
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard', 'page')
			expect(updateTag).toHaveBeenCalledTimes(1)
		})
	})

	describe('invalidateAllUserCache', () => {
		it('should invalidate all user caches and paths', async () => {
			await invalidateAllUserCache(testUserId)

			expect(updateTag).toHaveBeenCalledWith(getCacheTag.livretA(testUserId))
			expect(updateTag).toHaveBeenCalledWith(getCacheTag.pea(testUserId))
			expect(updateTag).toHaveBeenCalledWith(getCacheTag.pee(testUserId))
			expect(updateTag).toHaveBeenCalledWith(getCacheTag.dashboard(testUserId))

			expect(revalidatePath).toHaveBeenCalledWith('/dashboard', 'page')
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard/livret-a', 'page')
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard/pea', 'page')
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard/pee', 'page')
		})
	})
})
