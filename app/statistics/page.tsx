'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Stats {
    meetings: {
        total: number
        scheduled: number
        completed: number
        cancelled: number
        avgDuration: number
    }
    contacts: {
        total: number
        withCompany: number
    }
    notes: {
        total: number
        thisWeek: number
        avgLength: number
    }
    activity: {
        meetingsThisWeek: number
        meetingsThisMonth: number
        mostActiveDay: string
    }
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function StatisticsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<Stats | null>(null)

    useEffect(() => {
        async function loadStats() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const now = new Date()
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

            const [meetingsRes, contactsRes, notesRes] = await Promise.all([
                supabase.from('meetings').select('*').eq('user_id', session.user.id),
                supabase.from('contacts').select('*').eq('user_id', session.user.id),
                supabase.from('notes').select('*').eq('user_id', session.user.id),
            ])

            const meetings = meetingsRes.data || []
            const contacts = contactsRes.data || []
            const notes = notesRes.data || []

            // Calculate meeting stats
            const scheduled = meetings.filter(m => m.status === 'scheduled').length
            const completed = meetings.filter(m => m.status === 'completed').length
            const cancelled = meetings.filter(m => m.status === 'cancelled').length

            const durations = meetings
                .filter(m => m.start_time && m.end_time)
                .map(m => {
                    const start = new Date(m.start_time).getTime()
                    const end = new Date(m.end_time).getTime()
                    return (end - start) / (1000 * 60)
                })
            const avgDuration = durations.length > 0
                ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                : 0

            // Calculate activity
            const meetingsThisWeek = meetings.filter(m =>
                new Date(m.created_at) >= weekAgo
            ).length
            const meetingsThisMonth = meetings.filter(m =>
                new Date(m.created_at) >= monthAgo
            ).length

            // Find most active day
            const dayCount = [0, 0, 0, 0, 0, 0, 0]
            meetings.forEach(m => {
                const day = new Date(m.start_time).getDay()
                dayCount[day]++
            })
            const maxDayIndex = dayCount.indexOf(Math.max(...dayCount))

            // Notes stats
            const notesThisWeek = notes.filter(n =>
                new Date(n.created_at) >= weekAgo
            ).length
            const avgNoteLength = notes.length > 0
                ? Math.round(notes.reduce((sum, n) => sum + (n.content?.length || 0), 0) / notes.length)
                : 0

            setStats({
                meetings: {
                    total: meetings.length,
                    scheduled,
                    completed,
                    cancelled,
                    avgDuration,
                },
                contacts: {
                    total: contacts.length,
                    withCompany: contacts.filter(c => c.company).length,
                },
                notes: {
                    total: notes.length,
                    thisWeek: notesThisWeek,
                    avgLength: avgNoteLength,
                },
                activity: {
                    meetingsThisWeek,
                    meetingsThisMonth,
                    mostActiveDay: DAYS[maxDayIndex],
                },
            })
            setLoading(false)
        }

        loadStats()
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
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-4xl">📊</span>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Statistics</h1>
                        <p className="text-gray-400">Your productivity overview</p>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6">
                        <div className="text-4xl mb-2">📅</div>
                        <div className="text-3xl font-bold text-white">{stats?.meetings.total || 0}</div>
                        <div className="text-blue-200">Total Meetings</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6">
                        <div className="text-4xl mb-2">👥</div>
                        <div className="text-3xl font-bold text-white">{stats?.contacts.total || 0}</div>
                        <div className="text-purple-200">Contacts</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6">
                        <div className="text-4xl mb-2">📝</div>
                        <div className="text-3xl font-bold text-white">{stats?.notes.total || 0}</div>
                        <div className="text-green-200">Notes</div>
                    </div>
                </div>

                {/* Meeting Stats */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Meeting Breakdown</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">{stats?.meetings.scheduled || 0}</div>
                            <div className="text-gray-400 text-sm">Scheduled</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">{stats?.meetings.completed || 0}</div>
                            <div className="text-gray-400 text-sm">Completed</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-red-400">{stats?.meetings.cancelled || 0}</div>
                            <div className="text-gray-400 text-sm">Cancelled</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">{stats?.meetings.avgDuration || 0}m</div>
                            <div className="text-gray-400 text-sm">Avg Duration</div>
                        </div>
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Activity</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">This Week</span>
                                <span className="text-white font-medium">{stats?.activity.meetingsThisWeek || 0} meetings</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">This Month</span>
                                <span className="text-white font-medium">{stats?.activity.meetingsThisMonth || 0} meetings</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Most Active Day</span>
                                <span className="text-white font-medium">{stats?.activity.mostActiveDay || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Notes</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">This Week</span>
                                <span className="text-white font-medium">{stats?.notes.thisWeek || 0} notes</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Avg Length</span>
                                <span className="text-white font-medium">{stats?.notes.avgLength || 0} chars</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">With Company</span>
                                <span className="text-white font-medium">{stats?.contacts.withCompany || 0} contacts</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 flex gap-4">
                    <Link
                        href="/insights"
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        View Insights →
                    </Link>
                    <Link
                        href="/reports"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        Generate Report →
                    </Link>
                </div>
            </div>
        </div>
    )
}
