import {
	amountSchema,
	dateSchema,
	positiveNumberSchema,
} from '@/lib/validation/common-schemas'
import type { TranslationFn } from '@/types'
import { z } from 'zod'

export function createPeeContributionSchema(t: TranslationFn) {
	return z.object({
		type: z.enum(['abondement', 'participation', 'interessement', 'personal']),
		amount: amountSchema(t),
		shares: positiveNumberSchema(t, 'shares'),
		date: dateSchema(t),
	})
}

export function createPeeAccountSchema(t: TranslationFn) {
	return z.object({
		companyName: z.string().min(1, t('companyNameRequired')),
		sharePrice: positiveNumberSchema(t, 'sharePrice'),
	})
}

export type PeeContributionInput = z.infer<
	ReturnType<typeof createPeeContributionSchema>
>

export type PeeAccountInput = z.infer<ReturnType<typeof createPeeAccountSchema>>
