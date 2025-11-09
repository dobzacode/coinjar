'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { addTransaction } from '../actions'
import {
	createLivretATransactionSchema,
	type LivretATransactionInput,
} from '../schema'

export function LivretATransactionForm() {
	const [open, setOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const locale = useLocale()
	const t = useTranslations('livretA')
	const tCommon = useTranslations('common')
	const tValidation = useTranslations('validation')

	const form = useForm({
		resolver: zodResolver(createLivretATransactionSchema(tValidation)),
		defaultValues: {
			amount: '' as unknown as number,
			type: 'deposit',
			date: new Date().toISOString().split('T')[0],
			description: '',
		},
	})

	async function onSubmit(data: LivretATransactionInput) {
		setIsLoading(true)
		try {
			await addTransaction(data)

			toast.success(
				locale === 'fr'
					? 'Transaction ajoutée avec succès'
					: 'Transaction added successfully'
			)
			setOpen(false)
			form.reset()
		} catch (error) {
			console.error(error)
			toast.error(
				locale === 'fr'
					? "Erreur lors de l'ajout de la transaction"
					: 'Error adding transaction'
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					{t('addTransaction')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('addTransaction')}</DialogTitle>
					<DialogDescription>{t('description')}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('type')}</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="deposit">{t('deposit')}</SelectItem>
											<SelectItem value="withdrawal">
												{t('withdrawal')}
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('amount')}</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											placeholder="0.00"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('date')}</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{locale === 'fr'
											? 'Description (optionnel)'
											: 'Description (optional)'}
									</FormLabel>
									<FormControl>
										<Input
											placeholder={locale === 'fr' ? 'Note...' : 'Note...'}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								{tCommon('cancel')}
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? tCommon('loading') : tCommon('save')}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
