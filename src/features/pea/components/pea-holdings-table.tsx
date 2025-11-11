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
import { getTranslations } from 'next-intl/server'

interface PeaHoldingsTableProps {
	holdings: PeaHolding[]
}

export async function PeaHoldingsTable({ holdings }: PeaHoldingsTableProps) {
	const t = await getTranslations('pea')

	if (holdings.length === 0) {
		return (
			<p className="text-center text-muted-foreground">{t('noHoldingsYet')}</p>
		)
	}

	return (
		<>
			<div className="hidden lg:block">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t('name')}</TableHead>
							<TableHead>{t('isin')}</TableHead>
							<TableHead className="text-right">{t('shares')}</TableHead>
							<TableHead className="text-right">{t('purchasePrice')}</TableHead>
							<TableHead className="text-right">{t('currentPrice')}</TableHead>
							<TableHead className="text-right">{t('value')}</TableHead>
							<TableHead className="text-right">
								{t('capitalGainShort')}
							</TableHead>
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
			</div>

			<div className="space-y-3 lg:hidden">
				{holdings.map((holding) => {
					const perf = calculateHoldingPerformance(holding)
					return (
						<div
							key={holding.id}
							className="rounded-lg border bg-card p-4 text-card-foreground"
						>
							<div className="mb-3">
								<h3 className="font-semibold">{holding.name}</h3>
								<p className="text-sm text-muted-foreground">{holding.isin}</p>
							</div>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">{t('shares')}:</span>
									<span className="font-medium">
										{parseFloat(holding.shares).toFixed(6)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">
										{t('purchasePrice')}:
									</span>
									<span className="font-medium">
										{formatCurrency(holding.purchasePrice)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">
										{t('currentPrice')}:
									</span>
									<span className="font-medium">
										{holding.lastUpdatedPrice
											? formatCurrency(holding.lastUpdatedPrice)
											: '-'}
									</span>
								</div>
								<div className="flex justify-between border-t pt-2">
									<span className="text-muted-foreground">{t('value')}:</span>
									<span className="font-semibold">
										{formatCurrency(perf.currentValue)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">
										{t('capitalGainShort')}:
									</span>
									<span
										className={`font-semibold ${perf.gain >= 0 ? 'text-green-600' : 'text-destructive'}`}
									>
										{perf.gain >= 0 ? '+' : ''}
										{formatCurrency(perf.gain)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">
										{t('performance')}:
									</span>
									<span
										className={`font-semibold ${perf.performance >= 0 ? 'text-green-600' : 'text-destructive'}`}
									>
										{perf.performance >= 0 ? '+' : ''}
										{formatPercentage(perf.performance)}
									</span>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}
