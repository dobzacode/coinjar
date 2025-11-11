/**
 * Centralized export for all calculation functions
 * Provides a single import point for calculations across the application
 */

// Livret A calculations
export {
	calculateAnnualInterest,
	calculateCurrentBalance,
} from '@/features/livret-a/calculations'

// PEA calculations
export {
	calculateHoldingPerformance,
	calculatePortfolioMetrics,
} from '@/features/pea/calculations'

// PEE calculations
export {
	calculateContributionsByType,
	calculatePeeValue,
} from '@/features/pee/calculations'

// Dashboard calculations
export {
	calculateChartDateRange,
	calculateTotalReturn,
	generateWealthDataPoints,
	type AccountBalances,
} from '@/features/dashboard/calculations'
