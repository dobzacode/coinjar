import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { BarChart3, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PeaMetricsCardsProps {
	totalInvestment: number
	currentValue: number
	gain: number
	performance: number
}

export function PeaMetricsCards({
	totalInvestment,
	currentValue,
	gain,
	performance,
}: PeaMetricsCardsProps) {
	const t = useTranslations('pea')

	return (
		<div className="grid gap-4 md:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						{t('investment')}
					</CardTitle>
					<Wallet className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatCurrency(totalInvestment)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						{t('currentValue')}
					</CardTitle>
					<BarChart3 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatCurrency(currentValue)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						{t('capitalGainShort')}
					</CardTitle>
					{gain >= 0 ? (
						<TrendingUp className="h-4 w-4 text-green-600" />
					) : (
						<TrendingDown className="h-4 w-4 text-destructive" />
					)}
				</CardHeader>
				<CardContent>
					<div
						className={`text-2xl font-bold ${gain >= 0 ? 'text-green-600' : 'text-destructive'}`}
					>
						{gain >= 0 ? '+' : ''}
						{formatCurrency(gain)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						{t('performance')}
					</CardTitle>
					{performance >= 0 ? (
						<TrendingUp className="h-4 w-4 text-green-600" />
					) : (
						<TrendingDown className="h-4 w-4 text-destructive" />
					)}
				</CardHeader>
				<CardContent>
					<div
						className={`text-2xl font-bold ${performance >= 0 ? 'text-green-600' : 'text-destructive'}`}
					>
						{performance >= 0 ? '+' : ''}
						{formatPercentage(performance)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

