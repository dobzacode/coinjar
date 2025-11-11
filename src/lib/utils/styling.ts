/**
 * Get color class for transaction amount based on type
 * @param type - Transaction/contribution type
 * @returns Tailwind CSS color class
 */
export function getAmountColor(
	type: 'deposit' | 'withdrawal' | 'interest' | 'contribution'
): string {
	if (type === 'withdrawal') {
		return 'text-destructive'
	}
	return 'text-green-600'
}

/**
 * Get prefix symbol for transaction amount based on type
 * @param type - Transaction/contribution type
 * @returns Prefix symbol (+ or -)
 */
export function getAmountPrefix(
	type: 'deposit' | 'withdrawal' | 'interest' | 'contribution'
): string {
	if (type === 'withdrawal') {
		return '-'
	}
	return '+'
}
