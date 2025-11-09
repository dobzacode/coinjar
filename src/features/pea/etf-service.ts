interface YahooFinanceQuote {
	regularMarketPrice?: number
	currency?: string
}

interface YahooFinanceResponse {
	chart: {
		result?: Array<{
			meta?: YahooFinanceQuote
		}>
		error?: {
			description: string
		}
	}
}

export async function fetchEtfPrice(isin: string): Promise<{
	price: number
	currency: string
} | null> {
	try {
		const symbol = `${isin}.PA`

		const chartUrl = new URL(
			`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`
		)

		const response = await fetch(chartUrl.toString(), {
			headers: {
				'User-Agent': 'Mozilla/5.0',
			},
			next: { revalidate: 3600 },
		})

		if (!response.ok) {
			console.error(`Yahoo Finance API error: ${response.status}`)
			return null
		}

		const data: YahooFinanceResponse = await response.json()

		if (data.chart.error) {
			console.error(`Yahoo Finance error: ${data.chart.error.description}`)
			return null
		}

		const result = data.chart.result?.[0]
		const quote = result?.meta

		if (!quote?.regularMarketPrice) {
			console.error(`No price data for ${isin}`)
			return null
		}

		return {
			price: quote.regularMarketPrice,
			currency: quote.currency || 'EUR',
		}
	} catch (error) {
		console.error(`Error fetching price for ${isin}:`, error)
		return null
	}
}

export async function fetchMultipleEtfPrices(isins: string[]): Promise<
	Record<string, { price: number; currency: string } | null>
> {
	const results: Record<string, { price: number; currency: string } | null> = {}

	await Promise.all(
		isins.map(async (isin) => {
			results[isin] = await fetchEtfPrice(isin)
		})
	)

	return results
}




