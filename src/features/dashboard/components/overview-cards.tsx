import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { Building, PiggyBank, TrendingUp, Wallet } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface OverviewCardsProps {
	totalBalance: number
	totalGain: number
	performance: number
	livretABalance: number
	livretARate: string | null
	peeValue: number
	peeShares: string | null
}

export function OverviewCards({
	totalBalance,
	totalGain,
	performance,
	livretABalance,
	livretARate,
	peeValue,
	peeShares,
}: OverviewCardsProps) {
	const t = useTranslations('dashboard')

	return (
		<div className="grid gap-sm md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-sm">
					<CardTitle className="text-sm font-medium">
						{t('totalWealth')}
					</CardTitle>
					<Wallet className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
					<p className="mt-1 text-xs text-muted-foreground">
						{t('allSavings')}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-sm">
					<CardTitle className="text-sm font-medium">{t('peaGain')}</CardTitle>
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div
						className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-destructive'}`}
					>
						{totalGain >= 0 ? '+' : ''}
						{formatCurrency(totalGain)}
					</div>
					<p className="mt-1 text-xs text-muted-foreground">
						{totalGain >= 0 ? '+' : ''}
						{formatPercentage(performance)}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-sm">
					<CardTitle className="text-sm font-medium">
						{t('livretATitle')}
					</CardTitle>
					<PiggyBank className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatCurrency(livretABalance)}
					</div>
					<p className="mt-1 text-xs text-muted-foreground">
						{livretARate
							? `${t('rate')}: ${parseFloat(livretARate).toFixed(3)}%`
							: t('notConfigured')}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-sm">
					<CardTitle className="text-sm font-medium">{t('peeTitle')}</CardTitle>
					<Building className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{formatCurrency(peeValue)}</div>
					<p className="mt-1 text-xs text-muted-foreground">
						{peeShares
							? `${parseFloat(peeShares).toFixed(2)} ${t('shares')}`
							: t('notConfigured')}
					</p>
				</CardContent>
			</Card>
		</div>
	)
}

