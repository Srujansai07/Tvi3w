'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Meeting {
    id: string
    title: string
    start_time: string
    status: string
}

export default function CalendarPage() {
    const supabase = createClient()
    const router = useRouter()
    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())

    useEffect(() => {
        async function fetchMeetings() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const { data } = await supabase
                .from('meetings')
                .select('id, title, start_time, status')
                .eq('user_id', session.user.id)

            setMeetings(data || [])
            setLoading(false)
        }
        fetchMeetings()
    }, [])

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const getMeetingsForDay = (day: number) => {
        return meetings.filter(m => {
            if (!m.start_time) return false
            const meetingDate = new Date(m.start_time)
            return (
                meetingDate.getFullYear() === year &&
                meetingDate.getMonth() === month &&
                meetingDate.getDate() === day
            )
        })
    }

    const days = []
    for (let i = 0; i < startingDay; i++) {
        days.push(<div key={`empty-${i}`} className="p-2 h-24"></div>)
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dayMeetings = getMeetingsForDay(day)
        const isToday =
            new Date().getFullYear() === year &&
            new Date().getMonth() === month &&
            new Date().getDate() === day

        days.push(
            <div
                key={day}
                className={`p-2 border border-gray-700 h-24 overflow-hidden ${isToday ? 'bg-blue-900/30 border-blue-600' : 'hover:bg-gray-800/50'
                    }`}
            >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-400' : 'text-gray-400'}`}>
                    {day}
                </div>
                <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map(m => (
                        <Link
                            key={m.id}
                            href={`/meetings/${m.id}`}
                            className={`block text-xs px-1 py-0.5 rounded truncate ${m.status === 'completed' ? 'bg-green-900/50 text-green-300' :
                                    m.status === 'cancelled' ? 'bg-red-900/50 text-red-300' :
                                        'bg-blue-900/50 text-blue-300'
                                }`}
                        >
                            {m.title || 'Untitled'}
                        </Link>
                    ))}
                    {dayMeetings.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayMeetings.length - 2} more</div>
                    )}
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="bg-gray-800 rounded-xl h-96"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Calendar</h1>
                    <Link
                        href="/meetings/new"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        + New Meeting
                    </Link>
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            ←
                        </button>
                        <h2 className="text-xl font-semibold text-white">
                            {monthNames[month]} {year}
                        </h2>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            →
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-gray-700">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-2 text-center text-gray-400 text-sm font-medium">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7">
                        {days}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-600"></div>
                        <span className="text-gray-400">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-600"></div>
                        <span className="text-gray-400">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-600"></div>
                        <span className="text-gray-400">Cancelled</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
