import { LanguagePicker } from '@/components/language-picker'
import { SignupForm } from '@/features/auth/components/signup-form'

export default function SignupPage() {
	return (
		<div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
			<div className="absolute right-4 top-4">
				<LanguagePicker />
			</div>
			<SignupForm />
		</div>
	)
}
