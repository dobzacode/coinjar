import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatCurrency(
	amount: number | string,
	currency: string = 'EUR'
): string {
	const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency,
	}).format(numAmount)
}

export function formatPercentage(value: number, decimals: number = 2): string {
	return new Intl.NumberFormat('fr-FR', {
		style: 'percent',
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value / 100)
}

export function formatDate(
	date: Date | string,
	format: string = 'long'
): string {
	const d = typeof date === 'string' ? new Date(date) : date
	if (format === 'short') {
		return d.toLocaleDateString('fr-FR')
	}
	return d.toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}
