import createMiddleware from 'next-intl/middleware'
import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { auth } from './lib/auth'

const intlMiddleware = createMiddleware(routing)

const publicRoutes = ['/login', '/signup', '/api']

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	const pathnameWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/'

	const isPublicRoute = publicRoutes.some((route) =>
		pathnameWithoutLocale.startsWith(route)
	)

	if (!isPublicRoute && pathnameWithoutLocale.startsWith('/dashboard')) {
		const session = await auth.api.getSession({
			headers: await headers(),
		})

		if (!session) {
			const locale = pathname.match(/^\/(en|fr)/)?.[1] || 'en'
			return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
		}
	}

	return intlMiddleware(request)
}

export const config = {
	matcher: ['/', '/(fr|en)/:path*', '/((?!_next|api|.*\\..*).*)'],
}
