'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NewNotePage() {
    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const meetingId = searchParams.get('meeting_id')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [meetings, setMeetings] = useState<any[]>([])

    const [formData, setFormData] = useState({
        content: '',
        meeting_id: meetingId || '',
        tags: '',
    })

    useEffect(() => {
        const fetchMeetings = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { data } = await supabase
                .from('meetings')
                .select('id, title')
                .eq('user_id', session.user.id)
                .order('start_time', { ascending: false })

            if (data) setMeetings(data)
        }
        fetchMeetings()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const tags = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)

            const { error: insertError } = await supabase
                .from('notes')
                .insert({
                    user_id: session.user.id,
                    meeting_id: formData.meeting_id || null,
                    content: formData.content,
                    tags: tags.length > 0 ? tags : null,
                })

            if (insertError) throw insertError

            if (formData.meeting_id) {
                router.push(`/meetings/${formData.meeting_id}`)
            } else {
                router.push('/notes')
            }
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link href="/notes" className="text-green-400 hover:text-green-300 text-sm mb-4 inline-block">
                        ← Back to Notes
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">New Note</h1>
                    <p className="text-gray-400">Capture your thoughts and meeting notes</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Link to Meeting (optional)</label>
                        <select
                            value={formData.meeting_id}
                            onChange={(e) => setFormData({ ...formData, meeting_id: e.target.value })}
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">No meeting</option>
                            {meetings.map((meeting) => (
                                <option key={meeting.id} value={meeting.id}>
                                    {meeting.title || 'Untitled Meeting'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Note Content *</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={8}
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-green-500 focus:border-green-500"
                            placeholder="Write your note here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-green-500 focus:border-green-500"
                            placeholder="important, followup, action-item"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link
                            href="/notes"
                            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                'Save Note'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
