'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function GlobalSearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState<'all' | 'meetings' | 'contacts' | 'notes'>('all')

    const handleSearch = async () => {
        if (!query.trim()) return

        setLoading(true)
        try {
            // Simulate search - in real app, call API
            await new Promise(resolve => setTimeout(resolve, 1000))
            setResults([
                { type: 'meeting', title: 'Product Strategy Meeting', date: '2024-01-15', snippet: 'Discussed Q1 roadmap...' },
                { type: 'contact', name: 'John Doe', company: 'Acme Inc', email: 'john@acme.com' },
                { type: 'note', title: 'Meeting Notes - Jan 15', content: 'Key points from the discussion...' },
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Tvi3W
                        </Link>
                        <p className="text-sm text-gray-400">Global Search</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Input */}
                <div className="glass-panel p-6 rounded-xl border border-gray-800 mb-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search meetings, contacts, notes..."
                            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mt-4">
                        {(['all', 'meetings', 'contacts', 'notes'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {results.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-white mb-2">No results yet</h3>
                            <p className="text-gray-400">Try searching for meetings, contacts, or notes</p>
                        </div>
                    )}

                    {results.map((result, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${result.type === 'meeting' ? 'bg-blue-500/20 text-blue-400' :
                                                result.type === 'contact' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-purple-500/20 text-purple-400'
                                            }`}>
                                            {result.type}
                                        </span>
                                        {result.date && <span className="text-xs text-gray-500">{result.date}</span>}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {result.title || result.name}
                                    </h3>
                                    {result.snippet && <p className="text-sm text-gray-400">{result.snippet}</p>}
                                    {result.company && <p className="text-sm text-gray-400">{result.company} • {result.email}</p>}
                                    {result.content && <p className="text-sm text-gray-400">{result.content}</p>}
                                </div>
                                <button className="text-blue-400 hover:text-blue-300 text-sm">
                                    View →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
