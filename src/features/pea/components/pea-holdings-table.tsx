import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { calculateHoldingPerformance } from '@/features/pea/calculations'
import type { PeaHolding } from '@/lib/db/schema'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface PeaHoldingsTableProps {
	holdings: PeaHolding[]
}

export function PeaHoldingsTable({ holdings }: PeaHoldingsTableProps) {
	const t = useTranslations('pea')

	if (holdings.length === 0) {
		return (
			<p className="text-center text-muted-foreground">{t('noHoldingsYet')}</p>
		)
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t('name')}</TableHead>
					<TableHead>{t('isin')}</TableHead>
					<TableHead className="text-right">{t('shares')}</TableHead>
					<TableHead className="text-right">{t('purchasePrice')}</TableHead>
					<TableHead className="text-right">{t('currentPrice')}</TableHead>
					<TableHead className="text-right">{t('value')}</TableHead>
					<TableHead className="text-right">{t('capitalGainShort')}</TableHead>
					<TableHead className="text-right">{t('performance')}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{holdings.map((holding) => {
					const perf = calculateHoldingPerformance(holding)
					return (
						<TableRow key={holding.id}>
							<TableCell className="font-medium">{holding.name}</TableCell>
							<TableCell className="text-muted-foreground">
								{holding.isin}
							</TableCell>
							<TableCell className="text-right">
								{parseFloat(holding.shares).toFixed(6)}
							</TableCell>
							<TableCell className="text-right">
								{formatCurrency(holding.purchasePrice)}
							</TableCell>
							<TableCell className="text-right">
								{holding.lastUpdatedPrice
									? formatCurrency(holding.lastUpdatedPrice)
									: '-'}
							</TableCell>
							<TableCell className="text-right font-medium">
								{formatCurrency(perf.currentValue)}
							</TableCell>
							<TableCell
								className={`text-right font-medium ${perf.gain >= 0 ? 'text-green-600' : 'text-destructive'}`}
							>
								{perf.gain >= 0 ? '+' : ''}
								{formatCurrency(perf.gain)}
							</TableCell>
							<TableCell
								className={`text-right font-medium ${perf.performance >= 0 ? 'text-green-600' : 'text-destructive'}`}
							>
								{perf.performance >= 0 ? '+' : ''}
								{formatPercentage(perf.performance)}
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}

