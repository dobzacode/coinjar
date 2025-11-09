import { z } from 'zod'

export function createLoginSchema(t: (key: string) => string) {
	return z.object({
		email: z.email(t('emailInvalid')),
		password: z.string().min(8, t('passwordMinLength')),
	})
}

export function createSignupSchema(t: (key: string) => string) {
	return z.object({
		name: z.string().min(1, t('nameRequired')),
		email: z.email(t('emailInvalid')),
		password: z.string().min(8, t('passwordMinLength')),
	})
}

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>
export type SignupInput = z.infer<ReturnType<typeof createSignupSchema>>
