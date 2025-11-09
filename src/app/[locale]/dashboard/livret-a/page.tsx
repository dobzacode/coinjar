import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { LivretARateForm } from '@/features/livret-a/components/livret-a-rate-form'
import { LivretASkeleton } from '@/features/livret-a/components/livret-a-skeleton'
import { LivretATransactionForm } from '@/features/livret-a/components/livret-a-transaction-form'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { livretA } from '@/lib/db/schema'
import { formatCurrency, formatDate } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { TrendingUp, Wallet } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

interface LivretAPageProps {
	params: Promise<{ locale: string }>
}

async function LivretAContent() {
	const t = await getTranslations('livretA')
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user?.id) {
		redirect('/login')
	}

	let userLivret = await db.query.livretA.findFirst({
		where: eq(livretA.userId, session.user.id),
		with: {
			transactions: {
				orderBy: (transactions, { desc }) => [desc(transactions.date)],
				limit: 10,
			},
		},
	})

	if (!userLivret) {
		const [newLivret] = await db
			.insert(livretA)
			.values({
				userId: session.user.id,
				balance: '0.00',
				currentRate: '3.000',
			})
			.returning()

		userLivret = { ...newLivret, transactions: [] }
	}

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
					{userLivret.transactions.length === 0 ? (
						<p className="text-center text-muted-foreground">
							{t('noTransactions')}
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t('date')}</TableHead>
									<TableHead>{t('type')}</TableHead>
									<TableHead>Description</TableHead>
									<TableHead className="text-right">{t('amount')}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{userLivret.transactions.map((transaction) => (
									<TableRow key={transaction.id}>
										<TableCell>
											{formatDate(transaction.date, 'short')}
										</TableCell>
										<TableCell className="capitalize">
											{transaction.type === 'deposit'
												? t('deposit')
												: transaction.type === 'withdrawal'
													? t('withdrawal')
													: t('interest')}
										</TableCell>
										<TableCell className="text-muted-foreground">
											{transaction.description || '-'}
										</TableCell>
										<TableCell
											className={`text-right font-medium ${
												transaction.type === 'withdrawal'
													? 'text-destructive'
													: 'text-green-600'
											}`}
										>
											{transaction.type === 'withdrawal' ? '-' : '+'}
											{formatCurrency(transaction.amount)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
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
