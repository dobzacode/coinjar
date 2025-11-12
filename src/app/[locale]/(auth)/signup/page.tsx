import { LanguagePicker } from '@/components/language-picker'
import { SignupForm } from '@/features/auth/components/signup-form'
import { redirectIfAuthenticated } from '@/lib/auth/page-helpers'
import { cacheLife } from 'next/cache'
import { Suspense } from 'react'

type SignupPageProps = {
	params: Promise<{
		locale: string
	}>
}

async function SignupContent({ locale }: { locale: string }) {
	'use cache: private'
	cacheLife('days')

	await redirectIfAuthenticated(locale)
	return <SignupForm />
}

export default async function SignupPage(props: SignupPageProps) {
	const params = await props.params

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
			<div className="absolute right-4 top-4">
				<LanguagePicker />
			</div>
			<Suspense
				fallback={
					<div className="h-[400px] w-full max-w-md animate-pulse rounded-lg bg-muted" />
				}
			>
				<SignupContent locale={params.locale} />
			</Suspense>
		</div>
	)
}
