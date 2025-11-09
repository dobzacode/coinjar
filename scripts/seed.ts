import { db } from '@/lib/db'
import {
	accounts,
	livretA,
	livretATransactions,
	peaAccounts,
	peaHoldings,
	peeAccounts,
	peeContributions,
	users,
} from '@/lib/db/schema'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'

async function main() {
	console.log('🌱 Starting database seed...')

	const mockUserId = randomUUID()
	const mockEmail = 'mock@example.com'
	const mockPassword = 'Password123!'
	const hashedPassword = await hash(mockPassword, 10)

	console.log('👤 Creating mock user...')
	await db.insert(users).values({
		id: mockUserId,
		name: 'Mock User',
		email: mockEmail,
		emailVerified: true,
		image: null,
	})

	console.log('🔐 Creating password account...')
	await db.insert(accounts).values({
		id: randomUUID(),
		accountId: mockUserId,
		providerId: 'credential',
		userId: mockUserId,
		password: hashedPassword,
	})

	console.log('💰 Creating Livret A...')
	const [livretAAccount] = await db
		.insert(livretA)
		.values({
			userId: mockUserId,
			balance: '15000.00',
			currentRate: '3.000',
			lastInterestDate: new Date('2024-01-01').toISOString().split('T')[0],
		})
		.returning()

	console.log('📝 Creating Livret A transactions...')
	const now = new Date()
	const transactions = [
		{
			livretId: livretAAccount.id,
			amount: '5000.00',
			type: 'deposit' as const,
			date: new Date(now.getFullYear() - 1, 0, 15).toISOString().split('T')[0],
			description: 'Initial deposit',
		},
		{
			livretId: livretAAccount.id,
			amount: '2500.00',
			type: 'deposit' as const,
			date: new Date(now.getFullYear() - 1, 5, 10).toISOString().split('T')[0],
			description: 'Monthly savings',
		},
		{
			livretId: livretAAccount.id,
			amount: '1000.00',
			type: 'withdrawal' as const,
			date: new Date(now.getFullYear() - 1, 8, 20).toISOString().split('T')[0],
			description: 'Emergency withdrawal',
		},
		{
			livretId: livretAAccount.id,
			amount: '7500.00',
			type: 'deposit' as const,
			date: new Date(now.getFullYear(), 0, 5).toISOString().split('T')[0],
			description: 'Large deposit',
		},
		{
			livretId: livretAAccount.id,
			amount: '450.00',
			type: 'interest' as const,
			date: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
			description: 'Annual interest',
		},
	]
	await db.insert(livretATransactions).values(transactions)

	console.log('🏢 Creating PEE account...')
	const [peeAccount] = await db
		.insert(peeAccounts)
		.values({
			userId: mockUserId,
			companyName: 'Acme Corporation',
			sharePrice: '125.5000',
			totalShares: '485.250000',
		})
		.returning()

	console.log('💼 Creating PEE contributions...')
	const contributions = [
		{
			peeAccountId: peeAccount.id,
			type: 'personal' as const,
			amount: '2000.00',
			shares: '20.000000',
			date: new Date(now.getFullYear() - 2, 2, 1).toISOString().split('T')[0],
		},
		{
			peeAccountId: peeAccount.id,
			type: 'abondement' as const,
			amount: '600.00',
			shares: '6.000000',
			date: new Date(now.getFullYear() - 2, 2, 1).toISOString().split('T')[0],
		},
		{
			peeAccountId: peeAccount.id,
			type: 'participation' as const,
			amount: '3500.00',
			shares: '30.500000',
			date: new Date(now.getFullYear() - 1, 5, 15).toISOString().split('T')[0],
		},
		{
			peeAccountId: peeAccount.id,
			type: 'interessement' as const,
			amount: '2800.00',
			shares: '25.000000',
			date: new Date(now.getFullYear() - 1, 5, 15).toISOString().split('T')[0],
		},
		{
			peeAccountId: peeAccount.id,
			type: 'personal' as const,
			amount: '5000.00',
			shares: '45.000000',
			date: new Date(now.getFullYear(), 1, 1).toISOString().split('T')[0],
		},
		{
			peeAccountId: peeAccount.id,
			type: 'abondement' as const,
			amount: '1500.00',
			shares: '13.500000',
			date: new Date(now.getFullYear(), 1, 1).toISOString().split('T')[0],
		},
	]
	await db.insert(peeContributions).values(contributions)

	console.log('📈 Creating PEA account...')
	const [peaAccount] = await db
		.insert(peaAccounts)
		.values({
			userId: mockUserId,
			name: 'Mon PEA Principal',
			totalInvestment: '25000.00',
		})
		.returning()

	console.log('📊 Creating PEA holdings...')
	const holdings = [
		{
			peaAccountId: peaAccount.id,
			isin: 'LU0533033667',
			name: 'Amundi MSCI World UCITS ETF',
			shares: '45.500000',
			purchasePrice: '450.0000',
			lastUpdatedPrice: '520.5000',
			purchaseDate: new Date(now.getFullYear() - 2, 3, 10)
				.toISOString()
				.split('T')[0],
			lastUpdatedAt: new Date(),
		},
		{
			peaAccountId: peaAccount.id,
			isin: 'FR0013412285',
			name: 'Lyxor CAC 40 (DR) UCITS ETF',
			shares: '30.000000',
			purchasePrice: '52.0000',
			lastUpdatedPrice: '58.2500',
			purchaseDate: new Date(now.getFullYear() - 1, 6, 15)
				.toISOString()
				.split('T')[0],
			lastUpdatedAt: new Date(),
		},
		{
			peaAccountId: peaAccount.id,
			isin: 'LU1681045370',
			name: 'Amundi Euro Stoxx 50 UCITS ETF',
			shares: '100.000000',
			purchasePrice: '92.5000',
			lastUpdatedPrice: '98.7500',
			purchaseDate: new Date(now.getFullYear() - 1, 9, 20)
				.toISOString()
				.split('T')[0],
			lastUpdatedAt: new Date(),
		},
		{
			peaAccountId: peaAccount.id,
			isin: 'LU1681047236',
			name: 'Amundi CAC 40 ESG UCITS ETF',
			shares: '60.000000',
			purchasePrice: '135.0000',
			lastUpdatedPrice: '142.5000',
			purchaseDate: new Date(now.getFullYear(), 0, 15)
				.toISOString()
				.split('T')[0],
			lastUpdatedAt: new Date(),
		},
	]
	await db.insert(peaHoldings).values(holdings)

	console.log('✅ Seed completed successfully!')
	console.log('\n📋 Mock user credentials:')
	console.log(`   Email: ${mockEmail}`)
	console.log(`   Password: ${mockPassword}`)
	console.log('\n🎉 You can now login with these credentials!')
}

main()
	.catch((error) => {
		console.error('❌ Seed failed:', error)
		process.exit(1)
	})
	.finally(() => {
		process.exit(0)
	})
