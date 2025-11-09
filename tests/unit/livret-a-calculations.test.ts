import { describe, it, expect } from 'vitest'
import { calculateCurrentBalance } from '@/features/livret-a/calculations'
import type { LivretATransaction } from '@/lib/db/schema'

describe('Livret A Calculations', () => {
	it('should calculate current balance with deposits', () => {
		const transactions: Partial<LivretATransaction>[] = [
			{
				id: '1',
				amount: '100.00',
				type: 'deposit',
				date: '2024-01-01',
			},
			{
				id: '2',
				amount: '50.00',
				type: 'deposit',
				date: '2024-02-01',
			},
		]

		const balance = calculateCurrentBalance(0, transactions as LivretATransaction[])
		expect(balance).toBe(150)
	})

	it('should calculate current balance with deposits and withdrawals', () => {
		const transactions: Partial<LivretATransaction>[] = [
			{
				id: '1',
				amount: '200.00',
				type: 'deposit',
				date: '2024-01-01',
			},
			{
				id: '2',
				amount: '50.00',
				type: 'withdrawal',
				date: '2024-02-01',
			},
		]

		const balance = calculateCurrentBalance(0, transactions as LivretATransaction[])
		expect(balance).toBe(150)
	})

	it('should handle interest transactions', () => {
		const transactions: Partial<LivretATransaction>[] = [
			{
				id: '1',
				amount: '1000.00',
				type: 'deposit',
				date: '2024-01-01',
			},
			{
				id: '2',
				amount: '30.00',
				type: 'interest',
				date: '2024-12-31',
			},
		]

		const balance = calculateCurrentBalance(0, transactions as LivretATransaction[])
		expect(balance).toBe(1030)
	})
})




