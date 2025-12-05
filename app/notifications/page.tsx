'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'meeting', title: 'Meeting starting in 15 minutes', message: 'Product Strategy Discussion', time: '5 min ago', read: false },
        { id: 2, type: 'reminder', title: 'Follow-up reminder', message: 'Contact John Doe about proposal', time: '1 hour ago', read: false },
        { id: 3, type: 'insight', title: 'New AI insight', message: 'Pattern detected in your meetings', time: '2 hours ago', read: true },
        { id: 4, type: 'action', title: 'Action item due soon', message: 'Complete Q1 roadmap review', time: '1 day ago', read: true },
    ])

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tvi3W
                            </Link>
                            <p className="text-sm text-gray-400 mt-1">
                                Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'meeting', 'reminder', 'insight', 'action'] as const).map((filter) => (
                        <button
                            key={filter}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors capitalize"
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔔</div>
                            <h3 className="text-xl font-bold text-white mb-2">No notifications</h3>
                            <p className="text-gray-400">You're all caught up!</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`glass-panel p-4 rounded-xl border transition-colors ${notification.read
                                        ? 'border-gray-800 opacity-60'
                                        : 'border-blue-500/50 bg-blue-500/5'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${notification.type === 'meeting' ? 'bg-blue-500/20' :
                                            notification.type === 'reminder' ? 'bg-yellow-500/20' :
                                                notification.type === 'insight' ? 'bg-purple-500/20' :
                                                    'bg-green-500/20'
                                        }`}>
                                        {notification.type === 'meeting' ? '📅' :
                                            notification.type === 'reminder' ? '⏰' :
                                                notification.type === 'insight' ? '💡' :
                                                    '✅'}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="text-white font-medium">{notification.title}</h3>
                                            <span className="text-xs text-gray-500">{notification.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-400">{notification.message}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-blue-400 hover:text-blue-300 text-sm"
                                                title="Mark as read"
                                            >
                                                ✓
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                            title="Delete"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
