'use client'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
            <div className="glass rounded-2xl p-12 max-w-lg text-center">
                <div className="text-6xl mb-6">⚠️</div>
                <h2 className="text-3xl font-bold text-white mb-4">Something went wrong!</h2>
                <p className="text-gray-400 mb-8">
                    {error.message || 'An unexpected error occurred'}
                </p>
                <button
                    onClick={reset}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}
