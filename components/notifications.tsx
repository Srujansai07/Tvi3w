'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Notification {
    id: string
    type: 'meeting_reminder' | 'action_due' | 'info'
    title: string
    message: string
    read: boolean
    createdAt: Date
    link?: string
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const supabase = createClient()

    useEffect(() => {
        async function fetchNotifications() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            // Fetch upcoming meetings for reminders
            const now = new Date()
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

            const { data: meetings } = await supabase
                .from('meetings')
                .select('id, title, start_time')
                .eq('user_id', session.user.id)
                .eq('status', 'scheduled')
                .gte('start_time', now.toISOString())
                .lte('start_time', tomorrow.toISOString())

            // Fetch pending action items
            const { data: userMeetings } = await supabase
                .from('meetings')
                .select('id')
                .eq('user_id', session.user.id)

            const meetingIds = userMeetings?.map(m => m.id) || []
            let pendingActions: any[] = []

            if (meetingIds.length > 0) {
                const { data } = await supabase
                    .from('action_items')
                    .select('id, description')
                    .in('meeting_id', meetingIds)
                    .eq('status', 'pending')
                    .limit(5)
                pendingActions = data || []
            }

            const notifs: Notification[] = []

            // Add meeting reminders
            meetings?.forEach((m) => {
                const meetingTime = new Date(m.start_time)
                const hoursUntil = Math.round((meetingTime.getTime() - now.getTime()) / (60 * 60 * 1000))
                notifs.push({
                    id: `meeting-${m.id}`,
                    type: 'meeting_reminder',
                    title: 'Upcoming Meeting',
                    message: `"${m.title}" in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''}`,
                    read: false,
                    createdAt: now,
                    link: `/meetings/${m.id}`,
                })
            })

            // Add pending actions
            pendingActions.forEach((a) => {
                notifs.push({
                    id: `action-${a.id}`,
                    type: 'action_due',
                    title: 'Pending Task',
                    message: a.description?.substring(0, 50) + (a.description?.length > 50 ? '...' : ''),
                    read: false,
                    createdAt: now,
                    link: '/action-items',
                })
            })

            setNotifications(notifs)
        }

        fetchNotifications()
        // Refresh every 5 minutes
        const interval = setInterval(fetchNotifications, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return { notifications, markAsRead, unreadCount }
}

export function NotificationBell() {
    const { notifications, markAsRead, unreadCount } = useNotifications()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 rounded-xl border border-gray-700 shadow-xl z-50">
                    <div className="p-3 border-b border-gray-700">
                        <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-400">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <a
                                    key={n.id}
                                    href={n.link || '#'}
                                    onClick={() => markAsRead(n.id)}
                                    className={`block p-3 hover:bg-gray-700/50 transition-colors ${!n.read ? 'bg-blue-900/20' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <span className="text-xl">
                                            {n.type === 'meeting_reminder' ? '📅' : '⚡'}
                                        </span>
                                        <div>
                                            <div className="text-white font-medium text-sm">{n.title}</div>
                                            <div className="text-gray-400 text-xs">{n.message}</div>
                                        </div>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
