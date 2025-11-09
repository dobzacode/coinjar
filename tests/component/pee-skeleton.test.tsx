import { PeeSkeleton } from '@/features/pee/components/pee-skeleton'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('PeeSkeleton', () => {
	it('should render skeleton loading state', () => {
		const { container } = render(<PeeSkeleton />)

		const skeletons = container.querySelectorAll('.animate-pulse')
		expect(skeletons.length).toBeGreaterThan(0)
	})

	it('should render skeleton structure', () => {
		const { container } = render(<PeeSkeleton />)

		expect(container.querySelector('.space-y-sm')).toBeTruthy()
	})
})
