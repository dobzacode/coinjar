'use server'

import { requireAuth } from '@/lib/auth/helpers'
import { invalidateFeatureCache } from '@/lib/cache/helpers'
import { db } from '@/lib/db'
import { etfPricesCache, peaAccounts, peaHoldings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { fetchEtfPrice } from './etf-service'
import type { PeaHoldingInput } from './schema'

export async function addHolding(data: PeaHoldingInput) {
	const userId = await requireAuth()

	const userPea = await db.query.peaAccounts.findFirst({
		where: eq(peaAccounts.userId, userId),
	})

	if (!userPea) {
		throw new Error('Compte PEA non trouvé')
	}

	const priceData = await fetchEtfPrice(data.isin)

	await db.insert(peaHoldings).values({
		peaAccountId: userPea.id,
		isin: data.isin,
		name: data.name,
		shares: data.shares.toString(),
		purchasePrice: data.purchasePrice.toString(),
		purchaseDate: data.purchaseDate,
		lastUpdatedPrice: priceData?.price.toString() || null,
		lastUpdatedAt: priceData ? new Date() : null,
	})

	if (priceData) {
		await db
			.insert(etfPricesCache)
			.values({
				isin: data.isin,
				price: priceData.price.toString(),
				currency: priceData.currency,
				fetchedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: etfPricesCache.isin,
				set: {
					price: priceData.price.toString(),
					currency: priceData.currency,
					fetchedAt: new Date(),
				},
			})
	}

	const investment = data.shares * data.purchasePrice
	const currentTotalInvestment = parseFloat(userPea.totalInvestment)
	const newTotalInvestment = currentTotalInvestment + investment

	await db
		.update(peaAccounts)
		.set({
			totalInvestment: newTotalInvestment.toString(),
			updatedAt: new Date(),
		})
		.where(eq(peaAccounts.id, userPea.id))

	await invalidateFeatureCache(userId, 'pea')

	return { success: true }
}

export async function refreshPrices() {
	const userId = await requireAuth()

	const userPea = await db.query.peaAccounts.findFirst({
		where: eq(peaAccounts.userId, userId),
		with: {
			holdings: true,
		},
	})

	if (!userPea || userPea.holdings.length === 0) {
		return { success: false, message: 'Aucune position à mettre à jour' }
	}

	const uniqueIsins = [...new Set(userPea.holdings.map((h) => h.isin))]
	const { fetchMultipleEtfPrices } = await import('./etf-service')
	const pricesMap = await fetchMultipleEtfPrices(uniqueIsins)

	let updated = 0
	let failed = 0

	for (const holding of userPea.holdings) {
		const priceData = pricesMap[holding.isin]

		if (priceData) {
			await db
				.update(peaHoldings)
				.set({
					lastUpdatedPrice: priceData.price.toString(),
					lastUpdatedAt: new Date(),
				})
				.where(eq(peaHoldings.id, holding.id))

			await db
				.insert(etfPricesCache)
				.values({
					isin: holding.isin,
					price: priceData.price.toString(),
					currency: priceData.currency,
					fetchedAt: new Date(),
				})
				.onConflictDoUpdate({
					target: etfPricesCache.isin,
					set: {
						price: priceData.price.toString(),
						currency: priceData.currency,
						fetchedAt: new Date(),
					},
				})

			updated++
		} else {
			failed++
		}
	}

	await invalidateFeatureCache(userId, 'pea')

	return {
		success: true,
		message: `${updated} prix mis à jour, ${failed} échec(s)`,
	}
}
