import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface PeeContributionBreakdownProps {
	personal: number
	abondement: number
	participation: number
	interessement: number
}

export function PeeContributionBreakdown({
	personal,
	abondement,
	participation,
	interessement,
}: PeeContributionBreakdownProps) {
	const t = useTranslations('pee')

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('contributionsByType')}</CardTitle>
				<CardDescription>
					{t('contributionsByTypeDescription')}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="flex justify-between">
					<span className="text-muted-foreground">{t('personal')}</span>
					<span className="font-medium">{formatCurrency(personal)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">{t('abondement')}</span>
					<span className="font-medium">{formatCurrency(abondement)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">{t('participation')}</span>
					<span className="font-medium">{formatCurrency(participation)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">{t('interessement')}</span>
					<span className="font-medium">{formatCurrency(interessement)}</span>
				</div>
			</CardContent>
		</Card>
	)
}

