import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton', () => {
	it('should render with default styles', () => {
		const { container } = render(<Skeleton />)
		const skeleton = container.firstChild as HTMLElement
		expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted')
	})

	it('should apply custom className', () => {
		const { container } = render(<Skeleton className="h-10 w-10" />)
		const skeleton = container.firstChild as HTMLElement
		expect(skeleton).toHaveClass('h-10', 'w-10')
	})

	it('should forward additional props', () => {
		const { container } = render(<Skeleton data-testid="test-skeleton" />)
		const skeleton = container.firstChild as HTMLElement
		expect(skeleton).toHaveAttribute('data-testid', 'test-skeleton')
	})
})


