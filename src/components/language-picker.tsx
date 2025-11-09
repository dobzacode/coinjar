'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/routing'
import { Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'

export function LanguagePicker() {
	const t = useTranslations('language')
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()
	const [open, setOpen] = useState(false)

	function handleLanguageChange(newLocale: 'en' | 'fr') {
		if (locale === newLocale) {
			setOpen(false)
			return
		}
		startTransition(() => {
			router.replace(pathname, { locale: newLocale })
		})
	}

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" disabled={isPending}>
					<Languages className="h-5 w-5" />
					<span className="sr-only">{t('selectLanguage')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onSelect={() => handleLanguageChange('en')}
					className={locale === 'en' ? 'bg-accent' : ''}
				>
					🇬🇧 {t('en')}
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={() => handleLanguageChange('fr')}
					className={locale === 'fr' ? 'bg-accent' : ''}
				>
					🇫🇷 {t('fr')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
