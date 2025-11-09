import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const isin = searchParams.get('isin')

	if (!isin || isin.length !== 12) {
		return NextResponse.json({ error: 'Invalid ISIN' }, { status: 400 })
	}

	if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin)) {
		return NextResponse.json({ error: 'Invalid ISIN format' }, { status: 400 })
	}

	try {
		const searchUrl = new URL(
			'https://query1.finance.yahoo.com/v1/finance/search'
		)
		searchUrl.searchParams.set('q', isin)
		searchUrl.searchParams.set('quotesCount', '1')
		searchUrl.searchParams.set('newsCount', '0')

		const response = await fetch(searchUrl.toString(), {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			},
		})

		if (!response.ok) {
			return NextResponse.json(
				{ error: 'Failed to validate ISIN' },
				{ status: 404 }
			)
		}

		const data = await response.json()

		if (!data.quotes || data.quotes.length === 0 || !data.quotes[0].longname) {
			return NextResponse.json({ error: 'ISIN not found' }, { status: 404 })
		}

		return NextResponse.json({
			name: data.quotes[0].longname || data.quotes[0].shortname,
			symbol: data.quotes[0].symbol,
		})
	} catch (error) {
		console.error('Error validating ISIN:', error)
		return NextResponse.json(
			{ error: 'Failed to validate ISIN' },
			{ status: 500 }
		)
	}
}
