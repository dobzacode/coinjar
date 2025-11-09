import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercentage } from '@/lib/utils'

describe('Utils', () => {
	describe('formatCurrency', () => {
		it('should format currency correctly', () => {
			expect(formatCurrency(1000)).toContain('1')
			expect(formatCurrency(1000)).toContain('000')
		})

		it('should handle decimal values', () => {
			expect(formatCurrency(1234.56)).toContain('1')
			expect(formatCurrency(1234.56)).toContain('234')
		})

		it('should handle string input', () => {
			expect(formatCurrency('1000')).toContain('1')
			expect(formatCurrency('1000')).toContain('000')
		})
	})

	describe('formatPercentage', () => {
		it('should format percentage correctly', () => {
			expect(formatPercentage(10.5)).toBe('10,50\u00a0%')
		})

		it('should handle negative values', () => {
			expect(formatPercentage(-5.25)).toBe('-5,25\u00a0%')
		})

		it('should respect decimal places', () => {
			expect(formatPercentage(10.123, 0)).toBe('10\u00a0%')
			expect(formatPercentage(10.123, 3)).toBe('10,123\u00a0%')
		})
	})
})



