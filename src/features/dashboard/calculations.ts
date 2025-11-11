import type { WealthDataPoint } from '@/types'

export interface AccountBalances {
	livretA: number
	pee: number
	pea: number
}

/**
 * Calculate chart date range based on user signup and earliest transaction
 * @param signupDate - User signup date
 * @param earliestTransaction - Earliest transaction date
 * @returns Start date and number of data points
 */
export function calculateChartDateRange(
	signupDate: Date | null,
	earliestTransaction: Date | null
): { startDate: Date; dataPoints: number } {
	// Determine start date (max of signup and earliest transaction)
	const startDate =
		earliestTransaction && signupDate
			? new Date(
					Math.max(
						new Date(earliestTransaction).getTime(),
						new Date(signupDate).getTime()
					)
				)
			: signupDate
				? new Date(signupDate)
				: earliestTransaction
					? new Date(earliestTransaction)
					: new Date()

	// Calculate months difference from start to now
	const now = new Date()
	const monthsDiff =
		(now.getFullYear() - startDate.getFullYear()) * 12 +
		(now.getMonth() - startDate.getMonth())

	// Determine number of data points (min 2, max 12)
	const dataPoints = Math.max(2, Math.min(monthsDiff + 1, 12))

	return { startDate, dataPoints }
}

/**
 * Generate wealth data points for chart visualization
 * @param startDate - Chart start date
 * @param dataPoints - Number of data points to generate
 * @param balances - Current account balances
 * @returns Array of chart data points
 */
export function generateWealthDataPoints(
	startDate: Date,
	dataPoints: number,
	balances: AccountBalances
): WealthDataPoint[] {
	const { livretA, pee, pea } = balances
	const totalBalance = livretA + pee + pea

	const now = new Date()
	const monthsDiff =
		(now.getFullYear() - startDate.getFullYear()) * 12 +
		(now.getMonth() - startDate.getMonth())

	return Array.from({ length: dataPoints }, (_, i) => {
		// Calculate growth factor (from 85% to 100%)
		const growthFactor =
			dataPoints > 1 ? 0.85 + (i * 0.15) / (dataPoints - 1) : 1

		// Calculate date for this data point
		const monthsFromStart = Math.floor((i * monthsDiff) / (dataPoints - 1)) || 0
		const date = new Date(startDate)
		date.setMonth(date.getMonth() + monthsFromStart)

		return {
			date: date.toISOString().split('T')[0],
			total: totalBalance * growthFactor,
			livretA: livretA * growthFactor,
			pee: pee * growthFactor,
			pea: pea * growthFactor,
		}
	})
}

/**
 * Calculate total return percentage
 * @param totalBalance - Total portfolio balance
 * @param peaGain - PEA capital gain
 * @param livretABalance - Livret A balance
 * @param livretAYield - Livret A annual yield percentage
 * @returns Total return percentage
 */
export function calculateTotalReturn(
	totalBalance: number,
	peaGain: number,
	livretABalance: number,
	livretAYield: number
): number {
	if (totalBalance === 0) return 0

	const livretAInterest = livretABalance * (livretAYield / 100)
	return ((peaGain + livretAInterest) / totalBalance) * 100
}
