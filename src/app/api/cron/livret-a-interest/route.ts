import { calculateAnnualInterest } from '@/features/livret-a/calculations'
import { db } from '@/lib/db'
import { livretA, livretATransactions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const authHeader = request.headers.get('authorization')
	const cronSecret = process.env.CRON_SECRET

	if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const currentYear = new Date().getFullYear()
		const previousYear = currentYear - 1

		const allLivrets = await db.query.livretA.findMany({
			with: {
				transactions: true,
			},
		})

		const results = []

		for (const livret of allLivrets) {
			const currentBalance = parseFloat(livret.balance)
			const annualRate = parseFloat(livret.currentRate)

			const interest = calculateAnnualInterest(
				livret.transactions,
				currentBalance,
				annualRate,
				previousYear
			)

			if (interest > 0) {
				await db.insert(livretATransactions).values({
					livretId: livret.id,
					amount: interest.toString(),
					type: 'interest',
					date: `${currentYear}-01-01`,
					description: `Intérêts ${previousYear}`,
				})

				const newBalance = currentBalance + interest

				await db
					.update(livretA)
					.set({
						balance: newBalance.toString(),
						lastInterestDate: `${currentYear}-01-01`,
						updatedAt: new Date(),
					})
					.where(eq(livretA.id, livret.id))

				results.push({
					livretId: livret.id,
					interest,
					newBalance,
				})
			}
		}

		return NextResponse.json({
			success: true,
			year: previousYear,
			processed: results.length,
			results,
		})
	} catch (error) {
		console.error('Error calculating Livret A interest:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}



