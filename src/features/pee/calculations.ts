import type { PeeContribution } from '@/lib/db/schema'

export function calculatePeeValue(
	totalShares: number,
	sharePrice: number
): number {
	return Math.round(totalShares * sharePrice * 100) / 100
}

export function calculateContributionsByType(contributions: PeeContribution[]) {
	const byType = {
		abondement: 0,
		participation: 0,
		interessement: 0,
		personal: 0,
	}

	contributions.forEach((contrib) => {
		byType[contrib.type] += parseFloat(contrib.amount)
	})

	return byType
}

export function calculateTotalShares(contributions: PeeContribution[]): number {
	return contributions.reduce((total, contrib) => {
		return total + parseFloat(contrib.shares)
	}, 0)
}



