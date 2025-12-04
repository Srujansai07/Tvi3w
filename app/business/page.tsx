'use client'

import { useState } from 'react'

export default function BusinessPage() {
    const [pitch, setPitch] = useState('')
    const [analysis, setAnalysis] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleAnalyze = async () => {
        if (!pitch.trim()) return

        setLoading(true)
        try {
            const response = await fetch('/api/business/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pitch }),
            })

            const data = await response.json()
            if (data.success) {
                setAnalysis(data.analysis)
            }
        } catch (error) {
            console.error('Pitch analysis failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Business Pitch Analysis</h1>
                    <p className="text-gray-400">Get Shark Tank-style investor feedback</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="glass rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Your Pitch</h2>
                        <textarea
                            value={pitch}
                            onChange={(e) => setPitch(e.target.value)}
                            placeholder="Describe your business idea, product, market, and why it will succeed..."
                            className="w-full h-96 bg-slate-800/50 text-white rounded-lg p-4 border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !pitch.trim()}
                            className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all"
                        >
                            {loading ? 'Analyzing Pitch...' : 'Get Investor Feedback'}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="glass rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Investor Analysis</h2>
                        {analysis ? (
                            <div className="bg-slate-800/50 rounded-lg p-6 h-96 overflow-y-auto">
                                <pre className="text-gray-300 whitespace-pre-wrap font-sans">{analysis}</pre>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-96 text-gray-500">
                                Investor feedback will appear here
                            </div>
                        )}
                    </div>
                </div>

                {/* Analysis Criteria */}
                <div className="mt-12 glass rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">What We Analyze</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <div className="text-3xl mb-3">💪</div>
                            <h3 className="text-lg font-bold text-white mb-2">Strengths</h3>
                            <p className="text-sm text-gray-400">What makes your idea compelling</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-3">⚠️</div>
                            <h3 className="text-lg font-bold text-white mb-2">Concerns</h3>
                            <p className="text-sm text-gray-400">Potential risks and weaknesses</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-3">📈</div>
                            <h3 className="text-lg font-bold text-white mb-2">Market Potential</h3>
                            <p className="text-sm text-gray-400">Scalability and opportunity</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-3">💰</div>
                            <h3 className="text-lg font-bold text-white mb-2">Investment</h3>
                            <p className="text-sm text-gray-400">Recommendation and reasoning</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
