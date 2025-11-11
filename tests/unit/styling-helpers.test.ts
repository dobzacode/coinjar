import { getAmountColor, getAmountPrefix } from '@/lib/utils/styling'
import { describe, it, expect } from 'vitest'

describe('Styling Helpers', () => {
	describe('getAmountColor', () => {
		it('should return destructive color for withdrawal', () => {
			expect(getAmountColor('withdrawal')).toBe('text-destructive')
		})

		it('should return green color for deposit', () => {
			expect(getAmountColor('deposit')).toBe('text-green-600')
		})

		it('should return green color for interest', () => {
			expect(getAmountColor('interest')).toBe('text-green-600')
		})

		it('should return green color for contribution', () => {
			expect(getAmountColor('contribution')).toBe('text-green-600')
		})
	})

	describe('getAmountPrefix', () => {
		it('should return minus prefix for withdrawal', () => {
			expect(getAmountPrefix('withdrawal')).toBe('-')
		})

		it('should return plus prefix for deposit', () => {
			expect(getAmountPrefix('deposit')).toBe('+')
		})

		it('should return plus prefix for interest', () => {
			expect(getAmountPrefix('interest')).toBe('+')
		})

		it('should return plus prefix for contribution', () => {
			expect(getAmountPrefix('contribution')).toBe('+')
		})
	})
})
