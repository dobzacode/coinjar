import { LivretASkeleton } from '@/features/livret-a/components/livret-a-skeleton'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('LivretASkeleton', () => {
	it('should render skeleton loading state', () => {
		const { container } = render(<LivretASkeleton />)

		const skeletons = container.querySelectorAll('.animate-pulse')
		expect(skeletons.length).toBeGreaterThan(0)
	})

	it('should have correct structure with cards', () => {
		render(<LivretASkeleton />)

		const cards = screen.getAllByRole('generic')
		expect(cards.length).toBeGreaterThan(0)
	})
})
