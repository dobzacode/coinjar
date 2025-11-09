import { startOfYear, endOfYear } from 'date-fns'
import type { LivretATransaction } from '@/lib/db/schema'

interface FortnightPeriod {
	start: Date
	end: Date
	fortnight: number
}

function getFortnight(date: Date): number {
	const day = date.getDate()
	return day <= 15 ? 1 : 2
}

function getFortnightStart(year: number, month: number, fortnight: number): Date {
	return new Date(year, month, fortnight === 1 ? 1 : 16)
}

function getFortnightEnd(year: number, month: number, fortnight: number): Date {
	if (fortnight === 1) {
		return new Date(year, month, 15)
	}
	return new Date(year, month + 1, 0)
}

function getYearFortnights(year: number): FortnightPeriod[] {
	const periods: FortnightPeriod[] = []
	let fortnightCounter = 0
	
	for (let month = 0; month < 12; month++) {
		for (let fortnight = 1; fortnight <= 2; fortnight++) {
			periods.push({
				start: getFortnightStart(year, month, fortnight),
				end: getFortnightEnd(year, month, fortnight),
				fortnight: fortnightCounter++,
			})
		}
	}
	
	return periods
}

export function calculateAnnualInterest(
	transactions: LivretATransaction[],
	currentBalance: number,
	annualRate: number,
	year: number
): number {
	const fortnightRate = annualRate / 24 / 100
	const fortnights = getYearFortnights(year)
	
	const yearStart = startOfYear(new Date(year, 0, 1))
	const yearEnd = endOfYear(new Date(year, 11, 31))
	
	const yearTransactions = transactions.filter((t) => {
		const transDate = new Date(t.date)
		return transDate >= yearStart && transDate <= yearEnd && t.type !== 'interest'
	})
	
	let balance = currentBalance
	yearTransactions.forEach((t) => {
		if (t.type === 'deposit') {
			balance -= parseFloat(t.amount)
		} else if (t.type === 'withdrawal') {
			balance += parseFloat(t.amount)
		}
	})
	
	let totalInterest = 0
	
	for (const period of fortnights) {
		const fortnightTransactions = yearTransactions.filter((t) => {
			const transDate = new Date(t.date)
			return transDate >= period.start && transDate <= period.end
		})
		
		for (const trans of fortnightTransactions) {
			const transDate = new Date(trans.date)
			const transFortnight = getFortnight(transDate)
			
			if (trans.type === 'deposit') {
				if (transFortnight === 1) {
					if (transDate.getDate() >= 1 && transDate.getDate() <= 15) {
						balance += parseFloat(trans.amount)
					}
				} else {
					balance += parseFloat(trans.amount)
				}
			} else if (trans.type === 'withdrawal') {
				balance -= parseFloat(trans.amount)
			}
		}
		
		const interest = balance * fortnightRate
		totalInterest += interest
	}
	
	return Math.round(totalInterest * 100) / 100
}

export function calculateCurrentBalance(
	initialBalance: number,
	transactions: LivretATransaction[]
): number {
	let balance = initialBalance
	
	for (const transaction of transactions) {
		if (transaction.type === 'deposit' || transaction.type === 'interest') {
			balance += parseFloat(transaction.amount)
		} else if (transaction.type === 'withdrawal') {
			balance -= parseFloat(transaction.amount)
		}
	}
	
	return Math.round(balance * 100) / 100
}

