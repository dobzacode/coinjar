'use client'

import { Link, usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import {
	Building,
	LayoutDashboard,
	PiggyBank,
	TrendingUp,
	Wallet,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Sidebar() {
	const t = useTranslations('nav')
	const pathname = usePathname()

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
		<aside className="hidden w-64 border-r bg-muted/40 lg:block">
			<div className="flex h-full flex-col">
				<div className="flex h-16 items-center border-b px-md">
					<Wallet className="mr-sm h-6 w-6" />
					<span className="text-lg font-semibold">CoinJar</span>
				</div>
				<nav className="flex-1 space-y-1 p-sm">
					{navItems.map((item) => {
						const Icon = item.icon
						const isActive = pathname === item.href
						return (
							<Link
								prefetch={true}
								key={item.href}
								href={item.href}
								className={cn(
									'flex items-center gap-sm rounded-md px-sm py-sm text-sm font-medium transition-colors',
									isActive
										? 'bg-primary text-primary-foreground'
										: 'text-muted-foreground hover:bg-muted hover:text-foreground'
								)}
							>
								<Icon className="h-5 w-5" />
								{t(item.titleKey as 'dashboard' | 'livretA' | 'pee' | 'pea')}
							</Link>
						)
					})}
				</nav>
			</div>
		</aside>
	)
}
