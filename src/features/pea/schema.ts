import type { TranslationFn } from '@/types'
import { z } from 'zod'

export function createPeaHoldingSchema(t: TranslationFn) {
	return z.object({
		isin: z.string().length(12, t('isinLength')),
		name: z.string().min(1, t('nameRequired')),
		shares: z.union([z.string(), z.number()]).pipe(
			z.coerce
				.number<string>({
					message: t('sharesMustBeNumber'),
				})
				.positive(t('sharesPositive'))
		),
		purchasePrice: z.union([z.string(), z.number()]).pipe(
			z.coerce
				.number<string>({
					message: t('purchasePriceMustBeNumber'),
				})
				.positive(t('purchasePricePositive'))
		),
		purchaseDate: z.string().min(1, t('purchaseDateRequired')),
	})
}

export function createPeaAccountSchema(t: TranslationFn) {
	return z.object({
		name: z.string().min(1, t('peaNameRequired')),
	})
}

export type PeaHoldingInput = z.infer<ReturnType<typeof createPeaHoldingSchema>>

export type PeaAccountInput = z.infer<ReturnType<typeof createPeaAccountSchema>>
