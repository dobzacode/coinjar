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
import { useLocale, useTranslations } from 'next-intl'
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
	const [isLoading, setIsLoading] = useState(false)

	const locale = useLocale()
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
		setIsLoading(true)
		try {
			await updateRate(data)

			toast.success(
				locale === 'fr'
					? 'Taux mis à jour avec succès'
					: 'Rate updated successfully'
			)
			setOpen(false)
		} catch (error) {
			console.error(error)
			toast.error(
				locale === 'fr'
					? 'Erreur lors de la mise à jour du taux'
					: 'Error updating rate'
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Settings className="mr-2 h-4 w-4" />
					{t('updateRate')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{locale === 'fr'
							? "Modifier le taux d'intérêt"
							: 'Update interest rate'}
					</DialogTitle>
					<DialogDescription>
						{locale === 'fr'
							? 'Mettez à jour le taux annuel du Livret A'
							: 'Update the annual rate of Livret A'}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="rate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{locale === 'fr' ? 'Taux annuel (%)' : 'Annual rate (%)'}
									</FormLabel>
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
