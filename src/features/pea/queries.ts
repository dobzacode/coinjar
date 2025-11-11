import { getCacheTag } from '@/lib/cache/tags'
import { db } from '@/lib/db'
import { peaAccounts, peaHoldings } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'

export async function getPeaAccountByUserId(userId: string) {
	'use cache'
	cacheTag(getCacheTag.pea(userId))
	cacheLife('hours')

	return db.query.peaAccounts.findFirst({
		where: eq(peaAccounts.userId, userId),
		with: {
			holdings: {
				orderBy: [desc(peaHoldings.purchaseDate)],
			},
		},
	})
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
