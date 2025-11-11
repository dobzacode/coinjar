import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
	return intlMiddleware(request)
}

export const config = {
	matcher: ['/', '/(fr|en)/:path*', '/((?!_next|api|.*\\..*).*)'],
}
