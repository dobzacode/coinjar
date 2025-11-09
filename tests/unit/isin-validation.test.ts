import { describe, it, expect } from 'vitest'

function validateIsinFormat(isin: string): boolean {
	return /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin)
}

describe('ISIN Validation', () => {
	it('should validate correct ISIN format', () => {
		expect(validateIsinFormat('FR0010315770')).toBe(true)
		expect(validateIsinFormat('US0378331005')).toBe(true)
		expect(validateIsinFormat('LU0533033667')).toBe(true)
	})

	it('should reject invalid ISIN formats', () => {
		expect(validateIsinFormat('FR001031577')).toBe(false)
		expect(validateIsinFormat('fr0010315770')).toBe(false)
		expect(validateIsinFormat('FR00103157700')).toBe(false)
		expect(validateIsinFormat('1234567890AB')).toBe(false)
	})

	it('should reject ISIN with special characters', () => {
		expect(validateIsinFormat('FR00103157-0')).toBe(false)
		expect(validateIsinFormat('FR 0010315770')).toBe(false)
		expect(validateIsinFormat('FR0010315770;')).toBe(false)
	})

	it('should validate length requirement', () => {
		expect(validateIsinFormat('FR001031577')).toBe(false)
		expect(validateIsinFormat('FR00103157701')).toBe(false)
	})

	it('should validate country code format', () => {
		expect(validateIsinFormat('F10010315770')).toBe(false)
		expect(validateIsinFormat('1R0010315770')).toBe(false)
	})

	it('should validate check digit is numeric', () => {
		expect(validateIsinFormat('FR001031577A')).toBe(false)
	})
})

