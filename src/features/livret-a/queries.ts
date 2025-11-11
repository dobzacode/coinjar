import { getCacheTag } from '@/lib/cache/tags'
import { db } from '@/lib/db'
import {
	livretA,
	livretARateHistory,
	livretATransactions,
} from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'

export async function getLivretAByUserId(userId: string) {
	'use cache'
	cacheTag(getCacheTag.livretA(userId))
	cacheLife('hours')

	return db.query.livretA.findFirst({
		where: eq(livretA.userId, userId),
		with: {
			transactions: {
				orderBy: [desc(livretATransactions.date)],
			},
		},
	})
}

export async function createLivretA(userId: string) {
	const [newLivret] = await db
		.insert(livretA)
		.values({
			userId,
			balance: '0.00',
			currentRate: '3.000',
		})
		.returning()

	return newLivret
}

export async function getLivretATransactions(livretId: string) {
	return await db.query.livretATransactions.findMany({
		where: eq(livretATransactions.livretId, livretId),
		orderBy: [desc(livretATransactions.date)],
	})
}

export async function getRateHistory() {
	return await db.query.livretARateHistory.findMany({
		orderBy: [desc(livretARateHistory.effectiveDate)],
	})
}
