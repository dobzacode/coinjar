import { describe, expect, it } from 'vitest'
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils'

describe('Formatting Utilities', () => {
	describe('formatCurrency', () => {
		it('should format positive numbers correctly', () => {
			expect(formatCurrency(1000)).toBe('1\u202f000,00\u00a0€')
			expect(formatCurrency(1234.56)).toBe('1\u202f234,56\u00a0€')
		})

		it('should format negative numbers correctly', () => {
			expect(formatCurrency(-1000)).toBe('-1\u202f000,00\u00a0€')
		})

		it('should handle zero', () => {
			expect(formatCurrency(0)).toBe('0,00\u00a0€')
		})

		it('should handle decimal precision', () => {
			expect(formatCurrency(1.111)).toBe('1,11\u00a0€')
			expect(formatCurrency(1.999)).toBe('2,00\u00a0€')
		})
	})

	describe('formatPercentage', () => {
		it('should format positive percentages correctly', () => {
			expect(formatPercentage(25)).toBe('25,00\u00a0%')
			expect(formatPercentage(12.345)).toBe('12,35\u00a0%')
		})

		it('should format negative percentages correctly', () => {
			expect(formatPercentage(-15)).toBe('-15,00\u00a0%')
		})

		it('should handle zero', () => {
			expect(formatPercentage(0)).toBe('0,00\u00a0%')
		})
	})

	describe('formatDate', () => {
		const testDate = new Date('2024-01-15T12:00:00')

		it('should format date in short format', () => {
			const formatted = formatDate(testDate, 'short')
			expect(formatted).toMatch(/15\/01\/2024/)
		})

		it('should format date in long format', () => {
			const formatted = formatDate(testDate, 'long')
			expect(formatted).toBeTruthy()
		})

		it('should handle string dates', () => {
			const formatted = formatDate('2024-01-15', 'short')
			expect(formatted).toMatch(/15\/01\/2024/)
		})
	})
})

