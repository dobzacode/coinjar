import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { Outfit } from 'next/font/google'
import '../globals.css'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'CoinJar - Savings Tracker',
	description: 'Track your Livret A, PEE, and PEA investments',
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

interface RootLayoutProps {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

export default async function RootLayout({
	children,
	params,
}: RootLayoutProps) {
	const { locale } = await params
	setRequestLocale(locale)

	const messages = await getMessages()

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={outfit.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<NextIntlClientProvider messages={messages}>
						{children}
						<Toaster />
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
