import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function InsightsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tvi3W
                            </Link>
                            <p className="text-sm text-gray-400 mt-1">Insights & Analytics</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400">Total Insights</h3>
                            <span className="text-2xl">✨</span>
                        </div>
                        <p className="text-3xl font-bold text-white">0</p>
                        <p className="text-xs text-green-400 mt-1">+0% from last week</p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400">Action Items</h3>
                            <span className="text-2xl">📋</span>
                        </div>
                        <p className="text-3xl font-bold text-white">0</p>
                        <p className="text-xs text-gray-500 mt-1">No pending actions</p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400">Patterns Detected</h3>
                            <span className="text-2xl">🔍</span>
                        </div>
                        <p className="text-3xl font-bold text-white">0</p>
                        <p className="text-xs text-gray-500 mt-1">Based on your meetings</p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400">Recommendations</h3>
                            <span className="text-2xl">💡</span>
                        </div>
                        <p className="text-3xl font-bold text-white">0</p>
                        <p className="text-xs text-gray-500 mt-1">AI-generated</p>
                    </div>
                </div>

                {/* Insights List */}
                <div className="glass-panel p-8 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Insights</h2>
                        <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                            <option>All Types</option>
                            <option>Questions</option>
                            <option>Actions</option>
                            <option>Patterns</option>
                            <option>Recommendations</option>
                        </select>
                    </div>

                    {/* Empty State */}
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No insights yet</h3>
                        <p className="text-gray-400 mb-6">Start meetings to generate AI-powered insights</p>
                        <Link
                            href="/meetings/new"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Start First Meeting
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
