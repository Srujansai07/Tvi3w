'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function EditMeetingPage() {
    const supabase = createClient()
    const router = useRouter()
    const params = useParams()
    const meetingId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        meeting_type: 'general',
        status: 'scheduled',
    })

    useEffect(() => {
        async function fetchMeeting() {
            const { data: meeting, error } = await supabase
                .from('meetings')
                .select('*')
                .eq('id', meetingId)
                .single()

            if (error || !meeting) {
                setError('Meeting not found')
                setLoading(false)
                return
            }

            setFormData({
                title: meeting.title || '',
                description: meeting.description || '',
                start_time: meeting.start_time ? new Date(meeting.start_time).toISOString().slice(0, 16) : '',
                end_time: meeting.end_time ? new Date(meeting.end_time).toISOString().slice(0, 16) : '',
                location: meeting.location || '',
                meeting_type: meeting.meeting_type || 'general',
                status: meeting.status || 'scheduled',
            })
            setLoading(false)
        }
        fetchMeeting()
    }, [meetingId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const { error: updateError } = await supabase
                .from('meetings')
                .update({
                    title: formData.title,
                    description: formData.description,
                    start_time: formData.start_time || null,
                    end_time: formData.end_time || null,
                    location: formData.location,
                    meeting_type: formData.meeting_type,
                    status: formData.status,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', meetingId)

            if (updateError) throw updateError

            router.push(`/meetings/${meetingId}`)
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="bg-gray-800 rounded-xl p-6 h-96"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link href={`/meetings/${meetingId}`} className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
                        ← Back to Meeting
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Edit Meeting</h1>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                            <input
                                type="datetime-local"
                                value={formData.start_time}
                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                            <input
                                type="datetime-local"
                                value={formData.end_time}
                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Type</label>
                            <select
                                value={formData.meeting_type}
                                onChange={(e) => setFormData({ ...formData, meeting_type: e.target.value })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="general">General</option>
                                <option value="one_on_one">One-on-One</option>
                                <option value="team">Team Meeting</option>
                                <option value="interview">Interview</option>
                                <option value="presentation">Presentation</option>
                                <option value="workshop">Workshop</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="draft">Draft</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link
                            href={`/meetings/${meetingId}`}
                            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
