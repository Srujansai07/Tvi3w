'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Notification {
    id: string
    type: 'meeting' | 'reminder' | 'system'
    title: string
    message: string
    read: boolean
    timestamp: string
}

export default function NotificationsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { router.push('/login'); return }

            // Generate sample notifications from meetings
            const { data: meetings } = await supabase.from('meetings').select('id, title, start_time').eq('user_id', session.user.id).eq('status', 'scheduled').order('start_time', { ascending: true }).limit(5)

            const notifs: Notification[] = [
                { id: '1', type: 'system', title: 'Welcome!', message: 'Thanks for using Tvi3W. Start by creating your first meeting.', read: true, timestamp: new Date().toISOString() },
                ...(meetings || []).map(m => ({
                    id: m.id,
                    type: 'meeting' as const,
                    title: 'Upcoming Meeting',
                    message: m.title,
                    read: false,
                    timestamp: m.start_time,
                })),
            ]

            setNotifications(notifs)
            setLoading(false)
        }
        load()
    }, [])

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    const getIcon = (type: string) => ({ meeting: '📅', reminder: '🔔', system: '⚙️' }[type] || '📬')

    if (loading) return <div className="container mx-auto px-4 py-8"><div className="max-w-2xl mx-auto animate-pulse"><div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>{[1, 2, 3].map(i => <div key={i} className="bg-gray-800 rounded-xl p-4 h-20 mb-3"></div>)}</div></div>

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3"><span className="text-4xl">🔔</span><div><h1 className="text-3xl font-bold text-white">Notifications</h1><p className="text-gray-400">{notifications.filter(n => !n.read).length} unread</p></div></div>
                    <button onClick={markAllRead} className="text-blue-400 hover:text-blue-300 text-sm">Mark all read</button>
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700"><div className="text-6xl mb-4">🔔</div><div className="text-gray-400">No notifications</div></div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(n => (
                            <div key={n.id} className={`bg-gray-800 rounded-xl p-4 border transition-colors ${n.read ? 'border-gray-700' : 'border-blue-500 bg-blue-500/5'}`}>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{getIcon(n.type)}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="text-white font-medium">{n.title}</span>
                                            <span className="text-gray-500 text-xs">{new Date(n.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">{n.message}</p>
                                    </div>
                                    {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
