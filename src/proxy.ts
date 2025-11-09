import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const publicRoutes = ['/login', '/signup', '/api/auth']

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

	if (!isPublicRoute && pathname.startsWith('/dashboard')) {
		const session = request.cookies.get('better-auth.session_token')
		if (!session) {
			return NextResponse.redirect(new URL('/login', request.url))
		}
	}

	return intlMiddleware(request)
}

export const config = {
	matcher: ['/', '/(fr|en)/:path*', '/((?!_next|api|.*\\..*).*)'],
}
