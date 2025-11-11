import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { LivretARateForm } from '@/features/livret-a/components/livret-a-rate-form'
import { LivretASkeleton } from '@/features/livret-a/components/livret-a-skeleton'
import { LivretATransactionForm } from '@/features/livret-a/components/livret-a-transaction-form'
import { TransactionList } from '@/features/livret-a/components/transaction-list'
import { requireAuthForPage } from '@/lib/auth/page-helpers'
import { getOrCreateLivretA } from '@/lib/services/account-service'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, Wallet } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cacheLife } from 'next/cache'
import { Suspense } from 'react'

interface LivretAPageProps {
	params: Promise<{ locale: string }>
}

async function LivretAContent() {
	'use cache: private'
	cacheLife({ stale: 60 })

	const t = await getTranslations('livretA')
	const userId = await requireAuthForPage()
	const userLivret = await getOrCreateLivretA(userId)

	const balance = parseFloat(userLivret.balance)
	const rate = parseFloat(userLivret.currentRate)

	return (
		<div className="space-y-sm">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-3xl font-bold">{t('title')}</h1>
					<p className="text-muted-foreground">{t('manageYourSavings')}</p>
				</div>
				<div className="flex gap-2">
					<LivretARateForm currentRate={rate} />
					<LivretATransactionForm />
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('currentBalance')}
						</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatCurrency(balance)}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('annualRate')}
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{rate.toFixed(3)}%</div>
						<p className="text-xs text-muted-foreground">
							{t('interestPaidOn')}
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{t('recentTransactions')}</CardTitle>
					<CardDescription>
						{t('transactionsHistoryDescription')}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<TransactionList transactions={userLivret.transactions} />
				</CardContent>
			</Card>
		</div>
	)
}

export default async function LivretAPage({ params }: LivretAPageProps) {
	const { locale } = await params
	setRequestLocale(locale)

	return (
		<Suspense fallback={<LivretASkeleton />}>
			<LivretAContent />
		</Suspense>
	)
}
