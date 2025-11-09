import type { PeaHolding } from '@/lib/db/schema'

export function calculateHoldingValue(
	shares: number,
	currentPrice: number
): number {
	return Math.round(shares * currentPrice * 100) / 100
}

export function calculatePortfolioMetrics(holdings: PeaHolding[]) {
	let totalInvestment = 0
	let currentValue = 0

	holdings.forEach((holding) => {
		const shares = parseFloat(holding.shares)
		const purchasePrice = parseFloat(holding.purchasePrice)
		const currentPrice = holding.lastUpdatedPrice
			? parseFloat(holding.lastUpdatedPrice)
			: purchasePrice

		totalInvestment += shares * purchasePrice
		currentValue += shares * currentPrice
	})

	const gain = currentValue - totalInvestment
	const performance =
		totalInvestment > 0 ? (gain / totalInvestment) * 100 : 0

	return {
		totalInvestment: Math.round(totalInvestment * 100) / 100,
		currentValue: Math.round(currentValue * 100) / 100,
		gain: Math.round(gain * 100) / 100,
		performance: Math.round(performance * 100) / 100,
	}
}

export function calculateHoldingPerformance(holding: PeaHolding): {
	gain: number
	performance: number
	currentValue: number
} {
	const shares = parseFloat(holding.shares)
	const purchasePrice = parseFloat(holding.purchasePrice)
	const currentPrice = holding.lastUpdatedPrice
		? parseFloat(holding.lastUpdatedPrice)
		: purchasePrice

	const investment = shares * purchasePrice
	const currentValue = shares * currentPrice
	const gain = currentValue - investment
	const performance = investment > 0 ? (gain / investment) * 100 : 0

	return {
		currentValue: Math.round(currentValue * 100) / 100,
		gain: Math.round(gain * 100) / 100,
		performance: Math.round(performance * 100) / 100,
	}
}




