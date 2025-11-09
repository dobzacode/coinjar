import { auth } from '@/lib/auth'
import { CACHE_REVALIDATION, getCacheTag } from '@/lib/cache/tags'
import { db } from '@/lib/db'
import { livretA, peaAccounts, peeAccounts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { cache } from 'react'

export const getUserId = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	return session?.user?.id ?? null
})

export const getUserLivret = async (userId: string) => {
	const getCachedLivret = unstable_cache(
		async () => {
			return db.query.livretA.findFirst({
				where: eq(livretA.userId, userId),
			})
		},
		['livret-a', userId],
		{
			tags: [getCacheTag.livretA(userId), getCacheTag.dashboard(userId)],
			revalidate: CACHE_REVALIDATION.LIVRET_A,
		}
	)
	return getCachedLivret()
}

export const getUserPee = async (userId: string) => {
	const getCachedPee = unstable_cache(
		async () => {
			return db.query.peeAccounts.findFirst({
				where: eq(peeAccounts.userId, userId),
			})
		},
		['pee', userId],
		{
			tags: [getCacheTag.pee(userId), getCacheTag.dashboard(userId)],
			revalidate: CACHE_REVALIDATION.PEE,
		}
	)
	return getCachedPee()
}

export const getUserPea = async (userId: string) => {
	const getCachedPea = unstable_cache(
		async () => {
			return db.query.peaAccounts.findFirst({
				where: eq(peaAccounts.userId, userId),
				with: {
					holdings: true,
				},
			})
		},
		['pea', userId],
		{
			tags: [getCacheTag.pea(userId), getCacheTag.dashboard(userId)],
			revalidate: CACHE_REVALIDATION.PEA,
		}
	)
	return getCachedPea()
}
