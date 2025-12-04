import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
            <div className="glass rounded-2xl p-12 max-w-lg text-center">
                <div className="text-8xl mb-6">404</div>
                <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-gray-400 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}
