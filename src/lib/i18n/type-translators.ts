import type { TranslationFn } from '@/types'

/**
 * Translate transaction type to localized string
 * @param type - Transaction type (deposit, withdrawal, interest)
 * @param t - Translation function
 * @returns Translated type string
 */
export function translateTransactionType(
	type: string,
	t: TranslationFn
): string {
	const typeMap: Record<string, string> = {
		deposit: t('deposit'),
		withdrawal: t('withdrawal'),
		interest: t('interest'),
	}
	return typeMap[type] || type
}

/**
 * Translate contribution type to localized string
 * @param type - Contribution type (personal, abondement, participation, interessement)
 * @param t - Translation function
 * @returns Translated type string
 */
export function translateContributionType(
	type: string,
	t: TranslationFn
): string {
	const typeMap: Record<string, string> = {
		personal: t('personal'),
		abondement: t('abondement'),
		participation: t('participation'),
		interessement: t('interessement'),
	}
	return typeMap[type] || type
}
