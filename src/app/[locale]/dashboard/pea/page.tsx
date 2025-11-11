import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { PeaHoldingForm } from '@/features/pea/components/pea-holding-form'
import { PeaHoldingsTable } from '@/features/pea/components/pea-holdings-table'
import { PeaMetricsCards } from '@/features/pea/components/pea-metrics-cards'
import { PeaSkeleton } from '@/features/pea/components/pea-skeleton'
import { RefreshPricesButton } from '@/features/pea/components/refresh-prices-button'
import { requireAuthForPage } from '@/lib/auth/page-helpers'
import { calculatePortfolioMetrics } from '@/lib/calculations'
import { getOrCreatePea } from '@/lib/services/account-service'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cacheLife } from 'next/cache'
import { Suspense } from 'react'

interface PeaPageProps {
	params: Promise<{ locale: string }>
}

async function PeaContent() {
	'use cache: private'
	cacheLife({ stale: 60 })

	const t = await getTranslations('pea')
	const userId = await requireAuthForPage()
	const userPea = await getOrCreatePea(userId)

	const metrics = calculatePortfolioMetrics(userPea.holdings)

	return (
		<div className="space-y-sm">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-3xl font-bold">{t('equitySavingsPlan')}</h1>
					<p className="text-muted-foreground">{userPea.name}</p>
				</div>
				<div className="flex gap-2">
					<RefreshPricesButton />
					<PeaHoldingForm />
				</div>
			</div>

			<PeaMetricsCards
				totalInvestment={metrics.totalInvestment}
				currentValue={metrics.currentValue}
				gain={metrics.gain}
				performance={metrics.performance}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t('myHoldings')}</CardTitle>
					<CardDescription>{t('etfCollection')}</CardDescription>
				</CardHeader>
				<CardContent>
					<PeaHoldingsTable holdings={userPea.holdings} />
				</CardContent>
			</Card>
		</div>
	)
}

export default async function PeaPage({ params }: PeaPageProps) {
	const { locale } = await params
	setRequestLocale(locale)

	return (
		<Suspense fallback={<PeaSkeleton />}>
			<PeaContent />
		</Suspense>
	)
}
