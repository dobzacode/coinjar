import {
	translateTransactionType,
	translateContributionType,
} from '@/lib/i18n/type-translators'
import { describe, it, expect } from 'vitest'
import { mockTranslations } from '../utils/test-helpers'

describe('Type Translators', () => {
	const t = mockTranslations()

	describe('translateTransactionType', () => {
		it('should translate deposit type', () => {
			const result = translateTransactionType('deposit', t)
			expect(result).toBe('deposit')
		})

		it('should translate withdrawal type', () => {
			const result = translateTransactionType('withdrawal', t)
			expect(result).toBe('withdrawal')
		})

		it('should translate interest type', () => {
			const result = translateTransactionType('interest', t)
			expect(result).toBe('interest')
		})

		it('should return original value for unknown type', () => {
			const result = translateTransactionType('unknown', t)
			expect(result).toBe('unknown')
		})
	})

	describe('translateContributionType', () => {
		it('should translate personal type', () => {
			const result = translateContributionType('personal', t)
			expect(result).toBe('personal')
		})

		it('should translate abondement type', () => {
			const result = translateContributionType('abondement', t)
			expect(result).toBe('abondement')
		})

		it('should translate participation type', () => {
			const result = translateContributionType('participation', t)
			expect(result).toBe('participation')
		})

		it('should translate interessement type', () => {
			const result = translateContributionType('interessement', t)
			expect(result).toBe('interessement')
		})

		it('should return original value for unknown type', () => {
			const result = translateContributionType('unknown', t)
			expect(result).toBe('unknown')
		})
	})
})
