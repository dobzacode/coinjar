import { describe, it, expect } from 'vitest'
import { calculatePeeValue, calculateContributionsByType } from '@/features/pee/calculations'
import type { PeeContribution } from '@/lib/db/schema'

describe('PEE Calculations', () => {
	it('should calculate PEE value correctly', () => {
		const value = calculatePeeValue(100, 25.5)
		expect(value).toBe(2550)
	})

	it('should calculate PEE value with decimals', () => {
		const value = calculatePeeValue(123.456, 10.25)
		expect(value).toBe(1265.42)
	})

	it('should calculate contributions by type', () => {
		const contributions: Partial<PeeContribution>[] = [
			{
				id: '1',
				type: 'personal',
				amount: '100.00',
				shares: '10',
				date: '2024-01-01',
			},
			{
				id: '2',
				type: 'abondement',
				amount: '50.00',
				shares: '5',
				date: '2024-02-01',
			},
			{
				id: '3',
				type: 'personal',
				amount: '100.00',
				shares: '10',
				date: '2024-03-01',
			},
		]

		const byType = calculateContributionsByType(contributions as PeeContribution[])
		expect(byType.personal).toBe(200)
		expect(byType.abondement).toBe(50)
		expect(byType.participation).toBe(0)
		expect(byType.interessement).toBe(0)
	})
})




