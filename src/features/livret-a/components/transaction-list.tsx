import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { LivretATransaction } from '@/lib/db/schema'
import { translateTransactionType } from '@/lib/i18n/type-translators'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getAmountColor, getAmountPrefix } from '@/lib/utils/styling'
import { getTranslations } from 'next-intl/server'

interface TransactionListProps {
	transactions: LivretATransaction[]
}

export async function TransactionList({ transactions }: TransactionListProps) {
	const t = await getTranslations('livretA')

	if (transactions.length === 0) {
		return (
			<p className="text-center text-muted-foreground">{t('noTransactions')}</p>
		)
	}

	return (
		<>
			<div className="hidden md:block">
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
						{transactions.map((transaction) => (
							<TableRow key={transaction.id}>
								<TableCell>{formatDate(transaction.date, 'short')}</TableCell>
								<TableCell className="capitalize">
									{translateTransactionType(transaction.type, t)}
								</TableCell>
								<TableCell className="text-muted-foreground">
									{transaction.description || '-'}
								</TableCell>
								<TableCell
									className={`text-right font-medium ${getAmountColor(
										transaction.type as 'deposit' | 'withdrawal' | 'interest'
									)}`}
								>
									{getAmountPrefix(
										transaction.type as 'deposit' | 'withdrawal' | 'interest'
									)}
									{formatCurrency(transaction.amount)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="space-y-3 md:hidden">
				{transactions.map((transaction) => (
					<div
						key={transaction.id}
						className="rounded-lg border bg-card p-4 text-card-foreground"
					>
						<div className="mb-2 flex items-start justify-between">
							<div>
								<p className="text-sm text-muted-foreground">
									{formatDate(transaction.date, 'short')}
								</p>
								<p className="font-medium capitalize">
									{translateTransactionType(transaction.type, t)}
								</p>
							</div>
							<p
								className={`text-lg font-bold ${getAmountColor(
									transaction.type as 'deposit' | 'withdrawal' | 'interest'
								)}`}
							>
								{getAmountPrefix(
									transaction.type as 'deposit' | 'withdrawal' | 'interest'
								)}
								{formatCurrency(transaction.amount)}
							</p>
						</div>
						{transaction.description && (
							<p className="text-sm text-muted-foreground">
								{transaction.description}
							</p>
						)}
					</div>
				))}
			</div>
		</>
	)
}
