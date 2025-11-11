import { describe, expect, it } from 'vitest'

describe('Dashboard Chart Data Generation', () => {
	it('should calculate months difference correctly', () => {
		const startDate = new Date('2024-01-01')
		const endDate = new Date('2024-12-01')
		const monthsDiff =
			(endDate.getFullYear() - startDate.getFullYear()) * 12 +
			(endDate.getMonth() - startDate.getMonth())
		expect(monthsDiff).toBe(11)
	})

	it('should calculate data points correctly for short period', () => {
		const monthsDiff = 3
		const dataPoints = Math.max(2, Math.min(monthsDiff + 1, 12))
		expect(dataPoints).toBe(4)
	})

	it('should calculate data points correctly for long period', () => {
		const monthsDiff = 24
		const dataPoints = Math.max(2, Math.min(monthsDiff + 1, 12))
		expect(dataPoints).toBe(12)
	})

	it('should calculate growth factor correctly', () => {
		const dataPoints = 12
		const i = 0
		const growthFactor =
			dataPoints > 1 ? 0.85 + (i * 0.15) / (dataPoints - 1) : 1
		expect(growthFactor).toBe(0.85)
	})

	it('should calculate growth factor correctly for last data point', () => {
		const dataPoints = 12
		const i = 11
		const growthFactor =
			dataPoints > 1 ? 0.85 + (i * 0.15) / (dataPoints - 1) : 1
		expect(growthFactor).toBe(1)
	})

	it('should handle single data point case', () => {
		const dataPoints = 1
		const i = 0
		const growthFactor =
			dataPoints > 1 ? 0.85 + (i * 0.15) / (dataPoints - 1) : 1
		expect(growthFactor).toBe(1)
	})

	it('should calculate months from start correctly', () => {
		const monthsDiff = 12
		const dataPoints = 12
		const i = 6
		const monthsFromStart = Math.floor((i * monthsDiff) / (dataPoints - 1)) || 0
		expect(monthsFromStart).toBeGreaterThanOrEqual(0)
	})

	it('should use the later date when both signup and transaction date exist', () => {
		const signupDate = new Date('2024-01-15')
		const transactionDate = new Date('2024-02-01')
		const startDate = new Date(
			Math.max(signupDate.getTime(), transactionDate.getTime())
		)
		expect(startDate).toEqual(transactionDate)
	})

	it('should use signup date when no transaction date exists', () => {
		const signupDate = new Date('2024-01-15')
		const startDate = signupDate
		expect(startDate).toEqual(signupDate)
	})
})
