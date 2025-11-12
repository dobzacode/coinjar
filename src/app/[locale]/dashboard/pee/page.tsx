import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContributionTable } from '@/features/pee/components/contribution-table'
import { PeeAccountForm } from '@/features/pee/components/pee-account-form'
import { PeeContributionBreakdown } from '@/features/pee/components/pee-contribution-breakdown'
import { PeeContributionForm } from '@/features/pee/components/pee-contribution-form'
import { PeeContributionList } from '@/features/pee/components/pee-contribution-list'
import { PeeMetricsCards } from '@/features/pee/components/pee-metrics-cards'
import { PeeSkeleton } from '@/features/pee/components/pee-skeleton'
import { requireAuthForPage } from '@/lib/auth/page-helpers'
import {
	calculateContributionsByType,
	calculatePeeValue,
} from '@/lib/calculations'
import { getOrCreatePee } from '@/lib/services/account-service'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cacheLife } from 'next/cache'
import { Suspense } from 'react'

interface PeePageProps {
	params: Promise<{ locale: string }>
}

async function PeeContent() {
	'use cache: private'
	cacheLife('days')

	const t = await getTranslations('pee')
	const userId = await requireAuthForPage()
	const userPee = await getOrCreatePee(userId)

	const sharePrice = parseFloat(userPee.sharePrice)
	const totalShares = parseFloat(userPee.totalShares)
	const totalValue = calculatePeeValue(totalShares, sharePrice)
	const contributionsByType = calculateContributionsByType(
		userPee.contributions
	)

	return (
		<div className="space-y-sm">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-3xl font-bold">{t('employeeSavingsPlan')}</h1>
					<p className="text-muted-foreground">{userPee.companyName}</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<PeeAccountForm
						companyName={userPee.companyName}
						sharePrice={sharePrice}
					/>
					<PeeContributionForm />
				</div>
			</div>

			<PeeMetricsCards
				totalValue={totalValue}
				totalShares={totalShares}
				sharePrice={sharePrice}
			/>

			<div className="grid gap-4 md:grid-cols-2">
				<PeeContributionBreakdown
					personal={contributionsByType.personal}
					abondement={contributionsByType.abondement}
					participation={contributionsByType.participation}
					interessement={contributionsByType.interessement}
				/>
				<PeeContributionList contributions={userPee.contributions} limit={5} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{t('allContributions')}</CardTitle>
				</CardHeader>
				<CardContent>
					<ContributionTable contributions={userPee.contributions} />
				</CardContent>
			</Card>
		</div>
	)
}

export default async function PeePage({ params }: PeePageProps) {
	const { locale } = await params
	setRequestLocale(locale)

	return (
		<Suspense fallback={<PeeSkeleton />}>
			<PeeContent />
		</Suspense>
	)
}
