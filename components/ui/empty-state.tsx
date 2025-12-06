import Link from 'next/link'

interface EmptyStateProps {
    icon: string
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
}

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref
}: EmptyStateProps) {
    return (
        <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-6">{description}</p>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors inline-block"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    )
}
