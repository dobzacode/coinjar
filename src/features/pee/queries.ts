import { CACHE_REVALIDATION, getCacheTag } from '@/lib/cache/tags'
import { db } from '@/lib/db'
import { peeAccounts, peeContributions } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

export async function getPeeAccountByUserId(userId: string) {
	const getCachedPee = unstable_cache(
		async () => {
			return db.query.peeAccounts.findFirst({
				where: eq(peeAccounts.userId, userId),
				with: {
					contributions: {
						orderBy: [desc(peeContributions.date)],
					},
				},
			})
		},
		['pee', userId],
		{
			tags: [getCacheTag.pee(userId)],
			revalidate: CACHE_REVALIDATION.PEE,
		}
	)
	return getCachedPee()
}

export async function createPeeAccount(userId: string, companyName: string) {
	const [newAccount] = await db
		.insert(peeAccounts)
		.values({
			userId,
			companyName,
			sharePrice: '0.00',
			totalShares: '0.00',
		})
		.returning()

	return newAccount
}
