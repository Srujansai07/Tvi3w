'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('30d')

    useEffect(() => {
        fetchAnalytics()
    }, [period])

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/analytics?period=${period}`)
            const data = await response.json()
            setAnalytics(data.analytics)
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !analytics) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-white">Loading analytics...</div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tvi3W
                            </Link>
                            <p className="text-sm text-gray-400 mt-1">Analytics Dashboard</p>
                        </div>
                        <div className="flex gap-2">
                            {(['7d', '30d', '90d', '1y'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <p className="text-sm text-gray-400 mb-2">Total Meetings</p>
                        <p className="text-3xl font-bold text-white mb-1">{analytics.meetings.total}</p>
                        <p className="text-sm text-green-400">{analytics.meetings.trend} vs last period</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <p className="text-sm text-gray-400 mb-2">Total Contacts</p>
                        <p className="text-3xl font-bold text-white mb-1">{analytics.contacts.total}</p>
                        <p className="text-sm text-blue-400">+{analytics.contacts.newThisMonth} this month</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <p className="text-sm text-gray-400 mb-2">AI Insights</p>
                        <p className="text-3xl font-bold text-white mb-1">{analytics.insights.total}</p>
                        <p className="text-sm text-purple-400">{analytics.insights.actionable} actionable</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <p className="text-sm text-gray-400 mb-2">Completion Rate</p>
                        <p className="text-3xl font-bold text-white mb-1">{analytics.productivity.completionRate}%</p>
                        <p className="text-sm text-yellow-400">{analytics.productivity.actionItemsPending} pending</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Meetings by Type */}
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Meetings by Type</h3>
                        <div className="space-y-3">
                            {Object.entries(analytics.meetings.byType).map(([type, count]) => (
                                <div key={type}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400 capitalize">{type}</span>
                                        <span className="text-white">{count as number}</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500"
                                            style={{ width: `${((count as number) / analytics.meetings.total) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Contacts */}
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Contacts</h3>
                        <div className="space-y-3">
                            {analytics.contacts.topContacts.map((contact: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {contact.name[0]}
                                        </div>
                                        <span className="text-white">{contact.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">{contact.interactions} interactions</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Distribution */}
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Time Distribution</h3>
                        <div className="space-y-3">
                            {analytics.timeDistribution.map((day: any) => (
                                <div key={day.day}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">{day.day}</span>
                                        <span className="text-white">{day.hours}h</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: `${(day.hours / 8) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Productivity Stats */}
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Productivity</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Meetings per Week</p>
                                <p className="text-2xl font-bold text-white">{analytics.productivity.meetingsPerWeek}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Avg Meeting Duration</p>
                                <p className="text-2xl font-bold text-white">{analytics.productivity.avgMeetingDuration} min</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Action Items</p>
                                <p className="text-white">
                                    <span className="text-green-400">{analytics.productivity.actionItemsCompleted} completed</span>
                                    {' / '}
                                    <span className="text-yellow-400">{analytics.productivity.actionItemsPending} pending</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
