interface SkeletonProps {
    className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
    )
}

export function CardSkeleton() {
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    )
}

export function ListItemSkeleton() {
    return (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    )
}

export function StatCardSkeleton() {
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <Skeleton className="h-10 w-10 rounded mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-8 w-1/4" />
        </div>
    )
}

export function TableRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-gray-700">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6" />
        </div>
    )
}
