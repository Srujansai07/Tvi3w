'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface RecurringPattern {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
    endDate?: string
    daysOfWeek?: number[]
}

const FREQUENCY_OPTIONS = [
    { value: 'daily', label: 'Daily', icon: '📆' },
    { value: 'weekly', label: 'Weekly', icon: '📅' },
    { value: 'biweekly', label: 'Bi-weekly', icon: '🗓️' },
    { value: 'monthly', label: 'Monthly', icon: '📋' },
]

export default function RecurringMeetingsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [meetings, setMeetings] = useState<any[]>([])
    const [showCreate, setShowCreate] = useState(false)
    const [creating, setCreating] = useState(false)
    const [form, setForm] = useState({
        title: '',
        description: '',
        duration: 30,
        frequency: 'weekly' as RecurringPattern['frequency'],
        startDate: '',
        endDate: '',
        time: '09:00',
    })

    useEffect(() => {
        async function loadMeetings() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const { data } = await supabase
                .from('meetings')
                .select('*')
                .eq('user_id', session.user.id)
                .not('recurring_pattern', 'is', null)
                .order('created_at', { ascending: false })

            setMeetings(data || [])
            setLoading(false)
        }

        loadMeetings()
    }, [])

    const handleCreate = async () => {
        if (!form.title || !form.startDate) return

        setCreating(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        // Generate occurrences based on pattern
        const occurrences = generateOccurrences(form)

        // Create meetings for each occurrence
        const meetingsToCreate = occurrences.map(date => ({
            user_id: session.user.id,
            title: form.title,
            description: form.description,
            start_time: `${date}T${form.time}:00`,
            end_time: new Date(new Date(`${date}T${form.time}:00`).getTime() + form.duration * 60000).toISOString(),
            status: 'scheduled',
            recurring_pattern: form.frequency,
        }))

        const { error } = await supabase.from('meetings').insert(meetingsToCreate)

        if (error) {
            alert('Error creating meetings: ' + error.message)
        } else {
            setShowCreate(false)
            setForm({
                title: '',
                description: '',
                duration: 30,
                frequency: 'weekly',
                startDate: '',
                endDate: '',
                time: '09:00',
            })
            // Reload meetings
            const { data } = await supabase
                .from('meetings')
                .select('*')
                .eq('user_id', session.user.id)
                .not('recurring_pattern', 'is', null)
                .order('created_at', { ascending: false })
            setMeetings(data || [])
        }

        setCreating(false)
    }

    function generateOccurrences(config: typeof form): string[] {
        const dates: string[] = []
        const start = new Date(config.startDate)
        const end = config.endDate ? new Date(config.endDate) : new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000) // 3 months default

        let current = new Date(start)

        while (current <= end && dates.length < 52) { // Max 52 occurrences
            dates.push(current.toISOString().split('T')[0])

            switch (config.frequency) {
                case 'daily':
                    current.setDate(current.getDate() + 1)
                    break
                case 'weekly':
                    current.setDate(current.getDate() + 7)
                    break
                case 'biweekly':
                    current.setDate(current.getDate() + 14)
                    break
                case 'monthly':
                    current.setMonth(current.getMonth() + 1)
                    break
            }
        }

        return dates
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
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
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Recurring Meetings</h1>
                        <p className="text-gray-400">Schedule repeating meetings</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                        <span>🔄</span> New Recurring
                    </button>
                </div>

                {/* Create Form */}
                {showCreate && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Create Recurring Meeting</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    placeholder="Weekly Team Sync"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                                    <select
                                        value={form.frequency}
                                        onChange={(e) => setForm({ ...form, frequency: e.target.value as any })}
                                        className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    >
                                        {FREQUENCY_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.icon} {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                                    <select
                                        value={form.duration}
                                        onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                                        className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    >
                                        <option value={15}>15 min</option>
                                        <option value={30}>30 min</option>
                                        <option value={45}>45 min</option>
                                        <option value={60}>1 hour</option>
                                        <option value={90}>1.5 hours</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                        className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date (optional)</label>
                                    <input
                                        type="date"
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                        className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                                    <input
                                        type="time"
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                        className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={creating || !form.title || !form.startDate}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Recurring Meeting'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Frequency Cards */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    {FREQUENCY_OPTIONS.map(opt => {
                        const count = meetings.filter(m => m.recurring_pattern === opt.value).length
                        return (
                            <div
                                key={opt.value}
                                className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center"
                            >
                                <div className="text-3xl mb-2">{opt.icon}</div>
                                <div className="text-2xl font-bold text-white">{count}</div>
                                <div className="text-gray-400 text-sm">{opt.label}</div>
                            </div>
                        )
                    })}
                </div>

                {/* Meetings List */}
                {meetings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-6xl mb-4">🔄</div>
                        <div className="text-gray-400">No recurring meetings yet</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {meetings.map(meeting => (
                            <Link
                                key={meeting.id}
                                href={`/meetings/${meeting.id}`}
                                className="block bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium">{meeting.title}</div>
                                        <div className="text-gray-400 text-sm">
                                            {new Date(meeting.start_time).toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                                        {meeting.recurring_pattern}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
