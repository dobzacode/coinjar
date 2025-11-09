import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/features/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			spacing: {
				xs: 'var(--spacing-xs)',
				sm: 'var(--spacing-sm)',
				md: 'var(--spacing-md)',
				lg: 'var(--spacing-lg)',
				xl: 'var(--spacing-xl)',
				'2xl': 'var(--spacing-2xl)',
				'3xl': 'var(--spacing-3xl)',
				'4xl': 'var(--spacing-4xl)',
			},
			fontSize: {
				xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-xs)' }],
				sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-sm)' }],
				base: [
					'var(--font-size-base)',
					{ lineHeight: 'var(--line-height-base)' },
				],
				lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-lg)' }],
				xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-xl)' }],
				'2xl': [
					'var(--font-size-2xl)',
					{ lineHeight: 'var(--line-height-2xl)' },
				],
				'3xl': [
					'var(--font-size-3xl)',
					{ lineHeight: 'var(--line-height-3xl)' },
				],
				'4xl': [
					'var(--font-size-4xl)',
					{ lineHeight: 'var(--line-height-4xl)' },
				],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				xs: 'var(--radius-xs)',
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
				xl: 'var(--radius-xl)',
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'fade-out': 'fadeOut 0.5s ease-in-out',
				'slide-in': 'slideIn 0.3s ease-out',
				'slide-out': 'slideOut 0.3s ease-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				slideIn: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideOut: {
					'0%': { transform: 'translateY(0)', opacity: '1' },
					'100%': { transform: 'translateY(-10px)', opacity: '0' },
				},
			},
		},
	},
	plugins: [tailwindcssAnimate],
}

export default config
