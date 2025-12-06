'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Activity {
    id: string
    type: 'meeting' | 'contact' | 'note'
    action: 'created' | 'updated' | 'completed'
    title: string
    createdAt: Date
    link: string
}

export default function ActivityPage() {
    const supabase = createClient()
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchActivity() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const allActivities: Activity[] = []

            // Recent meetings
            const { data: meetings } = await supabase
                .from('meetings')
                .select('id, title, created_at, status')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(10)

            meetings?.forEach((m) => {
                allActivities.push({
                    id: `meeting-${m.id}`,
                    type: 'meeting',
                    action: m.status === 'completed' ? 'completed' : 'created',
                    title: m.title || 'Untitled Meeting',
                    createdAt: new Date(m.created_at),
                    link: `/meetings/${m.id}`,
                })
            })

            // Recent contacts
            const { data: contacts } = await supabase
                .from('contacts')
                .select('id, name, created_at')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(10)

            contacts?.forEach((c) => {
                allActivities.push({
                    id: `contact-${c.id}`,
                    type: 'contact',
                    action: 'created',
                    title: c.name,
                    createdAt: new Date(c.created_at),
                    link: `/contacts`,
                })
            })

            // Recent notes
            const { data: notes } = await supabase
                .from('notes')
                .select('id, content, created_at')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(10)

            notes?.forEach((n) => {
                allActivities.push({
                    id: `note-${n.id}`,
                    type: 'note',
                    action: 'created',
                    title: n.content?.substring(0, 50) + '...' || 'Note',
                    createdAt: new Date(n.created_at),
                    link: `/notes`,
                })
            })

            // Sort by date
            allActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            setActivities(allActivities.slice(0, 20))
            setLoading(false)
        }

        fetchActivity()
    }, [])

    const getIcon = (type: string) => {
        switch (type) {
            case 'meeting': return '📅'
            case 'contact': return '👤'
            case 'note': return '📝'
            default: return '📌'
        }
    }

    const getActionText = (action: string) => {
        switch (action) {
            case 'created': return 'Created'
            case 'updated': return 'Updated'
            case 'completed': return 'Completed'
            default: return action
        }
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-gray-800 rounded-xl p-4 mb-3 h-16"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Activity Feed</h1>
                <p className="text-gray-400 mb-8">Your recent actions and updates</p>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                    {activities.map((activity) => (
                        <Link
                            key={activity.id}
                            href={activity.link}
                            className="block relative pl-14 pb-6 hover:bg-gray-800/30 rounded-lg -ml-2 p-2 transition-colors"
                        >
                            {/* Timeline dot */}
                            <div className="absolute left-3 top-3 w-5 h-5 rounded-full bg-gray-800 border-2 border-blue-500 flex items-center justify-center text-xs">
                                {getIcon(activity.type)}
                            </div>

                            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${activity.action === 'completed' ? 'bg-green-900/50 text-green-400' :
                                                activity.action === 'created' ? 'bg-blue-900/50 text-blue-400' :
                                                    'bg-purple-900/50 text-purple-400'
                                            }`}>
                                            {getActionText(activity.action)}
                                        </span>
                                        <p className="text-white mt-1">{activity.title}</p>
                                    </div>
                                    <span className="text-gray-500 text-sm">{formatTime(activity.createdAt)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {activities.length === 0 && (
                        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                            <div className="text-4xl mb-3">📭</div>
                            <h3 className="text-white font-medium mb-1">No activity yet</h3>
                            <p className="text-gray-400 text-sm">Create a meeting, contact, or note to see your activity here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
