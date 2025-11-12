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
import { useQuery } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { addHolding } from '../actions'
import { createPeaHoldingSchema, type PeaHoldingInput } from '../schema'

async function validateIsin(isin: string) {
	const response = await fetch(`/api/validate-isin?isin=${isin}`)
	if (!response.ok) {
		throw new Error('Invalid ISIN')
	}
	return response.json()
}

export function PeaHoldingForm() {
	const [open, setOpen] = useState(false)
	const [debouncedIsin, setDebouncedIsin] = useState('')
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

	const {
		data: isinData,
		isLoading: isValidatingIsin,
		error: isinError,
	} = useQuery({
		queryKey: ['validate-isin', debouncedIsin],
		queryFn: () => validateIsin(debouncedIsin),
		enabled: debouncedIsin.length === 12,
		retry: false,
	})

	useEffect(() => {
		if (isinValue && isinValue.length === 12) {
			const timeoutId = setTimeout(() => {
				setDebouncedIsin(isinValue)
			}, 500)
			return () => clearTimeout(timeoutId)
		} else {
			setDebouncedIsin('')
		}
	}, [isinValue])

	useEffect(() => {
		if (isinData?.name && !form.getValues('name')) {
			form.setValue('name', isinData.name)
		}
	}, [isinData, form])

	async function onSubmit(data: PeaHoldingInput) {
		if (isinError) {
			toast.error(t('isinInvalidOrNotFound'))
			return
		}

		try {
			await addHolding(data)
			toast.success(t('holdingAddedSuccess'))
			setOpen(false)
			form.reset()
		} catch (error) {
			console.error(error)
			toast.error(t('errorAddingHolding'))
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-full sm:w-auto">
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
									<FormLabel>{t('isinCode')}</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												placeholder={t('isinPlaceholder')}
												maxLength={12}
												{...field}
											/>
											{isValidatingIsin && (
												<Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
											)}
										</div>
									</FormControl>
									{isinError && (
										<p className="text-sm text-destructive">
											{t('isinInvalidOrNotFound')}
										</p>
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
									<FormLabel>{t('securityName')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('securityNamePlaceholder')}
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
									<FormLabel>{t('purchaseDate')}</FormLabel>
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
								disabled={
									form.formState.isSubmitting || isValidatingIsin || !!isinError
								}
							>
								{form.formState.isSubmitting
									? tCommon('loading')
									: tCommon('save')}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export const PeaHoldingFormDynamic = dynamic(
	() =>
		import('./pea-holding-form').then((mod) => ({
			default: mod.PeaHoldingForm,
		})),
	{ ssr: false }
)
