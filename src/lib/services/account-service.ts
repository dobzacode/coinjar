import { db } from '@/lib/db'
import { livretA, peaAccounts, peeAccounts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Get or create Livret A account for user
 * @param userId - User ID
 * @returns Livret A account with transactions
 */
export async function getOrCreateLivretA(userId: string) {
	let userLivret = await db.query.livretA.findFirst({
		where: eq(livretA.userId, userId),
		with: {
			transactions: {
				orderBy: (transactions, { desc }) => [desc(transactions.date)],
				limit: 10,
			},
		},
	})

	if (!userLivret) {
		const [newLivret] = await db
			.insert(livretA)
			.values({
				userId,
				balance: '0.00',
				currentRate: '3.000',
			})
			.returning()

		userLivret = { ...newLivret, transactions: [] }
	}

	return userLivret
}

/**
 * Get or create PEA account for user
 * @param userId - User ID
 * @returns PEA account with holdings
 */
export async function getOrCreatePea(userId: string) {
	let userPea = await db.query.peaAccounts.findFirst({
		where: eq(peaAccounts.userId, userId),
		with: {
			holdings: {
				orderBy: (holdings, { desc }) => [desc(holdings.purchaseDate)],
			},
		},
	})

	if (!userPea) {
		const [newPea] = await db
			.insert(peaAccounts)
			.values({
				userId,
				name: 'Mon PEA',
				totalInvestment: '0.00',
			})
			.returning()

		userPea = { ...newPea, holdings: [] }
	}

	return userPea
}

/**
 * Get or create PEE account for user
 * @param userId - User ID
 * @returns PEE account with contributions
 */
export async function getOrCreatePee(userId: string) {
	let userPee = await db.query.peeAccounts.findFirst({
		where: eq(peeAccounts.userId, userId),
		with: {
			contributions: {
				orderBy: (contributions, { desc }) => [desc(contributions.date)],
			},
		},
	})

	if (!userPee) {
		const [newPee] = await db
			.insert(peeAccounts)
			.values({
				userId,
				companyName: 'Mon entreprise',
				sharePrice: '0.00',
				totalShares: '0.00',
			})
			.returning()

		userPee = { ...newPee, contributions: [] }
	}

	return userPee
}
