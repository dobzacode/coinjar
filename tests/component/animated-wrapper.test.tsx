import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AnimatedWrapper, FadeIn, SlideIn } from '@/components/animated-wrapper'

describe('Animation Components', () => {
	describe('AnimatedWrapper', () => {
		it('should render children', () => {
			render(
				<AnimatedWrapper>
					<div>Test Content</div>
				</AnimatedWrapper>
			)
			expect(screen.getByText('Test Content')).toBeInTheDocument()
		})

		it('should apply custom className', () => {
			render(
				<AnimatedWrapper className="custom-class">
					<div>Test Content</div>
				</AnimatedWrapper>
			)
			const wrapper = screen.getByText('Test Content').parentElement
			expect(wrapper).toHaveClass('custom-class')
		})
	})

	describe('FadeIn', () => {
		it('should render children', () => {
			render(
				<FadeIn>
					<div>Fade Content</div>
				</FadeIn>
			)
			expect(screen.getByText('Fade Content')).toBeInTheDocument()
		})
	})

	describe('SlideIn', () => {
		it('should render children', () => {
			render(
				<SlideIn>
					<div>Slide Content</div>
				</SlideIn>
			)
			expect(screen.getByText('Slide Content')).toBeInTheDocument()
		})

		it('should support different directions', () => {
			render(
				<SlideIn direction="left">
					<div>Slide Left</div>
				</SlideIn>
			)
			expect(screen.getByText('Slide Left')).toBeInTheDocument()
		})
	})
})


