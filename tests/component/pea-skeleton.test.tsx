import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PeaSkeleton } from '@/features/pea/components/pea-skeleton'

describe('PeaSkeleton', () => {
	it('should render skeleton loading state', () => {
		const { container } = render(<PeaSkeleton />)
		
		const skeletons = container.querySelectorAll('.animate-pulse')
		expect(skeletons.length).toBeGreaterThan(0)
	})

	it('should render 4 metric cards skeleton', () => {
		const { container } = render(<PeaSkeleton />)
		
		const cards = container.querySelectorAll('[class*="grid"] > div')
		expect(cards.length).toBeGreaterThanOrEqual(4)
	})
})

