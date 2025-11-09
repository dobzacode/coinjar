import type { TranslationFn } from '@/types'
import { z } from 'zod'

export function createPeeContributionSchema(t: TranslationFn) {
	return z.object({
		type: z.enum(['abondement', 'participation', 'interessement', 'personal']),
		amount: z.union([z.string(), z.number()]).pipe(
			z.coerce
				.number<string>({
					message: t('amountMustBeNumber'),
				})
				.positive(t('amountPositive'))
		),
		shares: z.union([z.string(), z.number()]).pipe(
			z.coerce
				.number<string>({
					message: t('sharesMustBeNumber'),
				})
				.positive(t('sharesPositive'))
		),
		date: z.string().min(1, t('dateRequired')),
	})
}

export function createPeeAccountSchema(t: TranslationFn) {
	return z.object({
		companyName: z.string().min(1, t('companyNameRequired')),
		sharePrice: z.union([z.string(), z.number()]).pipe(
			z.coerce
				.number<string>({
					message: t('sharePriceMustBeNumber'),
				})
				.positive(t('sharePricePositive'))
		),
	})
}

export type PeeContributionInput = z.infer<
	ReturnType<typeof createPeeContributionSchema>
>

export type PeeAccountInput = z.infer<ReturnType<typeof createPeeAccountSchema>>
