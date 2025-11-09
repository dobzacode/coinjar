'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

interface PerformanceMetricsProps {
	peaPerformance: number
	peaGain: number
	livretAYield: number
	totalReturn: number
}

export function PerformanceMetrics({
	peaPerformance,
	peaGain,
	livretAYield,
	totalReturn,
}: PerformanceMetricsProps) {
	const t = useTranslations('dashboard')
	const locale = useLocale()

	const data = [
		{
			name: t('peaTitle'),
			value: peaPerformance,
			label: formatPercentage(peaPerformance),
		},
		{
			name: t('livretATitle'),
			value: livretAYield,
			label: formatPercentage(livretAYield),
		},
		{
			name: locale === 'fr' ? 'Rendement total' : 'Total return',
			value: totalReturn,
			label: formatPercentage(totalReturn),
		},
	]

	const chartConfig = {
		value: {
			label: locale === 'fr' ? 'Performance' : 'Performance',
			color: 'hsl(var(--primary))',
		},
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{locale === 'fr' ? 'Performance' : 'Performance'}
				</CardTitle>
				<CardDescription>
					{locale === 'fr'
						? 'Rendement de vos investissements'
						: 'Return on your investments'}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[300px] w-full">
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="name"
							tickFormatter={(value) => value.toString()}
						/>
						<YAxis
							tickFormatter={(value) => `${value.toFixed(1)}%`}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									formatter={(value) => `${(value as number).toFixed(2)}%`}
								/>
							}
						/>
						<Bar
							dataKey="value"
							fill="hsl(var(--primary))"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
				<div className="mt-4 grid grid-cols-2 gap-4">
					<div className="rounded-lg border bg-card p-3">
						<p className="text-sm text-muted-foreground">
							{locale === 'fr' ? 'Plus-value PEA' : 'PEA Capital Gain'}
						</p>
						<p
							className={`text-lg font-bold ${peaGain >= 0 ? 'text-green-600' : 'text-destructive'}`}
						>
							{peaGain >= 0 ? '+' : ''}
							{formatCurrency(peaGain)}
						</p>
					</div>
					<div className="rounded-lg border bg-card p-3">
						<p className="text-sm text-muted-foreground">
							{locale === 'fr' ? 'Performance PEA' : 'PEA Performance'}
						</p>
						<p
							className={`text-lg font-bold ${peaPerformance >= 0 ? 'text-green-600' : 'text-destructive'}`}
						>
							{peaPerformance >= 0 ? '+' : ''}
							{formatPercentage(peaPerformance)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

