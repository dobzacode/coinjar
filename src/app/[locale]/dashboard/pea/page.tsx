import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { calculatePortfolioMetrics } from '@/features/pea/calculations'
import { PeaHoldingForm } from '@/features/pea/components/pea-holding-form'
import { PeaHoldingsTable } from '@/features/pea/components/pea-holdings-table'
import { PeaMetricsCards } from '@/features/pea/components/pea-metrics-cards'
import { PeaSkeleton } from '@/features/pea/components/pea-skeleton'
import { RefreshPricesButton } from '@/features/pea/components/refresh-prices-button'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { peaAccounts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

interface PeaPageProps {
	params: Promise<{ locale: string }>
}

async function PeaContent() {
	const t = await getTranslations('pea')
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user?.id) {
		redirect('/login')
	}

	let userPea = await db.query.peaAccounts.findFirst({
		where: eq(peaAccounts.userId, session.user.id),
		with: {
			holdings: {
				orderBy: (holdings, { desc }) => [desc(holdings.purchaseDate)],
			},
		},
	})

	if (!userPea) {
		const [newPea] = await db
			.insert(peaAccounts)
			.values({
				userId: session.user.id,
				name: 'Mon PEA',
				totalInvestment: '0.00',
			})
			.returning()

		userPea = { ...newPea, holdings: [] }
	}

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
