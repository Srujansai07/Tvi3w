'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AnalysisPage() {
    const supabase = createClient()
    const [stats, setStats] = useState({
        totalMeetings: 0,
        completedMeetings: 0,
        scheduledMeetings: 0,
        totalNotes: 0,
        totalWords: 0,
        contactsCount: 0,
    })
    const [loading, setLoading] = useState(true)
    const [analyzing, setAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStats() {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) return

                // Fetch meeting stats
                const { data: meetings } = await supabase
                    .from('meetings')
                    .select('*')
                    .eq('user_id', session.user.id)

                const completedMeetings = meetings?.filter(m => m.status === 'completed').length || 0
                const scheduledMeetings = meetings?.filter(m => m.status === 'scheduled').length || 0
                const totalMeetings = meetings?.length || 0

                // Fetch notes with content length
                const { data: notes } = await supabase
                    .from('notes')
                    .select('*')
                    .eq('user_id', session.user.id)

                const totalNotes = notes?.length || 0
                const totalWords = notes?.reduce((acc, note) => acc + (note.content?.split(' ').length || 0), 0) || 0

                // Fetch contacts count
                const { count: contactsCount } = await supabase
                    .from('contacts')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', session.user.id)

                setStats({
                    totalMeetings,
                    completedMeetings,
                    scheduledMeetings,
                    totalNotes,
                    totalWords,
                    contactsCount: contactsCount || 0,
                })
            } catch (err) {
                console.error('Error fetching stats:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const runAnalysis = async () => {
        setAnalyzing(true)
        setError(null)
        try {
            const response = await fetch('/api/ai/analyze', {
                method: 'POST',
            })
            const data = await response.json()
            if (data.error) {
                setError(data.error)
            } else {
                setAnalysis(data.analysis)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setAnalyzing(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
                        <div className="grid gap-6 md:grid-cols-4 mb-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-gray-800 rounded-xl p-6 h-24"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">AI Analysis</h1>
                    <p className="text-gray-400">Insights and analytics from your meetings</p>
                </div>

                {/* Overview Stats */}
                <div className="grid gap-6 md:grid-cols-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-800/50">
                        <div className="text-3xl font-bold text-blue-400">{stats.totalMeetings}</div>
                        <div className="text-gray-400 text-sm">Total Meetings</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-800/50">
                        <div className="text-3xl font-bold text-green-400">{stats.completedMeetings}</div>
                        <div className="text-gray-400 text-sm">Completed</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-800/50">
                        <div className="text-3xl font-bold text-purple-400">{stats.totalNotes}</div>
                        <div className="text-gray-400 text-sm">Notes Taken</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-xl p-6 border border-orange-800/50">
                        <div className="text-3xl font-bold text-orange-400">{stats.contactsCount}</div>
                        <div className="text-gray-400 text-sm">Contacts</div>
                    </div>
                </div>

                {/* AI Analysis Section */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">🤖</div>
                            <h2 className="text-xl font-semibold text-white">AI Meeting Trends Analysis</h2>
                        </div>
                        <button
                            onClick={runAnalysis}
                            disabled={analyzing}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {analyzing ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Analyzing...
                                </>
                            ) : (
                                'Run Analysis'
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {analysis ? (
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <pre className="text-gray-200 whitespace-pre-wrap font-sans">{analysis}</pre>
                        </div>
                    ) : (
                        <p className="text-gray-400">
                            Click &quot;Run Analysis&quot; to get AI-powered insights about your meeting patterns.
                        </p>
                    )}
                </div>

                {/* AI Features */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">�</div>
                            <h2 className="text-xl font-semibold text-white">Meeting Summarizer</h2>
                        </div>
                        <p className="text-gray-400 mb-4">
                            AI-powered meeting summaries that extract key points, action items, and decisions from your meeting notes.
                        </p>
                        <Link
                            href="/meetings"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium inline-block"
                        >
                            View Meetings
                        </Link>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">💡</div>
                            <h2 className="text-xl font-semibold text-white">Action Item Extractor</h2>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Automatically extract and track action items from your meeting notes with AI-powered task detection.
                        </p>
                        <Link
                            href="/notes"
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium inline-block"
                        >
                            View Notes
                        </Link>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">📧</div>
                            <h2 className="text-xl font-semibold text-white">Follow-up Generator</h2>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Generate professional follow-up emails based on your meeting notes and discussion points.
                        </p>
                        <Link
                            href="/meetings"
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium inline-block"
                        >
                            View Meetings
                        </Link>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">📊</div>
                            <h2 className="text-xl font-semibold text-white">Trend Analysis</h2>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Identify patterns in your meetings, track productivity trends, and get insights on your meeting habits.
                        </p>
                        <button
                            onClick={runAnalysis}
                            disabled={analyzing}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
                        >
                            Analyze Now
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Activity Summary</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-white">{stats.scheduledMeetings}</div>
                            <div className="text-gray-400 text-sm">Upcoming Meetings</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-white">{stats.totalWords}</div>
                            <div className="text-gray-400 text-sm">Words in Notes</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-white">
                                {Math.round((stats.completedMeetings / (stats.totalMeetings || 1)) * 100)}%
                            </div>
                            <div className="text-gray-400 text-sm">Completion Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
