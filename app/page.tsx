export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Tvi3W
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Your AI-Powered Personal Assistant
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="/dashboard"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                        >
                            Get Started
                        </a>
                        <a
                            href="/analysis"
                            className="px-8 py-3 glass text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                        >
                            Try Analysis
                        </a>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    {/* Analysis Card */}
                    <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-2xl font-bold text-white mb-3">Analysis</h3>
                        <p className="text-gray-300">
                            AI-powered content analysis with sentiment detection and key insights extraction
                        </p>
                    </div>

                    {/* Meetings Card */}
                    <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold text-white mb-3">Meetings</h3>
                        <p className="text-gray-300">
                            Real-time meeting companion with dynamic question generation and note-taking
                        </p>
                    </div>

                    {/* Business Card */}
                    <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
                        <div className="text-4xl mb-4">💼</div>
                        <h3 className="text-2xl font-bold text-white mb-3">Business</h3>
                        <p className="text-gray-300">
                            Shark Tank-style pitch analysis and business insights for entrepreneurs
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-20 glass rounded-2xl p-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-400 mb-2">10+</div>
                            <div className="text-gray-300">Technologies</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-400 mb-2">16</div>
                            <div className="text-gray-300">API Endpoints</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-pink-400 mb-2">3</div>
                            <div className="text-gray-300">Auth Providers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                            <div className="text-gray-300">Production Ready</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
