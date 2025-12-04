'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BusinessPage() {
    const [pitch, setPitch] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () {
        if (!pitch.trim()) {
            setError('Please enter a business pitch')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch('/api/business/analyze-pitch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pitch }),
            })

            if (!response.ok) {
                throw new Error('Failed to analyze pitch')
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
                            <p className="text-sm text-gray-400 mt-1">Business Pitch Analysis</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="glass-panel p-8 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-4xl">🦈</span>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Shark Tank Analysis</h2>
                            <p className="text-sm text-gray-400">Get investor-style feedback on your pitch</p>
                        </div>
                    </div>

                    {/* Pitch Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your Business Pitch
                        </label>
                        <textarea
                            value={pitch}
                            onChange={(e) => setPitch(e.target.value)}
                            placeholder="Describe your business idea, problem you're solving, target market, business model, and traction..."
                            className="w-full h-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !pitch.trim()}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                    >
                        {loading ? 'Analyzing Pitch...' : 'Get Shark Tank Feedback'}
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
                            {/* Investment Recommendation */}
                            <div className={`p-6 rounded-lg border-2 ${result.investmentRecommendation === 'yes' ? 'bg-green-500/10 border-green-500' :
                                    result.investmentRecommendation === 'no' ? 'bg-red-500/10 border-red-500' :
                                        'bg-yellow-500/10 border-yellow-500'
                                }`}>
                                <h3 className="text-xl font-bold text-white mb-2">Investment Decision</h3>
                                <p className={`text-2xl font-bold ${result.investmentRecommendation === 'yes' ? 'text-green-400' :
                                        result.investmentRecommendation === 'no' ? 'text-red-400' :
                                            'text-yellow-400'
                                    }`}>
                                    {result.investmentRecommendation.toUpperCase()}
                                </p>
                            </div>

                            {/* Strengths */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {result.strengths.map((strength: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-300 bg-green-500/5 p-3 rounded-lg">
                                            <span className="text-green-400 mt-1">+</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Weaknesses */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <span className="text-red-400">✗</span> Weaknesses
                                </h3>
                                <ul className="space-y-2">
                                    {result.weaknesses.map((weakness: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-300 bg-red-500/5 p-3 rounded-lg">
                                            <span className="text-red-400 mt-1">-</span>
                                            <span>{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Market Viability */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Market Viability</h3>
                                <p className="text-gray-300 bg-gray-800/50 p-4 rounded-lg">{result.marketViability}</p>
                            </div>

                            {/* Implementation Roadmap */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Implementation Roadmap</h3>
                                <ol className="space-y-2">
                                    {result.implementationRoadmap.map((step: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-300">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="pt-0.5">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Risks */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <span className="text-yellow-400">⚠</span> Key Risks
                                </h3>
                                <ul className="space-y-2">
                                    {result.risks.map((risk: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-300 bg-yellow-500/5 p-3 rounded-lg">
                                            <span className="text-yellow-400 mt-1">!</span>
                                            <span>{risk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
