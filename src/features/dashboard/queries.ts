import { getCurrentUserId } from '@/lib/auth/helpers'
import { getCacheTag } from '@/lib/cache/tags'
import { db } from '@/lib/db'
import {
	livretA,
	livretATransactions,
	peaAccounts,
	peaHoldings,
	peeAccounts,
	peeContributions,
	users,
} from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'

export async function getUserId() {
	'use cache: private'
	cacheLife('hours')
	return getCurrentUserId()
}

export async function getUserLivret(userId: string) {
	'use cache'
	cacheTag(getCacheTag.livretA(userId), getCacheTag.dashboard(userId))
	cacheLife('hours')

	return db.query.livretA.findFirst({
		where: eq(livretA.userId, userId),
	})
}

export async function getUserPee(userId: string) {
	'use cache'
	cacheTag(getCacheTag.pee(userId), getCacheTag.dashboard(userId))
	cacheLife('hours')

	return db.query.peeAccounts.findFirst({
		where: eq(peeAccounts.userId, userId),
	})
}

export async function getUserPea(userId: string) {
	'use cache'
	cacheTag(getCacheTag.pea(userId), getCacheTag.dashboard(userId))
	cacheLife('hours')

	return db.query.peaAccounts.findFirst({
		where: eq(peaAccounts.userId, userId),
		with: {
			holdings: true,
		},
	})
}

export async function getUserSignupDate(userId: string) {
	'use cache'
	cacheTag(getCacheTag.dashboard(userId))
	cacheLife({ revalidate: 300 })

	const user = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: {
			createdAt: true,
		},
	})
	return user?.createdAt ?? null
}

export async function getEarliestTransactionDate(userId: string) {
	'use cache'
	cacheTag(
		getCacheTag.livretA(userId),
		getCacheTag.pea(userId),
		getCacheTag.pee(userId),
		getCacheTag.dashboard(userId)
	)
	cacheLife({ revalidate: 300 })

	const dates: Date[] = []

	const userLivret = await db.query.livretA.findFirst({
		where: eq(livretA.userId, userId),
	})

	if (userLivret) {
		const earliestLivretTransaction =
			await db.query.livretATransactions.findFirst({
				where: eq(livretATransactions.livretId, userLivret.id),
				orderBy: asc(livretATransactions.date),
			})
		if (earliestLivretTransaction) {
			dates.push(new Date(earliestLivretTransaction.date))
		}
	}

	const userPea = await db.query.peaAccounts.findFirst({
		where: eq(peaAccounts.userId, userId),
	})

	if (userPea) {
		const earliestPeaHolding = await db.query.peaHoldings.findFirst({
			where: eq(peaHoldings.peaAccountId, userPea.id),
			orderBy: asc(peaHoldings.purchaseDate),
		})
		if (earliestPeaHolding) {
			dates.push(new Date(earliestPeaHolding.purchaseDate))
		}
	}

	const userPee = await db.query.peeAccounts.findFirst({
		where: eq(peeAccounts.userId, userId),
	})

	if (userPee) {
		const earliestPeeContribution = await db.query.peeContributions.findFirst({
			where: eq(peeContributions.peeAccountId, userPee.id),
			orderBy: asc(peeContributions.date),
		})
		if (earliestPeeContribution) {
			dates.push(new Date(earliestPeeContribution.date))
		}
	}

	if (dates.length === 0) return null

	return new Date(Math.min(...dates.map((d) => d.getTime())))
}
