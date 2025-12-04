'use client'

import { useState } from 'react'

export default function AnalysisPage() {
    const [content, setContent] = useState('')
    const [analysis, setAnalysis] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        if (!content.trim()) return

        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            })

            const data = await response.json()
            if (data.success) {
                setAnalysis(data.analysis)
            } else {
                setError(data.error || 'Analysis failed')
            }
        } catch (error) {
            console.error('Analysis failed:', error)
            setError('Network error - please try again')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Content Analysis</h1>
                    <p className="text-gray-400">AI-powered insights and sentiment analysis</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="glass rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Input Content</h2>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your content here for analysis..."
                            className="w-full h-64 bg-slate-800/50 text-white rounded-lg p-4 border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !content.trim()}
                            className="mt-4 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-all"
                        >
                            {loading ? 'Analyzing...' : 'Analyze Content'}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="glass rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">AI Analysis</h2>
                        {error ? (
                            <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 h-64 overflow-y-auto">
                                <p className="text-red-400 font-semibold mb-2">❌ Error</p>
                                <p className="text-red-300">{error}</p>
                            </div>
                        ) : analysis ? (
                            <div className="bg-slate-800/50 rounded-lg p-6 h-64 overflow-y-auto">
                                <pre className="text-gray-300 whitespace-pre-wrap font-sans">{analysis}</pre>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                Your analysis results will appear here
                            </div>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-3">🎯</div>
                        <h3 className="text-lg font-bold text-white mb-2">Key Insights</h3>
                        <p className="text-sm text-gray-400">Extract main points and themes</p>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-3">😊</div>
                        <h3 className="text-lg font-bold text-white mb-2">Sentiment Analysis</h3>
                        <p className="text-sm text-gray-400">Detect emotional tone</p>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-3">💡</div>
                        <h3 className="text-lg font-bold text-white mb-2">Recommendations</h3>
                        <p className="text-sm text-gray-400">Actionable next steps</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
