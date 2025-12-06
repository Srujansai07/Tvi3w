'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Global error:', error)
    }, [error])

    return (
        <html>
            <body className="bg-gray-900">
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="text-6xl mb-4">💥</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
                        <p className="text-gray-400 mb-6">
                            {error.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={reset}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
