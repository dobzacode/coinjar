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
import { useLocale, useTranslations } from 'next-intl'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

interface WealthEvolutionChartProps {
	data: Array<{
		date: string
		total: number
		livretA: number
		pee: number
		pea: number
	}>
}

export function WealthEvolutionChart({ data }: WealthEvolutionChartProps) {
	const t = useTranslations('dashboard')
	const locale = useLocale()

	const chartConfig = {
		total: {
			label: t('totalWealth'),
			color: 'hsl(var(--primary))',
		},
		livretA: {
			label: t('livretATitle'),
			color: 'hsl(142, 60%, 60%)',
		},
		pee: {
			label: t('peeTitle'),
			color: 'hsl(142, 70%, 45%)',
		},
		pea: {
			label: t('peaTitle'),
			color: 'hsl(142, 80%, 30%)',
		},
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('subtitle')}</CardTitle>
				<CardDescription>
					{data.length > 0
						? `${data[0].date} - ${data[data.length - 1].date}`
						: ''}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[300px] w-full">
					<AreaChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickFormatter={(value) => {
								const date = new Date(value)
								return date.toLocaleDateString(locale, {
									month: 'short',
									year: '2-digit',
								})
							}}
						/>
						<YAxis
							tickFormatter={(value) =>
								new Intl.NumberFormat(locale, {
									style: 'currency',
									currency: 'EUR',
									notation: 'compact',
								}).format(value)
							}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Area
							type="monotone"
							dataKey="pea"
							stackId="1"
							stroke={chartConfig.pea.color}
							fill={chartConfig.pea.color}
						/>
						<Area
							type="monotone"
							dataKey="pee"
							stackId="1"
							stroke={chartConfig.pee.color}
							fill={chartConfig.pee.color}
						/>
						<Area
							type="monotone"
							dataKey="livretA"
							stackId="1"
							stroke={chartConfig.livretA.color}
							fill={chartConfig.livretA.color}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
