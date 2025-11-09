import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Link } from '@/i18n/routing'
import { formatCurrency } from '@/lib/utils'
import { BarChart3, Building, PiggyBank } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface AccountCardsProps {
	livretABalance: number
	livretARate: string | null
	peeValue: number
	peeShares: string | null
	peaValue: number
	peaGain: number
}

export function AccountCards({
	livretABalance,
	livretARate,
	peeValue,
	peeShares,
	peaValue,
	peaGain,
}: AccountCardsProps) {
	const t = useTranslations('dashboard')

	return (
		<div className="grid gap-sm md:grid-cols-3">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{t('livretATitle')}</CardTitle>
							<CardDescription>{t('livretADescription')}</CardDescription>
						</div>
						<PiggyBank className="h-8 w-8 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-sm">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">
								{t('balance')}
							</span>
							<span className="font-medium">
								{formatCurrency(livretABalance)}
							</span>
						</div>
						{livretARate && (
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">
									{t('rate')}
								</span>
								<span className="font-medium">
									{parseFloat(livretARate).toFixed(3)}%
								</span>
							</div>
						)}
					</div>
					<Link href="/dashboard/livret-a">
						<Button className="mt-sm w-full" variant="outline" size="sm">
							{t('manage')}
						</Button>
					</Link>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{t('peeTitle')}</CardTitle>
							<CardDescription>{t('peeDescription')}</CardDescription>
						</div>
						<Building className="h-8 w-8 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-sm">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">
								{t('value')}
							</span>
							<span className="font-medium">{formatCurrency(peeValue)}</span>
						</div>
						{peeShares && (
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">
									{t('shares')}
								</span>
								<span className="font-medium">
									{parseFloat(peeShares).toFixed(2)}
								</span>
							</div>
						)}
					</div>
					<Link href="/dashboard/pee">
						<Button className="mt-sm w-full" variant="outline" size="sm">
							{t('manage')}
						</Button>
					</Link>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{t('peaTitle')}</CardTitle>
							<CardDescription>{t('peaDescription')}</CardDescription>
						</div>
						<BarChart3 className="h-8 w-8 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-sm">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">
								{t('value')}
							</span>
							<span className="font-medium">{formatCurrency(peaValue)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">
								{t('capitalGain')}
							</span>
							<span
								className={`font-medium ${peaGain >= 0 ? 'text-green-600' : 'text-destructive'}`}
							>
								{peaGain >= 0 ? '+' : ''}
								{formatCurrency(peaGain)}
							</span>
						</div>
					</div>
					<Link href="/dashboard/pea">
						<Button className="mt-sm w-full" variant="outline" size="sm">
							{t('manage')}
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	)
}


