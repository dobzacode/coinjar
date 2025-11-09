import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LanguagePicker } from '@/components/language-picker'

vi.mock('next-intl', () => ({
	useLocale: () => 'en',
	useTranslations: () => (key: string) => key,
}))

vi.mock('@/i18n/routing', () => ({
	usePathname: () => '/dashboard',
	useRouter: () => ({
		replace: vi.fn(),
	}),
}))

describe('LanguagePicker', () => {
	it('should render language picker button', () => {
		render(<LanguagePicker />)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('should show language options when clicked', async () => {
		const user = userEvent.setup()
		render(<LanguagePicker />)

		const button = screen.getByRole('button')
		await user.click(button)

		expect(screen.getByText(/en/i)).toBeInTheDocument()
		expect(screen.getByText(/fr/i)).toBeInTheDocument()
	})
})


