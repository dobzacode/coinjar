'use server'

import { requireAuth } from '@/lib/auth/helpers'
import { invalidateFeatureCache } from '@/lib/cache/helpers'
import { db } from '@/lib/db'
import { peeAccounts, peeContributions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { PeeAccountInput, PeeContributionInput } from './schema'

export async function addContribution(data: PeeContributionInput) {
	const userId = await requireAuth()

	const userPee = await db.query.peeAccounts.findFirst({
		where: eq(peeAccounts.userId, userId),
	})

	if (!userPee) {
		throw new Error('Compte PEE non trouvé')
	}

	await db.insert(peeContributions).values({
		peeAccountId: userPee.id,
		type: data.type,
		amount: data.amount.toString(),
		shares: data.shares.toString(),
		date: data.date,
	})

	const currentTotalShares = parseFloat(userPee.totalShares)
	const newTotalShares = currentTotalShares + data.shares

	await db
		.update(peeAccounts)
		.set({
			totalShares: newTotalShares.toString(),
			updatedAt: new Date(),
		})
		.where(eq(peeAccounts.id, userPee.id))

	await invalidateFeatureCache(userId, 'pee')

	return { success: true }
}

export async function updatePeeAccount(data: PeeAccountInput) {
	const userId = await requireAuth()

	const userPee = await db.query.peeAccounts.findFirst({
		where: eq(peeAccounts.userId, userId),
	})

	if (!userPee) {
		throw new Error('Compte PEE non trouvé')
	}

	await db
		.update(peeAccounts)
		.set({
			companyName: data.companyName,
			sharePrice: data.sharePrice.toString(),
			updatedAt: new Date(),
		})
		.where(eq(peeAccounts.id, userPee.id))

	await invalidateFeatureCache(userId, 'pee')

	return { success: true }
}
