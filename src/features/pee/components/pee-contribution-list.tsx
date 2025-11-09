import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { PeeContribution } from '@/lib/db/schema'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface PeeContributionListProps {
	contributions: PeeContribution[]
	limit?: number
}

export function PeeContributionList({
	contributions,
	limit = 5,
}: PeeContributionListProps) {
	const t = useTranslations('pee')

	if (contributions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('recentContributions')}</CardTitle>
					<CardDescription>{t('cumulativeAmounts')}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground">
						{t('noContributions')}
					</p>
				</CardContent>
			</Card>
		)
	}

	const displayContributions = contributions.slice(0, limit)

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('recentContributions')}</CardTitle>
				<CardDescription>{t('cumulativeAmounts')}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{displayContributions.map((contribution) => (
						<div
							key={contribution.id}
							className="flex items-center justify-between rounded-lg border p-3"
						>
							<div>
								<p className="text-sm font-medium capitalize">
									{contribution.type === 'personal'
										? t('personal')
										: contribution.type === 'abondement'
											? t('abondement')
											: contribution.type === 'participation'
												? t('participation')
												: t('interessement')}
								</p>
								<p className="text-xs text-muted-foreground">
									{formatDate(contribution.date, 'short')}
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm font-medium">
									{formatCurrency(contribution.amount)}
								</p>
								<p className="text-xs text-muted-foreground">
									{parseFloat(contribution.shares).toFixed(2)} {t('shares')}
								</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

