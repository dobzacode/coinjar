import type { TranslationFn } from '@/types'
import {
	dateSchema,
	positiveNumberSchema,
} from '@/lib/validation/common-schemas'
import { z } from 'zod'

export function createPeaHoldingSchema(t: TranslationFn) {
	return z.object({
		isin: z.string().length(12, t('isinLength')),
		name: z.string().min(1, t('nameRequired')),
		shares: positiveNumberSchema(t, 'shares'),
		purchasePrice: positiveNumberSchema(t, 'purchasePrice'),
		purchaseDate: dateSchema(t),
	})
}

export function createPeaAccountSchema(t: TranslationFn) {
	return z.object({
		name: z.string().min(1, t('peaNameRequired')),
	})
}

export type PeaHoldingInput = z.infer<ReturnType<typeof createPeaHoldingSchema>>

export type PeaAccountInput = z.infer<ReturnType<typeof createPeaAccountSchema>>
