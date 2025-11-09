import type { TranslationFn } from '@/types'
import { z } from 'zod'

export function createLivretATransactionSchema(t: TranslationFn) {
	return z.object({
		amount: z.union([z.string(), z.number()]).pipe(
			z.coerce
				.number<string>({
					message: t('amountMustBeNumber'),
				})
				.positive(t('amountPositive'))
		),
		type: z.enum(['deposit', 'withdrawal']),
		date: z.string().min(1, t('dateRequired')),
		description: z.string().optional(),
	})
}

export function createLivretARateSchema(t: TranslationFn) {
	return z.object({
		rate: z.union([z.string(), z.number()]).pipe(
			z.coerce
				.number<string>({
					message: t('rateMustBeNumber'),
				})
				.min(0, t('rateNonNegative'))
				.max(100, t('rateMax', { max: 100 }))
		),
	})
}

export type LivretATransactionInput = z.infer<
	ReturnType<typeof createLivretATransactionSchema>
>

export type LivretARateInput = z.infer<
	ReturnType<typeof createLivretARateSchema>
>
