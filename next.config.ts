import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
	reactStrictMode: true,
	env: {
		DATABASE_URL: process.env.DATABASE_URL,
	},
	images: {
		formats: ['image/avif', 'image/webp'],
	},
	cacheComponents: true,
}

export default withNextIntl(nextConfig)
