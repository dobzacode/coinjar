import {
	AccountCards,
	AccountCardsSkeleton,
	AssetAllocationChart,
	OverviewCards,
	OverviewCardsSkeleton,
	PerformanceMetrics,
	WealthEvolutionChart,
} from '@/features/dashboard/components'
import {
	getUserId,
	getUserLivret,
	getUserPea,
	getUserPee,
} from '@/features/dashboard/queries'
import { calculatePortfolioMetrics } from '@/features/pea/calculations'
import { calculatePeeValue } from '@/features/pee/calculations'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

interface DashboardPageProps {
	params: Promise<{ locale: string }>
}

async function OverviewSection() {
	const userId = await getUserId()
	if (!userId) redirect('/login')

	const [userLivret, userPee, userPea] = await Promise.all([
		getUserLivret(userId),
		getUserPee(userId),
		getUserPea(userId),
	])

	const livretABalance = userLivret ? parseFloat(userLivret.balance) : 0
	const peeValue = userPee
		? calculatePeeValue(
				parseFloat(userPee.totalShares),
				parseFloat(userPee.sharePrice)
			)
		: 0
	const peaMetrics = userPea
		? calculatePortfolioMetrics(userPea.holdings)
		: { totalInvestment: 0, currentValue: 0, gain: 0, performance: 0 }

	const totalBalance = livretABalance + peeValue + peaMetrics.currentValue

	return (
		<OverviewCards
			totalBalance={totalBalance}
			totalGain={peaMetrics.gain}
			performance={peaMetrics.performance}
			livretABalance={livretABalance}
			livretARate={userLivret?.currentRate ?? null}
			peeValue={peeValue}
			peeShares={userPee?.totalShares ?? null}
		/>
	)
}

async function AccountsSection() {
	const userId = await getUserId()
	if (!userId) redirect('/login')

	const [userLivret, userPee, userPea] = await Promise.all([
		getUserLivret(userId),
		getUserPee(userId),
		getUserPea(userId),
	])

	const livretABalance = userLivret ? parseFloat(userLivret.balance) : 0
	const peeValue = userPee
		? calculatePeeValue(
				parseFloat(userPee.totalShares),
				parseFloat(userPee.sharePrice)
			)
		: 0
	const peaMetrics = userPea
		? calculatePortfolioMetrics(userPea.holdings)
		: { totalInvestment: 0, currentValue: 0, gain: 0, performance: 0 }

	return (
		<AccountCards
			livretABalance={livretABalance}
			livretARate={userLivret?.currentRate ?? null}
			peeValue={peeValue}
			peeShares={userPee?.totalShares ?? null}
			peaValue={peaMetrics.currentValue}
			peaGain={peaMetrics.gain}
		/>
	)
}

async function ChartsSection() {
	const userId = await getUserId()
	if (!userId) redirect('/login')

	const [userLivret, userPee, userPea] = await Promise.all([
		getUserLivret(userId),
		getUserPee(userId),
		getUserPea(userId),
	])

	const livretABalance = userLivret ? parseFloat(userLivret.balance) : 0
	const peeValue = userPee
		? calculatePeeValue(
				parseFloat(userPee.totalShares),
				parseFloat(userPee.sharePrice)
			)
		: 0
	const peaMetrics = userPea
		? calculatePortfolioMetrics(userPea.holdings)
		: { totalInvestment: 0, currentValue: 0, gain: 0, performance: 0 }

	const totalBalance = livretABalance + peeValue + peaMetrics.currentValue

	const mockWealthData = Array.from({ length: 12 }, (_, i) => {
		const growthFactor = 0.85 + (i * 0.15) / 11
		const monthsAgo = 11 - i
		const date = new Date()
		date.setMonth(date.getMonth() - monthsAgo)
		return {
			date: date.toISOString().split('T')[0],
			total: totalBalance * growthFactor,
			livretA: livretABalance * growthFactor,
			pee: peeValue * growthFactor,
			pea: peaMetrics.currentValue * growthFactor,
		}
	})

	const livretAYield = userLivret ? parseFloat(userLivret.currentRate) : 0
	const totalReturn =
		totalBalance > 0
			? ((peaMetrics.gain + livretABalance * (livretAYield / 100)) /
					totalBalance) *
				100
			: 0

	return (
		<>
			<WealthEvolutionChart data={mockWealthData} />
			<div className="grid gap-sm md:grid-cols-2">
				<AssetAllocationChart
					livretA={livretABalance}
					pee={peeValue}
					pea={peaMetrics.currentValue}
				/>
				<PerformanceMetrics
					peaPerformance={peaMetrics.performance}
					peaGain={peaMetrics.gain}
					livretAYield={livretAYield}
					totalReturn={totalReturn}
				/>
			</div>
		</>
	)
}

export default async function DashboardPage({ params }: DashboardPageProps) {
	const { locale } = await params
	setRequestLocale(locale)

	const t = await getTranslations('dashboard')

	return (
		<div className="space-y-sm">
			<div>
				<h1 className="text-3xl font-bold">{t('title')}</h1>
				<p className="text-muted-foreground">{t('subtitle')}</p>
			</div>

			<Suspense fallback={<OverviewCardsSkeleton />}>
				<OverviewSection />
			</Suspense>

			<Suspense
				fallback={
					<div className="h-[400px] animate-pulse rounded-lg bg-muted" />
				}
			>
				<ChartsSection />
			</Suspense>

			<Suspense fallback={<AccountCardsSkeleton />}>
				<AccountsSection />
			</Suspense>
		</div>
	)
}
