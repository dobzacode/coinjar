'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedWrapperProps {
	children: ReactNode
	delay?: number
	className?: string
}

export function AnimatedWrapper({
	children,
	delay = 0,
	className,
}: AnimatedWrapperProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay }}
			className={className}
		>
			{children}
		</motion.div>
	)
}

export function FadeIn({
	children,
	delay = 0,
	className,
}: AnimatedWrapperProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3, delay }}
			className={className}
		>
			{children}
		</motion.div>
	)
}

export function SlideIn({
	children,
	delay = 0,
	direction = 'up',
	className,
}: AnimatedWrapperProps & { direction?: 'up' | 'down' | 'left' | 'right' }) {
	const directions = {
		up: { y: 20 },
		down: { y: -20 },
		left: { x: 20 },
		right: { x: -20 },
	}

	return (
		<motion.div
			initial={{ opacity: 0, ...directions[direction] }}
			animate={{ opacity: 1, x: 0, y: 0 }}
			transition={{ duration: 0.4, delay }}
			className={className}
		>
			{children}
		</motion.div>
	)
}
