'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
    totalMeetings: number
    completedMeetings: number
    totalContacts: number
    totalNotes: number
    actionItemsCompleted: number
    actionItemsPending: number
}

export default function ReportsPage() {
    const supabase = createClient()
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            // Fetch meetings
            const { data: meetings } = await supabase
                .from('meetings')
                .select('*')
                .eq('user_id', session.user.id)

            // Fetch contacts
            const { count: contactsCount } = await supabase
                .from('contacts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', session.user.id)

            // Fetch notes
            const { count: notesCount } = await supabase
                .from('notes')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', session.user.id)

            // Fetch action items
            const meetingIds = meetings?.map(m => m.id) || []
            let actionItemsCompleted = 0
            let actionItemsPending = 0

            if (meetingIds.length > 0) {
                const { data: actionItems } = await supabase
                    .from('action_items')
                    .select('status')
                    .in('meeting_id', meetingIds)

                actionItemsCompleted = actionItems?.filter(a => a.status === 'completed').length || 0
                actionItemsPending = actionItems?.filter(a => a.status === 'pending').length || 0
            }

            setStats({
                totalMeetings: meetings?.length || 0,
                completedMeetings: meetings?.filter(m => m.status === 'completed').length || 0,
                totalContacts: contactsCount || 0,
                totalNotes: notesCount || 0,
                actionItemsCompleted,
                actionItemsPending,
            })
            setLoading(false)
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-gray-800 rounded-xl p-6 h-32"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const completionRate = stats
        ? Math.round((stats.completedMeetings / (stats.totalMeetings || 1)) * 100)
        : 0

    const taskCompletionRate = stats
        ? Math.round((stats.actionItemsCompleted / ((stats.actionItemsCompleted + stats.actionItemsPending) || 1)) * 100)
        : 0

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
                        <p className="text-gray-400">Your activity statistics and insights</p>
                    </div>
                    <Link
                        href="/export"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        Export Data
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-4xl mb-2">📅</div>
                        <div className="text-3xl font-bold text-white">{stats?.totalMeetings}</div>
                        <div className="text-gray-400">Total Meetings</div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-4xl mb-2">✅</div>
                        <div className="text-3xl font-bold text-green-400">{stats?.completedMeetings}</div>
                        <div className="text-gray-400">Completed</div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-4xl mb-2">📈</div>
                        <div className="text-3xl font-bold text-blue-400">{completionRate}%</div>
                        <div className="text-gray-400">Completion Rate</div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-4xl mb-2">👥</div>
                        <div className="text-3xl font-bold text-purple-400">{stats?.totalContacts}</div>
                        <div className="text-gray-400">Contacts</div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-4xl mb-2">📝</div>
                        <div className="text-3xl font-bold text-yellow-400">{stats?.totalNotes}</div>
                        <div className="text-gray-400">Notes</div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-4xl mb-2">⚡</div>
                        <div className="text-3xl font-bold text-orange-400">{taskCompletionRate}%</div>
                        <div className="text-gray-400">Tasks Completed</div>
                    </div>
                </div>

                {/* Task Progress */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Action Items Progress</h2>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${taskCompletionRate}%` }}
                            />
                        </div>
                        <span className="text-white font-medium">{taskCompletionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>✅ {stats?.actionItemsCompleted} completed</span>
                        <span>⏳ {stats?.actionItemsPending} pending</span>
                    </div>
                </div>

                {/* Meeting Progress */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4">Meeting Completion</h2>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                        <span className="text-white font-medium">{completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>✅ {stats?.completedMeetings} completed</span>
                        <span>📅 {(stats?.totalMeetings || 0) - (stats?.completedMeetings || 0)} remaining</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
