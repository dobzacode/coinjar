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
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updateRate } from '../actions'
import { createLivretARateSchema, type LivretARateInput } from '../schema'

interface LivretARateFormProps {
	currentRate: number
}

export function LivretARateForm({ currentRate }: LivretARateFormProps) {
	const [open, setOpen] = useState(false)
	const t = useTranslations('livretA')
	const tCommon = useTranslations('common')
	const tValidation = useTranslations('validation')

	const form = useForm({
		resolver: zodResolver(createLivretARateSchema(tValidation)),
		defaultValues: {
			rate: currentRate || ('' as unknown as number),
		},
	})

	async function onSubmit(data: LivretARateInput) {
		try {
			await updateRate(data)
			toast.success(t('rateUpdatedSuccess'))
			setOpen(false)
		} catch (error) {
			console.error(error)
			toast.error(t('errorUpdatingRate'))
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full sm:w-auto">
					<Settings className="mr-2 h-4 w-4" />
					{t('updateRate')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('updateInterestRate')}</DialogTitle>
					<DialogDescription>
						{t('updateInterestRateDescription')}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="rate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('annualRateLabel')}</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.001"
											placeholder="3.000"
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
							<Button type="submit" disabled={form.formState.isSubmitting}>
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
