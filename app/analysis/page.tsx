'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AnalysisPage() {
    const [content, setContent] = useState('')
    const [contentType, setContentType] = useState<'linkedin' | 'twitter' | 'email' | 'article'>('article')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        if (!content.trim()) {
            setError('Please enter content to analyze')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch('/api/ai/analyze-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: content,
                    type: contentType,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to analyze content')
            }

            const data = await response.json()
            setResult(data)
        } catch (err: any) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tvi3W
                            </Link>
                            <p className="text-sm text-gray-400 mt-1">Content Analysis</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="glass-panel p-8 rounded-xl border border-gray-800">
                    <h2 className="text-2xl font-bold text-white mb-6">Analyze Content</h2>

                    {/* Content Type Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Content Type
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['linkedin', 'twitter', 'email', 'article'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setContentType(type)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${contentType === type
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Content to Analyze
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste LinkedIn post, tweet, email, or article content here..."
                            className="w-full h-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !content.trim()}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                    >
                        {loading ? 'Analyzing...' : 'Analyze with AI'}
                    </button>

                    {/* Error Display */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Results Display */}
                    {result && (
                        <div className="mt-8 space-y-6">
                            {/* Summary */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
                                <p className="text-gray-300">{result.summary}</p>
                            </div>

                            {/* Key Takeaways */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Key Takeaways</h3>
                                <ul className="space-y-2">
                                    {result.keyTakeaways.map((takeaway: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-300">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>{takeaway}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Suggested Actions */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Suggested Actions</h3>
                                <ul className="space-y-2">
                                    {result.suggestedActions.map((action: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-300">
                                            <span className="text-green-400 mt-1">→</span>
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Sentiment:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${result.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                            result.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                                'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {result.sentiment}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Relevance:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${result.relevance === 'high' ? 'bg-blue-500/20 text-blue-400' :
                                            result.relevance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {result.relevance}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
