import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	calculateContributionsByType,
	calculatePeeValue,
} from '@/features/pee/calculations'
import { PeeAccountForm } from '@/features/pee/components/pee-account-form'
import { PeeContributionBreakdown } from '@/features/pee/components/pee-contribution-breakdown'
import { PeeContributionForm } from '@/features/pee/components/pee-contribution-form'
import { PeeContributionList } from '@/features/pee/components/pee-contribution-list'
import { PeeMetricsCards } from '@/features/pee/components/pee-metrics-cards'
import { PeeSkeleton } from '@/features/pee/components/pee-skeleton'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { peeAccounts } from '@/lib/db/schema'
import { formatCurrency, formatDate } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

interface PeePageProps {
	params: Promise<{ locale: string }>
}

async function PeeContent() {
	const t = await getTranslations('pee')
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user?.id) {
		redirect('/login')
	}

	let userPee = await db.query.peeAccounts.findFirst({
		where: eq(peeAccounts.userId, session.user.id),
		with: {
			contributions: {
				orderBy: (contributions, { desc }) => [desc(contributions.date)],
			},
		},
	})

	if (!userPee) {
		const [newPee] = await db
			.insert(peeAccounts)
			.values({
				userId: session.user.id,
				companyName: 'Mon entreprise',
				sharePrice: '0.00',
				totalShares: '0.00',
			})
			.returning()

		userPee = { ...newPee, contributions: [] }
	}

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
				<div className="flex gap-2">
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
					{userPee.contributions.length === 0 ? (
						<p className="text-center text-muted-foreground">
							{t('noContributions')}
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t('date')}</TableHead>
									<TableHead>{t('type')}</TableHead>
									<TableHead className="text-right">{t('amount')}</TableHead>
									<TableHead className="text-right">{t('shares')}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{userPee.contributions.map((contribution) => (
									<TableRow key={contribution.id}>
										<TableCell>
											{formatDate(contribution.date, 'short')}
										</TableCell>
										<TableCell className="capitalize">
											{contribution.type === 'personal'
												? t('personal')
												: contribution.type === 'abondement'
													? t('abondement')
													: contribution.type === 'participation'
														? t('participation')
														: t('interessement')}
										</TableCell>
										<TableCell className="text-right">
											{formatCurrency(contribution.amount)}
										</TableCell>
										<TableCell className="text-right">
											{parseFloat(contribution.shares).toFixed(6)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
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
