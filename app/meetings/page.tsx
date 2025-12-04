'use client'

import { useState } from 'react'

export default function MeetingsPage() {
    const [topic, setTopic] = useState('')
    const [context, setContext] = useState('')
    const [questions, setQuestions] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {
        if (!topic.trim()) return

        setLoading(true)
        try {
            const response = await fetch('/api/meetings/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, context }),
            })

            const data = await response.json()
            if (data.success) {
                setQuestions(data.questions)
            }
        } catch (error) {
            console.error('Question generation failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Meeting Companion</h1>
                    <p className="text-gray-400">AI-powered meeting assistant with dynamic questions</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="glass rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Meeting Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Meeting Topic
                                    </label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., Q4 Product Roadmap Review"
                                        className="w-full bg-slate-800/50 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Context (Optional)
                                    </label>
                                    <textarea
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        placeholder="Additional context or background information..."
                                        className="w-full h-32 bg-slate-800/50 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !topic.trim()}
                                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-all"
                                >
                                    {loading ? 'Generating...' : 'Generate Questions'}
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Features</h3>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    Dynamic question generation
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    Context-aware suggestions
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    Real-time note taking
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    Meeting summaries
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="glass rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Suggested Questions</h2>
                        {questions ? (
                            <div className="bg-slate-800/50 rounded-lg p-6 min-h-[400px]">
                                <pre className="text-gray-300 whitespace-pre-wrap font-sans">{questions}</pre>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center min-h-[400px] text-gray-500">
                                Generated questions will appear here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
