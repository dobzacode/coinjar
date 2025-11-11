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
