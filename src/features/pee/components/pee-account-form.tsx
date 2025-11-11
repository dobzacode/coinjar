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
import { updatePeeAccount } from '../actions'
import { createPeeAccountSchema, type PeeAccountInput } from '../schema'

interface PeeAccountFormProps {
	companyName: string
	sharePrice: number
}

export function PeeAccountForm({
	companyName,
	sharePrice,
}: PeeAccountFormProps) {
	const [open, setOpen] = useState(false)
	const t = useTranslations('pee')
	const tCommon = useTranslations('common')
	const tValidation = useTranslations('validation')

	const form = useForm({
		resolver: zodResolver(createPeeAccountSchema(tValidation)),
		defaultValues: {
			companyName,
			sharePrice: sharePrice || ('' as unknown as number),
		},
	})

	async function onSubmit(data: PeeAccountInput) {
		try {
			await updatePeeAccount(data)
			toast.success(t('accountUpdatedSuccess'))
			setOpen(false)
		} catch (error) {
			console.error(error)
			toast.error(t('errorUpdatingAccount'))
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Settings className="mr-2 h-4 w-4" />
					{t('updateSharePrice')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('updatePeeAccount')}</DialogTitle>
					<DialogDescription>
						{t('updatePeeAccountDescription')}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="companyName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('companyName')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('companyNamePlaceholder')}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sharePrice"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('sharePrice')}</FormLabel>
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
