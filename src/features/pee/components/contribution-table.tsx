import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { PeeContribution } from '@/lib/db/schema'
import { translateContributionType } from '@/lib/i18n/type-translators'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

interface ContributionTableProps {
	contributions: PeeContribution[]
}

export async function ContributionTable({
	contributions,
}: ContributionTableProps) {
	const t = await getTranslations('pee')

	if (contributions.length === 0) {
		return (
			<p className="text-center text-muted-foreground">
				{t('noContributions')}
			</p>
		)
	}

	return (
		<>
			<div className="hidden md:block">
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
						{contributions.map((contribution) => (
							<TableRow key={contribution.id}>
								<TableCell>{formatDate(contribution.date, 'short')}</TableCell>
								<TableCell className="capitalize">
									{translateContributionType(contribution.type, t)}
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
			</div>

			<div className="space-y-3 md:hidden">
				{contributions.map((contribution) => (
					<div
						key={contribution.id}
						className="rounded-lg border bg-card p-4 text-card-foreground"
					>
						<div className="mb-2 flex items-start justify-between">
							<div>
								<p className="text-sm text-muted-foreground">
									{formatDate(contribution.date, 'short')}
								</p>
								<p className="font-medium capitalize">
									{translateContributionType(contribution.type, t)}
								</p>
							</div>
							<p className="text-lg font-bold text-green-600">
								{formatCurrency(contribution.amount)}
							</p>
						</div>
						<p className="text-sm text-muted-foreground">
							{t('shares')}: {parseFloat(contribution.shares).toFixed(6)}
						</p>
					</div>
				))}
			</div>
		</>
	)
}
