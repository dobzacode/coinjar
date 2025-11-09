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

export type TranslationFn = (
	key: string,
	values?: Record<string, string | number>
) => string
