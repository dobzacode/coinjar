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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import { useTranslations } from 'next-intl'
import { Cell, Pie, PieChart } from 'recharts'

interface AssetAllocationChartProps {
	livretA: number
	pee: number
	pea: number
}

export function AssetAllocationChart({
	livretA,
	pee,
	pea,
}: AssetAllocationChartProps) {
	const t = useTranslations('dashboard')
	const total = livretA + pee + pea

	const data = [
		{
			name: t('livretATitle'),
			value: livretA,
			percentage: total > 0 ? (livretA / total) * 100 : 0,
		},
		{
			name: t('peeTitle'),
			value: pee,
			percentage: total > 0 ? (pee / total) * 100 : 0,
		},
		{
			name: t('peaTitle'),
			value: pea,
			percentage: total > 0 ? (pea / total) * 100 : 0,
		},
	].filter((item) => item.value > 0)

	const COLORS = ['hsl(142, 60%, 60%)', 'hsl(142, 70%, 45%)', 'hsl(142, 80%, 30%)']

	const chartConfig = {
		value: {
			label: t('value'),
		},
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('assetAllocation')}</CardTitle>
				<CardDescription>{t('assetAllocationDescription')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[300px] w-full">
					<PieChart>
						<ChartTooltip
							content={
								<ChartTooltipContent
									formatter={(value, name) => (
										<div className="flex items-center justify-between gap-2">
											<span>{name}:</span>
											<span className="font-bold">
												{new Intl.NumberFormat('fr-FR', {
													style: 'currency',
													currency: 'EUR',
												}).format(value as number)}
											</span>
										</div>
									)}
								/>
							}
						/>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={({
								cx,
								cy,
								midAngle,
								innerRadius,
								outerRadius,
								percentage,
							}) => {
								const radius = innerRadius + (outerRadius - innerRadius) * 0.5
								const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
								const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

								return (
									<text
										x={x}
										y={y}
										fill="white"
										textAnchor={x > cx ? 'start' : 'end'}
										dominantBaseline="central"
										className="text-sm font-bold"
									>
										{`${percentage.toFixed(0)}%`}
									</text>
								)
							}}
							outerRadius={100}
							fill="#8884d8"
							dataKey="value"
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<ChartLegend content={<ChartLegendContent />} />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

