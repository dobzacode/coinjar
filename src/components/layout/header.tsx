'use client'

import { LanguagePicker } from '@/components/language-picker'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from '@/i18n/routing'
import { signOut, useSession } from '@/lib/auth/client'
import { Moon, Sun, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

export function Header() {
	const t = useTranslations('nav')
	const tTheme = useTranslations('theme')
	const { theme, setTheme } = useTheme()
	const { data: session } = useSession()
	const router = useRouter()

	async function handleSignOut() {
		await signOut()
		router.push('/login')
		router.refresh()
	}

	return (
		<header className="flex h-16 items-center justify-between border-b bg-background px-md">
			<div className="flex items-center gap-sm">
				<MobileNav />
				<div className="text-lg font-semibold lg:hidden">CoinJar</div>
			</div>
			<div className="flex-1" />
			<div className="flex items-center gap-sm">
				<LanguagePicker />

				<Button
					variant="ghost"
					size="icon"
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				>
					<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">{tTheme('toggleTheme')}</span>
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<User className="h-5 w-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>
							{session?.user?.name || session?.user?.email}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut}>
							{t('signOut')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
