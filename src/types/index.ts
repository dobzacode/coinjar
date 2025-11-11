export interface DashboardStats {
	totalBalance: number
	totalGain: number
	totalPerformance: number
	livretABalance: number
	peeValue: number
	peaValue: number
}

export interface ChartDataPoint {
	date: string
	value: number
	label?: string
}

export interface WealthDataPoint {
	date: string
	total: number
	livretA: number
	pee: number
	pea: number
}

export type TranslationFn = (
	key: string,
	values?: Record<string, string | number>
) => string
