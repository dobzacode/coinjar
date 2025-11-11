/**
 * Mock authenticated session for testing
 * @param userId - User ID to mock
 */
export function mockAuthSession(userId: string) {
	return {
		user: {
			id: userId,
			email: 'test@example.com',
			name: 'Test User',
		},
		session: {
			id: 'test-session',
			userId,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
		},
	}
}

/**
 * Mock translation function for testing
 * Returns the key passed to it, useful for testing translation keys
 */
export function mockTranslations() {
	return (key: string, params?: Record<string, unknown>) => {
		if (params) {
			// Replace params in the key for testing
			return `${key}-${JSON.stringify(params)}`
		}
		return key
	}
}

/**
 * Create a mock user ID for testing
 */
export function createMockUserId() {
	return `test-user-${Math.random().toString(36).substring(7)}`
}

/**
 * Mock database response helpers
 */
export const mockDb = {
	/**
	 * Create a mock livret A account
	 */
	livretA: (userId: string, overrides = {}) => ({
		id: 'mock-livret-id',
		userId,
		balance: '1000.00',
		currentRate: '3.000',
		lastInterestDate: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		transactions: [],
		...overrides,
	}),

	/**
	 * Create a mock PEA account
	 */
	pea: (userId: string, overrides = {}) => ({
		id: 'mock-pea-id',
		userId,
		name: 'Mon PEA',
		totalInvestment: '5000.00',
		createdAt: new Date(),
		updatedAt: new Date(),
		holdings: [],
		...overrides,
	}),

	/**
	 * Create a mock PEE account
	 */
	pee: (userId: string, overrides = {}) => ({
		id: 'mock-pee-id',
		userId,
		companyName: 'Test Company',
		sharePrice: '50.00',
		totalShares: '100.00',
		createdAt: new Date(),
		updatedAt: new Date(),
		contributions: [],
		...overrides,
	}),
}

/**
 * Wait for async operations to complete
 */
export async function waitForAsync() {
	await new Promise((resolve) => setTimeout(resolve, 0))
}
