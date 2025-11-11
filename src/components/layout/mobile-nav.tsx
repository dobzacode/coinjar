'use client'

import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Link, usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import {
	Building,
	LayoutDashboard,
	Menu,
	PiggyBank,
	TrendingUp,
	Wallet,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function MobileNav() {
	const t = useTranslations('nav')
	const pathname = usePathname()
	const [open, setOpen] = useState(false)

	const navItems = [
		{
			titleKey: 'dashboard',
			href: '/dashboard',
			icon: LayoutDashboard,
		},
		{
			titleKey: 'livretA',
			href: '/dashboard/livret-a',
			icon: PiggyBank,
		},
		{
			titleKey: 'pee',
			href: '/dashboard/pee',
			icon: Building,
		},
		{
			titleKey: 'pea',
			href: '/dashboard/pea',
			icon: TrendingUp,
		},
	]

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-64">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2 text-left">
						<Wallet className="h-6 w-6 flex-shrink-0" />
						<span className="text-lg font-semibold">CoinJar</span>
					</SheetTitle>
				</SheetHeader>
				<nav className="mt-6 space-y-1">
					{navItems.map((item) => {
						const Icon = item.icon
						const isActive = pathname === item.href
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setOpen(false)}
								className={cn(
									'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
									isActive
										? 'bg-primary text-primary-foreground'
										: 'text-muted-foreground hover:bg-muted hover:text-foreground'
								)}
							>
								<Icon className="h-5 w-5 flex-shrink-0" />
								<span>
									{t(item.titleKey as 'dashboard' | 'livretA' | 'pee' | 'pea')}
								</span>
							</Link>
						)
					})}
				</nav>
			</SheetContent>
		</Sheet>
	)
}
