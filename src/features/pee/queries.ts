import { getCacheTag } from '@/lib/cache/tags'
import { db } from '@/lib/db'
import { peeAccounts, peeContributions } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'

export async function getPeeAccountByUserId(userId: string) {
	'use cache'
	cacheTag(getCacheTag.pee(userId))
	cacheLife('hours')

	return db.query.peeAccounts.findFirst({
		where: eq(peeAccounts.userId, userId),
		with: {
			contributions: {
				orderBy: [desc(peeContributions.date)],
			},
		},
	})
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
