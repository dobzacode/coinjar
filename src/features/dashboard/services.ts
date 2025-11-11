import {
	calculatePeeValue,
	calculatePortfolioMetrics,
} from '@/lib/calculations'
import {
	getEarliestTransactionDate,
	getUserLivret,
	getUserPea,
	getUserPee,
	getUserSignupDate,
} from './queries'

export interface DashboardData {
	// Account data
	livretA: {
		balance: number
		rate: string | null
	}
	pea: {
		totalInvestment: number
		currentValue: number
		gain: number
		performance: number
	}
	pee: {
		value: number
		shares: string | null
	}
	// Aggregated data
	totalBalance: number
	totalGain: number
	// Chart data
	signupDate: Date | null
	earliestTransaction: Date | null
}

/**
 * Fetch all dashboard data in one call
 * Eliminates duplicate fetching across dashboard sections
 * @param userId - User ID
 * @returns Complete dashboard data
 */
export async function getDashboardData(userId: string): Promise<DashboardData> {
	// Fetch all data in parallel
	const [userLivret, userPee, userPea, signupDate, earliestTransaction] =
		await Promise.all([
			getUserLivret(userId),
			getUserPee(userId),
			getUserPea(userId),
			getUserSignupDate(userId),
			getEarliestTransactionDate(userId),
		])

	// Calculate account values
	const livretABalance = userLivret ? parseFloat(userLivret.balance) : 0
	const livretARate = userLivret?.currentRate ?? null

	const peeValue = userPee
		? calculatePeeValue(
				parseFloat(userPee.totalShares),
				parseFloat(userPee.sharePrice)
			)
		: 0
	const peeShares = userPee?.totalShares ?? null

	const peaMetrics = userPea
		? calculatePortfolioMetrics(userPea.holdings)
		: { totalInvestment: 0, currentValue: 0, gain: 0, performance: 0 }

	const totalBalance = livretABalance + peeValue + peaMetrics.currentValue

	return {
		livretA: {
			balance: livretABalance,
			rate: livretARate,
		},
		pea: peaMetrics,
		pee: {
			value: peeValue,
			shares: peeShares,
		},
		totalBalance,
		totalGain: peaMetrics.gain,
		signupDate,
		earliestTransaction,
	}
}
