import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Building, TrendingUp, Wallet } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PeeMetricsCardsProps {
	totalValue: number
	totalShares: number
	sharePrice: number
}

export function PeeMetricsCards({
	totalValue,
	totalShares,
	sharePrice,
}: PeeMetricsCardsProps) {
	const t = useTranslations('pee')

	return (
		<div className="grid gap-4 md:grid-cols-3">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t('totalValue')}</CardTitle>
					<Wallet className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						{t('totalShares')}
					</CardTitle>
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalShares.toFixed(6)}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t('sharePrice')}</CardTitle>
					<Building className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{formatCurrency(sharePrice)}</div>
				</CardContent>
			</Card>
		</div>
	)
}

