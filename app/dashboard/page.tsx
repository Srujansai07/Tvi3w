import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tvi3W
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">Welcome back, {session.user.name}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                + New Meeting
                            </button>
                            <img
                                src={session.user.image || '/default-avatar.png'}
                                alt={session.user.name || 'User'}
                                className="w-10 h-10 rounded-full border-2 border-gray-700"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400">Total Meetings</h3>
                            <span className="text-2xl">🎤</span>
                        </div>
                        <p className="text-3xl font-bold text-white">0</p>
                        <p className="text-xs text-gray-500 mt-1">No meetings yet</p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400">AI Questions</h3>
                            <span className="text-2xl">💡</span>
                        </div>
                        <p className="text-3xl font-bold text-white">0</p>
                        <p className="text-xs text-gray-500 mt-1">Generated questions</p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400">Contacts</h3>
                            <span className="text-2xl">👥</span>
                        </div>
                        <p className="text-3xl font-bold text-white">0</p>
                        <p className="text-xs text-gray-500 mt-1">Saved contacts</p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400">Insights</h3>
                            <span className="text-2xl">✨</span>
                        </div>
                        <p className="text-3xl font-bold text-white">0</p>
                        <p className="text-xs text-gray-500 mt-1">AI-generated</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <button className="glass-panel p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all text-left group">
                        <div className="text-3xl mb-3">🎙️</div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            Start Live Meeting
                        </h3>
                        <p className="text-sm text-gray-400">
                            Begin a new meeting with AI transcription and question suggestions
                        </p>
                    </button>

                    <button className="glass-panel p-6 rounded-xl border border-gray-800 hover:border-purple-500 transition-all text-left group">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            Analyze Content
                        </h3>
                        <p className="text-sm text-gray-400">
                            Get AI insights from LinkedIn, Twitter, or articles
                        </p>
                    </button>

                    <button className="glass-panel p-6 rounded-xl border border-gray-800 hover:border-pink-500 transition-all text-left group">
                        <div className="text-3xl mb-3">👤</div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
                            Add Contact
                        </h3>
                        <p className="text-sm text-gray-400">
                            Track relationships and interactions with your network
                        </p>
                    </button>
                </div>

                {/* Recent Activity */}
                <div className="glass-panel p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-400 mb-2">No activity yet</p>
                        <p className="text-sm text-gray-500">Start your first meeting to see activity here</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
