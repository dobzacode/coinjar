import { CACHE_REVALIDATION, getCacheTag } from '@/lib/cache/tags'
import { db } from '@/lib/db'
import { peaAccounts, peaHoldings } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

export async function getPeaAccountByUserId(userId: string) {
	const getCachedPea = unstable_cache(
		async () => {
			return db.query.peaAccounts.findFirst({
				where: eq(peaAccounts.userId, userId),
				with: {
					holdings: {
						orderBy: [desc(peaHoldings.purchaseDate)],
					},
				},
			})
		},
		['pea', userId],
		{
			tags: [getCacheTag.pea(userId)],
			revalidate: CACHE_REVALIDATION.PEA,
		}
	)
	return getCachedPea()
}

export async function createPeaAccount(userId: string, name: string) {
	const [newAccount] = await db
		.insert(peaAccounts)
		.values({
			userId,
			name,
			totalInvestment: '0.00',
		})
		.returning()

	return newAccount
}
