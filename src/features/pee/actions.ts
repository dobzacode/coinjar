'use server'

import { auth } from '@/lib/auth'
import { getCacheTag } from '@/lib/cache/tags'
import { db } from '@/lib/db'
import { peeAccounts, peeContributions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath, updateTag } from 'next/cache'
import { headers } from 'next/headers'
import type { PeeAccountInput, PeeContributionInput } from './schema'

async function getCurrentUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user?.id) {
		throw new Error('Non authentifié')
	}

	return session.user.id
}

export async function addContribution(data: PeeContributionInput) {
	const userId = await getCurrentUser()

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

	updateTag(getCacheTag.pee(userId))
	updateTag(getCacheTag.dashboard(userId))
	revalidatePath('/dashboard')
	revalidatePath('/dashboard/pee')

	return { success: true }
}

export async function updatePeeAccount(data: PeeAccountInput) {
	const userId = await getCurrentUser()

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

	updateTag(getCacheTag.pee(userId))
	updateTag(getCacheTag.dashboard(userId))
	revalidatePath('/dashboard')
	revalidatePath('/dashboard/pee')

	return { success: true }
}
