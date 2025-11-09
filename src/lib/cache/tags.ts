export const CACHE_TAGS = {
	LIVRET_A: 'livret-a',
	LIVRET_A_TRANSACTIONS: 'livret-a-transactions',
	PEA: 'pea',
	PEA_HOLDINGS: 'pea-holdings',
	PEE: 'pee',
	PEE_CONTRIBUTIONS: 'pee-contributions',
	USER_SESSION: 'user-session',
	DASHBOARD: 'dashboard',
} as const

export const getCacheTag = {
	livretA: (userId: string) => `${CACHE_TAGS.LIVRET_A}-${userId}`,
	pea: (userId: string) => `${CACHE_TAGS.PEA}-${userId}`,
	pee: (userId: string) => `${CACHE_TAGS.PEE}-${userId}`,
	dashboard: (userId: string) => `${CACHE_TAGS.DASHBOARD}-${userId}`,
}

export const CACHE_REVALIDATION = {
	LIVRET_A: 3600,
	PEA: 3600,
	PEE: 3600,
	DASHBOARD: 300,
	SHORT: 60,
	LONG: 7200,
} as const
