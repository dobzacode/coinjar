import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { peaHoldings, etfPricesCache } from '@/lib/db/schema'
import { fetchMultipleEtfPrices } from '@/features/pea/etf-service'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
	const authHeader = request.headers.get('authorization')
	const cronSecret = process.env.CRON_SECRET

	if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const allHoldings = await db.query.peaHoldings.findMany()

		if (allHoldings.length === 0) {
			return NextResponse.json({
				success: true,
				message: 'No holdings to update',
				updated: 0,
			})
		}

		const uniqueIsins = [...new Set(allHoldings.map((h) => h.isin))]

		const prices = await fetchMultipleEtfPrices(uniqueIsins)

		let updated = 0
		let failed = 0

		for (const isin of uniqueIsins) {
			const priceData = prices[isin]

			if (priceData) {
				const holdingsToUpdate = allHoldings.filter((h) => h.isin === isin)

				for (const holding of holdingsToUpdate) {
					await db
						.update(peaHoldings)
						.set({
							lastUpdatedPrice: priceData.price.toString(),
							lastUpdatedAt: new Date(),
							updatedAt: new Date(),
						})
						.where(eq(peaHoldings.id, holding.id))
				}

				await db
					.insert(etfPricesCache)
					.values({
						isin,
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

		return NextResponse.json({
			success: true,
			totalIsins: uniqueIsins.length,
			updated,
			failed,
		})
	} catch (error) {
		console.error('Error updating ETF prices:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}




