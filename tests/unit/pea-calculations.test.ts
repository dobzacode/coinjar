import { describe, it, expect } from 'vitest'
import { calculateHoldingValue, calculatePortfolioMetrics } from '@/features/pea/calculations'
import type { PeaHolding } from '@/lib/db/schema'

describe('PEA Calculations', () => {
	it('should calculate holding value', () => {
		const value = calculateHoldingValue(10, 100)
		expect(value).toBe(1000)
	})

	it('should calculate portfolio metrics with gains', () => {
		const holdings: Partial<PeaHolding>[] = [
			{
				id: '1',
				shares: '10',
				purchasePrice: '100.00',
				lastUpdatedPrice: '110.00',
			},
			{
				id: '2',
				shares: '5',
				purchasePrice: '200.00',
				lastUpdatedPrice: '220.00',
			},
		]

		const metrics = calculatePortfolioMetrics(holdings as PeaHolding[])
		expect(metrics.totalInvestment).toBe(2000)
		expect(metrics.currentValue).toBe(2200)
		expect(metrics.gain).toBe(200)
		expect(metrics.performance).toBe(10)
	})

	it('should calculate portfolio metrics with losses', () => {
		const holdings: Partial<PeaHolding>[] = [
			{
				id: '1',
				shares: '10',
				purchasePrice: '100.00',
				lastUpdatedPrice: '90.00',
			},
		]

		const metrics = calculatePortfolioMetrics(holdings as PeaHolding[])
		expect(metrics.totalInvestment).toBe(1000)
		expect(metrics.currentValue).toBe(900)
		expect(metrics.gain).toBe(-100)
		expect(metrics.performance).toBe(-10)
	})

	it('should handle holdings without updated prices', () => {
		const holdings: Partial<PeaHolding>[] = [
			{
				id: '1',
				shares: '10',
				purchasePrice: '100.00',
				lastUpdatedPrice: null,
			},
		]

		const metrics = calculatePortfolioMetrics(holdings as PeaHolding[])
		expect(metrics.totalInvestment).toBe(1000)
		expect(metrics.currentValue).toBe(1000)
		expect(metrics.gain).toBe(0)
		expect(metrics.performance).toBe(0)
	})
})




