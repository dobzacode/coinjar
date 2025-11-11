import { revalidatePath, updateTag } from 'next/cache'
import { getCacheTag } from './tags'

/**
 * Invalidate cache for a specific feature
 * @param userId - User ID
 * @param feature - Feature name (livret-a, pea, or pee)
 */
export async function invalidateFeatureCache(
	userId: string,
	feature: 'livret-a' | 'pea' | 'pee'
): Promise<void> {
	switch (feature) {
		case 'livret-a':
			updateTag(getCacheTag.livretA(userId))
			revalidatePath('/dashboard/livret-a', 'page')
			break
		case 'pea':
			updateTag(getCacheTag.pea(userId))
			revalidatePath('/dashboard/pea', 'page')
			break
		case 'pee':
			updateTag(getCacheTag.pee(userId))
			revalidatePath('/dashboard/pee', 'page')
			break
	}

	updateTag(getCacheTag.dashboard(userId))
	revalidatePath('/dashboard', 'page')
}

/**
 * Invalidate only dashboard cache
 * @param userId - User ID
 */
export async function invalidateDashboardCache(userId: string): Promise<void> {
	updateTag(getCacheTag.dashboard(userId))
	revalidatePath('/dashboard', 'page')
}

/**
 * Invalidate all user-related caches
 * @param userId - User ID
 */
export async function invalidateAllUserCache(userId: string): Promise<void> {
	updateTag(getCacheTag.livretA(userId))
	updateTag(getCacheTag.pea(userId))
	updateTag(getCacheTag.pee(userId))
	updateTag(getCacheTag.dashboard(userId))

	revalidatePath('/dashboard', 'page')
	revalidatePath('/dashboard/livret-a', 'page')
	revalidatePath('/dashboard/pea', 'page')
	revalidatePath('/dashboard/pee', 'page')
}
