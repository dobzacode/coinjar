import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AccountCardsSkeleton() {
	return (
		<div className="grid gap-sm md:grid-cols-3">
			{[...Array(3)].map((_, i) => (
				<Card key={i}>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Skeleton className="h-6 w-24" />
								<Skeleton className="mt-sm h-4 w-32" />
							</div>
							<Skeleton className="h-8 w-8" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-sm">
							<div className="flex justify-between">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-24" />
							</div>
							<div className="flex justify-between">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-20" />
							</div>
						</div>
						<Skeleton className="mt-sm h-9 w-full" />
					</CardContent>
				</Card>
			))}
		</div>
	)
}


