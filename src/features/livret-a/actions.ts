'use server'

import { auth } from '@/lib/auth'
import { getCacheTag } from '@/lib/cache/tags'
import { db } from '@/lib/db'
import {
	livretA,
	livretARateHistory,
	livretATransactions,
} from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath, updateTag } from 'next/cache'
import { headers } from 'next/headers'
import type { LivretARateInput, LivretATransactionInput } from './schema'

async function getCurrentUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user?.id) {
		throw new Error('Non authentifié')
	}

	return session.user.id
}

export async function addTransaction(data: LivretATransactionInput) {
	const userId = await getCurrentUser()

	const userLivret = await db.query.livretA.findFirst({
		where: eq(livretA.userId, userId),
	})

	if (!userLivret) {
		throw new Error('Livret A non trouvé')
	}

	const currentBalance = parseFloat(userLivret.balance)
	const transactionAmount = data.amount

	let newBalance = currentBalance
	if (data.type === 'deposit') {
		newBalance += transactionAmount
	} else if (data.type === 'withdrawal') {
		if (transactionAmount > currentBalance) {
			throw new Error('Solde insuffisant')
		}
		newBalance -= transactionAmount
	}

	await db.insert(livretATransactions).values({
		livretId: userLivret.id,
		amount: transactionAmount.toString(),
		type: data.type,
		date: data.date,
		description: data.description,
	})

	await db
		.update(livretA)
		.set({
			balance: newBalance.toString(),
			updatedAt: new Date(),
		})
		.where(eq(livretA.id, userLivret.id))

	updateTag(getCacheTag.livretA(userId))
	updateTag(getCacheTag.dashboard(userId))

	revalidatePath('/dashboard', 'page')
	revalidatePath('/dashboard/livret-a', 'page')

	return { success: true }
}

export async function updateRate(data: LivretARateInput) {
	const userId = await getCurrentUser()

	const userLivret = await db.query.livretA.findFirst({
		where: eq(livretA.userId, userId),
	})

	if (!userLivret) {
		throw new Error('Livret A non trouvé')
	}

	await db
		.update(livretA)
		.set({
			currentRate: data.rate.toString(),
			updatedAt: new Date(),
		})
		.where(eq(livretA.id, userLivret.id))

	await db.insert(livretARateHistory).values({
		rate: data.rate.toString(),
		effectiveDate: new Date().toISOString().split('T')[0],
	})

	updateTag(getCacheTag.livretA(userId))
	updateTag(getCacheTag.dashboard(userId))
	revalidatePath('/dashboard', 'page')
	revalidatePath('/dashboard/livret-a', 'page')

	return { success: true }
}
