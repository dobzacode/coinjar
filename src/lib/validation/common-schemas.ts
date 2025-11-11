import type { TranslationFn } from '@/types'
import { z } from 'zod'

/**
 * Common amount schema with number coercion
 * Accepts both string and number, coerces to positive number
 */
export function amountSchema(t: TranslationFn) {
	return z.union([z.string(), z.number()]).pipe(
		z.coerce
			.number<string>({
				message: t('amountMustBeNumber'),
			})
			.positive(t('amountPositive'))
	)
}

/**
 * Common positive number schema with coercion
 * Accepts both string and number, coerces to positive number
 */
export function positiveNumberSchema(t: TranslationFn, fieldName: string) {
	return z.union([z.string(), z.number()]).pipe(
		z.coerce
			.number<string>({
				message: t(`${fieldName}MustBeNumber`),
			})
			.positive(t(`${fieldName}Positive`))
	)
}

/**
 * Common date schema (required)
 */
export function dateSchema(t: TranslationFn) {
	return z.string().min(1, t('dateRequired'))
}

/**
 * Common percentage schema (0-100)
 */
export function percentageSchema(t: TranslationFn, max: number = 100) {
	return z.union([z.string(), z.number()]).pipe(
		z.coerce
			.number<string>({
				message: t('rateMustBeNumber'),
			})
			.min(0, t('rateNonNegative'))
			.max(max, t('rateMax', { max }))
	)
}
