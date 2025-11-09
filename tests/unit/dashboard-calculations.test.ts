import { calculatePortfolioMetrics } from '@/features/pea/calculations'
import { calculatePeeValue } from '@/features/pee/calculations'
import { describe, expect, it } from 'vitest'

describe('Dashboard Calculations', () => {
	describe('calculatePeeValue', () => {
		it('should calculate correct value for zero shares', () => {
			expect(calculatePeeValue(0, 100)).toBe(0)
		})

		it('should calculate correct value for positive shares', () => {
			expect(calculatePeeValue(10, 100)).toBe(1000)
			expect(calculatePeeValue(5.5, 200)).toBe(1100)
		})

		it('should handle decimal precision', () => {
			const result = calculatePeeValue(3.333, 15.5)
			expect(result).toBeCloseTo(51.66, 2)
		})
	})

	describe('calculatePortfolioMetrics', () => {
		it('should return zero metrics for empty holdings', () => {
			const metrics = calculatePortfolioMetrics([])
			expect(metrics.totalInvestment).toBe(0)
			expect(metrics.currentValue).toBe(0)
			expect(metrics.gain).toBe(0)
			expect(metrics.performance).toBe(0)
		})

		it('should calculate metrics for single holding', () => {
			const now = new Date()
			const holdings = [
				{
					id: '1',
					shares: '10',
					purchasePrice: '100',
					lastUpdatedPrice: '120',
					name: 'Test ETF',
					isin: 'TEST123',
					peaAccountId: 'pea1',
					purchaseDate: now.toISOString().split('T')[0],
					createdAt: now,
					updatedAt: now,
					lastUpdatedAt: now,
				},
			]

			const metrics = calculatePortfolioMetrics(holdings)
			expect(metrics.totalInvestment).toBe(1000)
			expect(metrics.currentValue).toBe(1200)
			expect(metrics.gain).toBe(200)
			expect(metrics.performance).toBe(20)
		})

		it('should calculate metrics for multiple holdings', () => {
			const now = new Date()
			const holdings = [
				{
					id: '1',
					shares: '10',
					purchasePrice: '100',
					lastUpdatedPrice: '120',
					name: 'ETF 1',
					isin: 'TEST123',
					peaAccountId: 'pea1',
					purchaseDate: now.toISOString().split('T')[0],
					createdAt: now,
					updatedAt: now,
					lastUpdatedAt: now,
				},
				{
					id: '2',
					shares: '5',
					purchasePrice: '200',
					lastUpdatedPrice: '180',
					name: 'ETF 2',
					isin: 'TEST456',
					peaAccountId: 'pea1',
					purchaseDate: now.toISOString().split('T')[0],
					createdAt: now,
					updatedAt: now,
					lastUpdatedAt: now,
				},
			]

			const metrics = calculatePortfolioMetrics(holdings)
			expect(metrics.totalInvestment).toBe(2000)
			expect(metrics.currentValue).toBe(2100)
			expect(metrics.gain).toBe(100)
			expect(metrics.performance).toBe(5)
		})

		it('should handle holdings with losses', () => {
			const now = new Date()
			const holdings = [
				{
					id: '1',
					shares: '10',
					purchasePrice: '100',
					lastUpdatedPrice: '80',
					name: 'Test ETF',
					isin: 'TEST123',
					peaAccountId: 'pea1',
					purchaseDate: now.toISOString().split('T')[0],
					createdAt: now,
					updatedAt: now,
					lastUpdatedAt: now,
				},
			]

			const metrics = calculatePortfolioMetrics(holdings)
			expect(metrics.totalInvestment).toBe(1000)
			expect(metrics.currentValue).toBe(800)
			expect(metrics.gain).toBe(-200)
			expect(metrics.performance).toBe(-20)
		})

		it('should handle holdings without updated price', () => {
			const now = new Date()
			const holdings = [
				{
					id: '1',
					shares: '10',
					purchasePrice: '100',
					lastUpdatedPrice: null,
					name: 'Test ETF',
					isin: 'TEST123',
					peaAccountId: 'pea1',
					purchaseDate: now.toISOString().split('T')[0],
					createdAt: now,
					updatedAt: now,
					lastUpdatedAt: null,
				},
			]

			const metrics = calculatePortfolioMetrics(holdings)
			expect(metrics.totalInvestment).toBe(1000)
			expect(metrics.currentValue).toBe(1000)
			expect(metrics.gain).toBe(0)
			expect(metrics.performance).toBe(0)
		})
	})
})
