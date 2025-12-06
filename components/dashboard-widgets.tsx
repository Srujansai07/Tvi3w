'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardStats {
    upcomingMeetings: number
    completedMeetings: number
    totalContacts: number
    pendingTasks: number
}

export function QuickStatsWidget() {
    const supabase = createClient()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const now = new Date().toISOString()

            // Upcoming meetings
            const { count: upcoming } = await supabase
                .from('meetings')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', session.user.id)
                .eq('status', 'scheduled')
                .gte('start_time', now)

            // Completed meetings  
            const { count: completed } = await supabase
                .from('meetings')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', session.user.id)
                .eq('status', 'completed')

            // Contacts
            const { count: contacts } = await supabase
                .from('contacts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', session.user.id)

            // Pending tasks
            const { data: meetings } = await supabase
                .from('meetings')
                .select('id')
                .eq('user_id', session.user.id)

            let pendingTasks = 0
            if (meetings && meetings.length > 0) {
                const { count } = await supabase
                    .from('action_items')
                    .select('*', { count: 'exact', head: true })
                    .in('meeting_id', meetings.map(m => m.id))
                    .eq('status', 'pending')
                pendingTasks = count || 0
            }

            setStats({
                upcomingMeetings: upcoming || 0,
                completedMeetings: completed || 0,
                totalContacts: contacts || 0,
                pendingTasks,
            })
            setLoading(false)
        }

        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-800 rounded-xl p-4 h-24"></div>
                ))}
            </div>
        )
    }

    const statCards = [
        { label: 'Upcoming', value: stats?.upcomingMeetings || 0, icon: '📅', color: 'blue', link: '/meetings' },
        { label: 'Completed', value: stats?.completedMeetings || 0, icon: '✅', color: 'green', link: '/meetings' },
        { label: 'Contacts', value: stats?.totalContacts || 0, icon: '👥', color: 'purple', link: '/contacts' },
        { label: 'Pending Tasks', value: stats?.pendingTasks || 0, icon: '⚡', color: 'orange', link: '/action-items' },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat) => (
                <Link
                    key={stat.label}
                    href={stat.link}
                    className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                </Link>
            ))}
        </div>
    )
}

export function RecentActivityWidget() {
    const supabase = createClient()
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecent() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { data: meetings } = await supabase
                .from('meetings')
                .select('id, title, created_at')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(5)

            setActivities(meetings?.map(m => ({
                type: 'meeting',
                title: m.title,
                date: m.created_at,
                link: `/meetings/${m.id}`
            })) || [])
            setLoading(false)
        }

        fetchRecent()
    }, [])

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-gray-700 rounded"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Recent Activity</h3>
                <Link href="/activity" className="text-blue-400 text-sm hover:underline">View all</Link>
            </div>

            {activities.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
                <div className="space-y-2">
                    {activities.map((activity, i) => (
                        <Link
                            key={i}
                            href={activity.link}
                            className="block p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span>📅</span>
                                <div className="flex-1">
                                    <div className="text-white text-sm">{activity.title || 'Untitled'}</div>
                                    <div className="text-gray-500 text-xs">
                                        {new Date(activity.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export function QuickActionsWidget() {
    const actions = [
        { label: 'New Meeting', icon: '📅', href: '/meetings/new' },
        { label: 'Add Contact', icon: '👤', href: '/contacts/new' },
        { label: 'Create Note', icon: '📝', href: '/notes/new' },
        { label: 'AI Analysis', icon: '🤖', href: '/analysis' },
    ]

    return (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
                {actions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-2 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                    >
                        <span className="text-xl">{action.icon}</span>
                        <span className="text-white text-sm">{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
