import { relations } from 'drizzle-orm'
import {
	boolean,
	date,
	decimal,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})

export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})

export const verifications = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})

export const livretA = pgTable('livret_a', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull()
		.unique(),
	balance: decimal('balance', { precision: 10, scale: 2 })
		.default('0.00')
		.notNull(),
	currentRate: decimal('current_rate', { precision: 5, scale: 3 })
		.default('3.000')
		.notNull(),
	lastInterestDate: date('last_interest_date'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const transactionTypeEnum = pgEnum('transaction_type', [
	'deposit',
	'withdrawal',
	'interest',
])

export const livretATransactions = pgTable('livret_a_transactions', {
	id: uuid('id').primaryKey().defaultRandom(),
	livretId: uuid('livret_id')
		.references(() => livretA.id, { onDelete: 'cascade' })
		.notNull(),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	type: transactionTypeEnum('type').notNull(),
	date: date('date').notNull(),
	description: varchar('description', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const livretARateHistory = pgTable('livret_a_rate_history', {
	id: uuid('id').primaryKey().defaultRandom(),
	rate: decimal('rate', { precision: 5, scale: 3 }).notNull(),
	effectiveDate: date('effective_date').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const peeAccounts = pgTable('pee_accounts', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull()
		.unique(),
	companyName: varchar('company_name', { length: 255 }).notNull(),
	sharePrice: decimal('share_price', { precision: 10, scale: 4 })
		.default('0.0000')
		.notNull(),
	totalShares: decimal('total_shares', { precision: 15, scale: 6 })
		.default('0.000000')
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const contributionTypeEnum = pgEnum('contribution_type', [
	'abondement',
	'participation',
	'interessement',
	'personal',
])

export const peeContributions = pgTable('pee_contributions', {
	id: uuid('id').primaryKey().defaultRandom(),
	peeAccountId: uuid('pee_account_id')
		.references(() => peeAccounts.id, { onDelete: 'cascade' })
		.notNull(),
	type: contributionTypeEnum('type').notNull(),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	shares: decimal('shares', { precision: 15, scale: 6 }).notNull(),
	date: date('date').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const peaAccounts = pgTable('pea_accounts', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull()
		.unique(),
	name: varchar('name', { length: 255 }).notNull(),
	totalInvestment: decimal('total_investment', { precision: 12, scale: 2 })
		.default('0.00')
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const peaHoldings = pgTable('pea_holdings', {
	id: uuid('id').primaryKey().defaultRandom(),
	peaAccountId: uuid('pea_account_id')
		.references(() => peaAccounts.id, { onDelete: 'cascade' })
		.notNull(),
	isin: varchar('isin', { length: 12 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	shares: decimal('shares', { precision: 15, scale: 6 }).notNull(),
	purchasePrice: decimal('purchase_price', {
		precision: 10,
		scale: 4,
	}).notNull(),
	purchaseDate: date('purchase_date').notNull(),
	lastUpdatedPrice: decimal('last_updated_price', { precision: 10, scale: 4 }),
	lastUpdatedAt: timestamp('last_updated_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const etfPricesCache = pgTable('etf_prices_cache', {
	id: uuid('id').primaryKey().defaultRandom(),
	isin: varchar('isin', { length: 12 }).unique().notNull(),
	price: decimal('price', { precision: 10, scale: 4 }).notNull(),
	currency: varchar('currency', { length: 3 }).default('EUR').notNull(),
	fetchedAt: timestamp('fetched_at').defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many, one }) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	livretA: one(livretA, {
		fields: [users.id],
		references: [livretA.userId],
	}),
	peeAccount: one(peeAccounts, {
		fields: [users.id],
		references: [peeAccounts.userId],
	}),
	peaAccount: one(peaAccounts, {
		fields: [users.id],
		references: [peaAccounts.userId],
	}),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}))

export const livretARelations = relations(livretA, ({ one, many }) => ({
	user: one(users, {
		fields: [livretA.userId],
		references: [users.id],
	}),
	transactions: many(livretATransactions),
}))

export const livretATransactionsRelations = relations(
	livretATransactions,
	({ one }) => ({
		livret: one(livretA, {
			fields: [livretATransactions.livretId],
			references: [livretA.id],
		}),
	})
)

export const peeAccountsRelations = relations(peeAccounts, ({ one, many }) => ({
	user: one(users, {
		fields: [peeAccounts.userId],
		references: [users.id],
	}),
	contributions: many(peeContributions),
}))

export const peeContributionsRelations = relations(
	peeContributions,
	({ one }) => ({
		peeAccount: one(peeAccounts, {
			fields: [peeContributions.peeAccountId],
			references: [peeAccounts.id],
		}),
	})
)

export const peaAccountsRelations = relations(peaAccounts, ({ one, many }) => ({
	user: one(users, {
		fields: [peaAccounts.userId],
		references: [users.id],
	}),
	holdings: many(peaHoldings),
}))

export const peaHoldingsRelations = relations(peaHoldings, ({ one }) => ({
	peaAccount: one(peaAccounts, {
		fields: [peaHoldings.peaAccountId],
		references: [peaAccounts.id],
	}),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type LivretA = typeof livretA.$inferSelect
export type NewLivretA = typeof livretA.$inferInsert
export type LivretATransaction = typeof livretATransactions.$inferSelect
export type NewLivretATransaction = typeof livretATransactions.$inferInsert
export type LivretARateHistory = typeof livretARateHistory.$inferSelect
export type NewLivretARateHistory = typeof livretARateHistory.$inferInsert
export type PeeAccount = typeof peeAccounts.$inferSelect
export type NewPeeAccount = typeof peeAccounts.$inferInsert
export type PeeContribution = typeof peeContributions.$inferSelect
export type NewPeeContribution = typeof peeContributions.$inferInsert
export type PeaAccount = typeof peaAccounts.$inferSelect
export type NewPeaAccount = typeof peaAccounts.$inferInsert
export type PeaHolding = typeof peaHoldings.$inferSelect
export type NewPeaHolding = typeof peaHoldings.$inferInsert
export type EtfPriceCache = typeof etfPricesCache.$inferSelect
export type NewEtfPriceCache = typeof etfPricesCache.$inferInsert
