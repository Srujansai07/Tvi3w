import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-9xl font-bold text-gray-700 mb-4">404</div>
                <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
                <p className="text-gray-400 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">Go to Dashboard</Link>
                    <Link href="/" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors">Home</Link>
                </div>
            </div>
        </div>
    )
}
