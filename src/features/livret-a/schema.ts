import {
	amountSchema,
	dateSchema,
	percentageSchema,
} from '@/lib/validation/common-schemas'
import type { TranslationFn } from '@/types'
import { z } from 'zod'

export function createLivretATransactionSchema(t: TranslationFn) {
	return z.object({
		amount: amountSchema(t),
		type: z.enum(['deposit', 'withdrawal']),
		date: dateSchema(t),
		description: z.string().optional(),
	})
}

export function createLivretARateSchema(t: TranslationFn) {
	return z.object({
		rate: percentageSchema(t),
	})
}

export type LivretATransactionInput = z.infer<
	ReturnType<typeof createLivretATransactionSchema>
>

export type LivretARateInput = z.infer<
	ReturnType<typeof createLivretARateSchema>
>
