export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-border rounded ${className}`} />
    )
}

export function CardSkeleton() {
    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 h-full w-full">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-24" />
        </div>
    )
}