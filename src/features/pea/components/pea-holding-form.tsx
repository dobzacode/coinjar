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
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { addHolding } from '../actions'
import { createPeaHoldingSchema, type PeaHoldingInput } from '../schema'

export function PeaHoldingForm() {
	const [open, setOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isValidatingIsin, setIsValidatingIsin] = useState(false)
	const [isinError, setIsinError] = useState<string | null>(null)
	const locale = useLocale()
	const t = useTranslations('pea')
	const tCommon = useTranslations('common')
	const tValidation = useTranslations('validation')

	const form = useForm({
		resolver: zodResolver(createPeaHoldingSchema(tValidation)),
		defaultValues: {
			isin: '',
			name: '',
			shares: '' as unknown as number,
			purchasePrice: '' as unknown as number,
			purchaseDate: new Date().toISOString().split('T')[0],
		},
	})

	const isinValue = form.watch('isin')

	useEffect(() => {
		if (isinValue && isinValue.length === 12) {
			const timeoutId = setTimeout(async () => {
				setIsValidatingIsin(true)
				setIsinError(null)
				try {
					const response = await fetch(`/api/validate-isin?isin=${isinValue}`)
					if (!response.ok) {
						setIsinError(
							locale === 'fr'
								? 'ISIN invalide ou introuvable'
								: 'Invalid or not found ISIN'
						)
					} else {
						const data = await response.json()
						if (data.name && !form.getValues('name')) {
							form.setValue('name', data.name)
						}
					}
				} catch (error) {
					console.error('ISIN validation error:', error)
					setIsinError(
						locale === 'fr'
							? 'Erreur lors de la validation'
							: 'Validation error'
					)
				} finally {
					setIsValidatingIsin(false)
				}
			}, 500)

			return () => clearTimeout(timeoutId)
		} else {
			setIsinError(null)
		}
	}, [isinValue, form, locale])

	async function onSubmit(data: PeaHoldingInput) {
		if (isinError) {
			toast.error(isinError)
			return
		}

		setIsLoading(true)
		try {
			await addHolding(data)
			toast.success(
				locale === 'fr'
					? 'Titre ajouté avec succès'
					: 'Holding added successfully'
			)
			setOpen(false)
			form.reset()
		} catch (error) {
			console.error(error)
			toast.error(
				locale === 'fr'
					? "Erreur lors de l'ajout du titre"
					: 'Error adding holding'
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
					{t('addHolding')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('addHolding')}</DialogTitle>
					<DialogDescription>{t('description')}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="isin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{locale === 'fr' ? 'Code ISIN' : 'ISIN Code'}
									</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												placeholder="FR0000000000"
												maxLength={12}
												{...field}
											/>
											{isValidatingIsin && (
												<Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
											)}
										</div>
									</FormControl>
									{isinError && (
										<p className="text-sm text-destructive">{isinError}</p>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{locale === 'fr' ? 'Nom du titre' : 'Security name'}
									</FormLabel>
									<FormControl>
										<Input
											placeholder={locale === 'fr' ? 'ETF World' : 'World ETF'}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="shares"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('quantity')}</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.000001"
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
							name="purchasePrice"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('purchasePrice')}</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.0001"
											placeholder="0.0000"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="purchaseDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{locale === 'fr' ? "Date d'achat" : 'Purchase date'}
									</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
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
							<Button
								type="submit"
								disabled={isLoading || isValidatingIsin || !!isinError}
							>
								{isLoading ? tCommon('loading') : tCommon('save')}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
