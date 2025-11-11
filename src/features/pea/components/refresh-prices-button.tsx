'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { refreshPrices } from '../actions'

export function RefreshPricesButton() {
	const [isLoading, setIsLoading] = useState(false)
	const t = useTranslations('pea')
	const router = useRouter()

	async function handleRefresh() {
		setIsLoading(true)
		try {
			await refreshPrices()
			router.refresh()
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
			<RefreshCw
				className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
			/>
			{isLoading ? t('refreshing') : t('refreshPrices')}
		</Button>
	)
}
