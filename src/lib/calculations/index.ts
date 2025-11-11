/**
 * Centralized export for all calculation functions
 * Provides a single import point for calculations across the application
 */

// Livret A calculations
export { calculateInterest } from '@/features/livret-a/calculations'

// PEA calculations
export {
	calculatePortfolioMetrics,
	calculateHoldingPerformance,
} from '@/features/pea/calculations'

// PEE calculations
export {
	calculatePeeValue,
	calculateContributionsByType,
} from '@/features/pee/calculations'

// Dashboard calculations
export {
	calculateChartDateRange,
	generateWealthDataPoints,
	calculateTotalReturn,
	type AccountBalances,
} from '@/features/dashboard/calculations'
