'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RemindersPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([])

    useEffect(() => {
        async function loadReminders() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const now = new Date()
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

            const { data } = await supabase
                .from('meetings')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('status', 'scheduled')
                .gte('start_time', now.toISOString())
                .lte('start_time', weekFromNow.toISOString())
                .order('start_time', { ascending: true })

            setUpcomingMeetings(data || [])
            setLoading(false)
        }

        loadReminders()
    }, [])

    const getTimeLabel = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = date.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)

        if (hours < 1) return 'Starting soon!'
        if (hours < 24) return `In ${hours} hour${hours > 1 ? 's' : ''}`
        if (days === 1) return 'Tomorrow'
        return `In ${days} days`
    }

    const getUrgencyColor = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const hours = (date.getTime() - now.getTime()) / (1000 * 60 * 60)

        if (hours < 2) return 'border-red-500 bg-red-500/10'
        if (hours < 24) return 'border-yellow-500 bg-yellow-500/10'
        return 'border-blue-500 bg-blue-500/10'
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-800 rounded-xl p-6 h-24"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-4xl">🔔</span>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Reminders</h1>
                        <p className="text-gray-400">Upcoming meetings this week</p>
                    </div>
                </div>

                {upcomingMeetings.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-6xl mb-4">🎉</div>
                        <div className="text-xl text-white mb-2">All clear!</div>
                        <p className="text-gray-400 mb-6">No upcoming meetings this week</p>
                        <Link
                            href="/meetings/new"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Schedule Meeting
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcomingMeetings.map(meeting => (
                            <Link
                                key={meeting.id}
                                href={`/meetings/${meeting.id}`}
                                className={`block rounded-xl p-5 border-2 transition-colors hover:bg-gray-700/50 ${getUrgencyColor(meeting.start_time)}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-white font-semibold text-lg">{meeting.title}</div>
                                        <div className="text-gray-400 text-sm mt-1">
                                            {new Date(meeting.start_time).toLocaleString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                                        {getTimeLabel(meeting.start_time)}
                                    </span>
                                </div>
                                {meeting.description && (
                                    <p className="text-gray-500 text-sm mt-3 line-clamp-1">{meeting.description}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Legend */}
                <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Priority Colors</h3>
                    <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-gray-400">Starting soon</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-gray-400">Today</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-gray-400">This week</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
