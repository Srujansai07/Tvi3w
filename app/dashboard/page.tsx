import Card from '@/components/Card'

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back! Here&apos;s your overview</p>
                </header>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="glass rounded-xl p-6">
                        <div className="text-sm text-gray-400 mb-2">Total Analyses</div>
                        <div className="text-3xl font-bold text-white">24</div>
                        <div className="text-xs text-green-400 mt-2">↑ 12% this week</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-sm text-gray-400 mb-2">Meetings</div>
                        <div className="text-3xl font-bold text-white">8</div>
                        <div className="text-xs text-blue-400 mt-2">3 upcoming</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-sm text-gray-400 mb-2">Business Pitches</div>
                        <div className="text-3xl font-bold text-white">5</div>
                        <div className="text-xs text-purple-400 mt-2">2 in review</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-sm text-gray-400 mb-2">AI Insights</div>
                        <div className="text-3xl font-bold text-white">156</div>
                        <div className="text-xs text-yellow-400 mt-2">Generated</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a href="/analysis" className="glass rounded-xl p-8 hover:scale-105 transition-transform cursor-pointer">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-white mb-2">New Analysis</h3>
                        <p className="text-gray-400 text-sm">Analyze content with AI-powered insights</p>
                    </a>

                    <a href="/meetings" className="glass rounded-xl p-8 hover:scale-105 transition-transform cursor-pointer">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-white mb-2">Start Meeting</h3>
                        <p className="text-gray-400 text-sm">Launch your AI meeting companion</p>
                    </a>

                    <a href="/business" className="glass rounded-xl p-8 hover:scale-105 transition-transform cursor-pointer">
                        <div className="text-4xl mb-4">💼</div>
                        <h3 className="text-xl font-bold text-white mb-2">Pitch Analysis</h3>
                        <p className="text-gray-400 text-sm">Get Shark Tank-style feedback</p>
                    </a>
                </div>

                {/* Recent Activity */}
                <div className="mt-12 glass rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b border-gray-700 pb-4">
                                <div>
                                    <div className="text-white font-medium">Analysis #{i}</div>
                                    <div className="text-sm text-gray-400">2 hours ago</div>
                                </div>
                                <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                    Completed
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
