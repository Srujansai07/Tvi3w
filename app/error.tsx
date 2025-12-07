'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
                <p className="text-gray-400 mb-6">{error.message || 'An unexpected error occurred'}</p>
                <button onClick={reset} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">Try Again</button>
            </div>
        </div>
    )
}
