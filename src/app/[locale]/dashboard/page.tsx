import {
	AccountCards,
	AccountCardsSkeleton,
	AssetAllocationChart,
	OverviewCards,
	OverviewCardsSkeleton,
	PerformanceMetrics,
	WealthEvolutionChart,
} from '@/features/dashboard/components'
import { getUserId } from '@/features/dashboard/queries'
import { getDashboardData } from '@/features/dashboard/services'
import {
	calculateChartDateRange,
	calculateTotalReturn,
	generateWealthDataPoints,
} from '@/lib/calculations'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cacheLife } from 'next/cache'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

interface DashboardPageProps {
	params: Promise<{ locale: string }>
}

async function DashboardContent() {
	'use cache: private'
	cacheLife('days')

	const userId = await getUserId()
	if (!userId) redirect('/login')

	const data = await getDashboardData(userId)

	const livretAYield = data.livretA.rate ? parseFloat(data.livretA.rate) : 0
	const totalReturn = calculateTotalReturn(
		data.totalBalance,
		data.pea.gain,
		data.livretA.balance,
		livretAYield
	)

	const { startDate, dataPoints } = calculateChartDateRange(
		data.signupDate,
		data.earliestTransaction
	)

	const mockWealthData = generateWealthDataPoints(startDate, dataPoints, {
		livretA: data.livretA.balance,
		pee: data.pee.value,
		pea: data.pea.currentValue,
	})

	return (
		<>
			<OverviewCards
				totalBalance={data.totalBalance}
				totalGain={data.totalGain}
				performance={data.pea.performance}
				livretABalance={data.livretA.balance}
				livretARate={data.livretA.rate}
				peeValue={data.pee.value}
				peeShares={data.pee.shares}
			/>

			<WealthEvolutionChart data={mockWealthData} />
			<div className="grid gap-sm md:grid-cols-2">
				<AssetAllocationChart
					livretA={data.livretA.balance}
					pee={data.pee.value}
					pea={data.pea.currentValue}
				/>
				<PerformanceMetrics
					peaPerformance={data.pea.performance}
					peaGain={data.pea.gain}
					livretAYield={livretAYield}
					totalReturn={totalReturn}
				/>
			</div>

			<AccountCards
				livretABalance={data.livretA.balance}
				livretARate={data.livretA.rate}
				peeValue={data.pee.value}
				peeShares={data.pee.shares}
				peaValue={data.pea.currentValue}
				peaGain={data.pea.gain}
			/>
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

			<Suspense
				fallback={
					<>
						<OverviewCardsSkeleton />
						<div className="h-[400px] animate-pulse rounded-lg bg-muted" />
						<AccountCardsSkeleton />
					</>
				}
			>
				<DashboardContent />
			</Suspense>
		</div>
	)
}
