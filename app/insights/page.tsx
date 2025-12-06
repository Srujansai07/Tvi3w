'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MeetingStats {
    total: number
    scheduled: number
    completed: number
    cancelled: number
    thisWeek: number
    thisMonth: number
    avgDuration: number
    topParticipants: { name: string; count: number }[]
}

export default function InsightsPage() {
    const supabase = createClient()
    const [stats, setStats] = useState<MeetingStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchInsights() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const now = new Date()
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

            const { data: meetings } = await supabase
                .from('meetings')
                .select('*')
                .eq('user_id', session.user.id)

            if (!meetings) {
                setLoading(false)
                return
            }

            const scheduled = meetings.filter(m => m.status === 'scheduled').length
            const completed = meetings.filter(m => m.status === 'completed').length
            const cancelled = meetings.filter(m => m.status === 'cancelled').length
            const thisWeek = meetings.filter(m =>
                new Date(m.created_at) >= weekAgo
            ).length
            const thisMonth = meetings.filter(m =>
                new Date(m.created_at) >= monthAgo
            ).length

            // Calculate average duration
            const durations = meetings
                .filter(m => m.start_time && m.end_time)
                .map(m => {
                    const start = new Date(m.start_time).getTime()
                    const end = new Date(m.end_time).getTime()
                    return (end - start) / (1000 * 60) // minutes
                })
            const avgDuration = durations.length > 0
                ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                : 0

            setStats({
                total: meetings.length,
                scheduled,
                completed,
                cancelled,
                thisWeek,
                thisMonth,
                avgDuration,
                topParticipants: [],
            })
            setLoading(false)
        }

        fetchInsights()
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-gray-800 rounded-xl p-6 h-32"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Insights</h1>
                    <p className="text-gray-400">Your meeting analytics and trends</p>
                </div>

                {/* Overview Stats */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6">
                        <div className="text-4xl mb-2">📅</div>
                        <div className="text-3xl font-bold text-white">{stats?.total || 0}</div>
                        <div className="text-blue-200">Total Meetings</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6">
                        <div className="text-4xl mb-2">✅</div>
                        <div className="text-3xl font-bold text-white">{stats?.completed || 0}</div>
                        <div className="text-green-200">Completed</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6">
                        <div className="text-4xl mb-2">⏱️</div>
                        <div className="text-3xl font-bold text-white">{stats?.avgDuration || 0}m</div>
                        <div className="text-purple-200">Avg Duration</div>
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Status Breakdown</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Scheduled</span>
                                <span className="text-blue-400">{stats?.scheduled || 0}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all"
                                    style={{ width: `${stats?.total ? (stats.scheduled / stats.total * 100) : 0}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Completed</span>
                                <span className="text-green-400">{stats?.completed || 0}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-600 rounded-full transition-all"
                                    style={{ width: `${stats?.total ? (stats.completed / stats.total * 100) : 0}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Cancelled</span>
                                <span className="text-red-400">{stats?.cancelled || 0}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-600 rounded-full transition-all"
                                    style={{ width: `${stats?.total ? (stats.cancelled / stats.total * 100) : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Analysis */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">This Week</h2>
                        <div className="text-4xl font-bold text-blue-400">{stats?.thisWeek || 0}</div>
                        <div className="text-gray-400">meetings created</div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">This Month</h2>
                        <div className="text-4xl font-bold text-purple-400">{stats?.thisMonth || 0}</div>
                        <div className="text-gray-400">meetings created</div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 flex gap-4">
                    <Link
                        href="/reports"
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        View Reports →
                    </Link>
                    <Link
                        href="/analysis"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        AI Analysis →
                    </Link>
                </div>
            </div>
        </div>
    )
}
