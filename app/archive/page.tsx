'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ArchivePage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [archived, setArchived] = useState<{
        meetings: any[]
        notes: any[]
    }>({ meetings: [], notes: [] })
    const [restoring, setRestoring] = useState<string | null>(null)

    useEffect(() => {
        async function loadArchived() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const [meetingsRes, notesRes] = await Promise.all([
                supabase
                    .from('meetings')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .eq('status', 'cancelled')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('notes')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .eq('archived', true)
                    .order('created_at', { ascending: false }),
            ])

            setArchived({
                meetings: meetingsRes.data || [],
                notes: notesRes.data || [],
            })
            setLoading(false)
        }

        loadArchived()
    }, [])

    const restoreMeeting = async (id: string) => {
        setRestoring(id)
        await supabase
            .from('meetings')
            .update({ status: 'scheduled' })
            .eq('id', id)

        setArchived(prev => ({
            ...prev,
            meetings: prev.meetings.filter(m => m.id !== id)
        }))
        setRestoring(null)
    }

    const deletePermenantly = async (type: 'meeting' | 'note', id: string) => {
        const table = type === 'meeting' ? 'meetings' : 'notes'
        await supabase.from(table).delete().eq('id', id)

        if (type === 'meeting') {
            setArchived(prev => ({
                ...prev,
                meetings: prev.meetings.filter(m => m.id !== id)
            }))
        } else {
            setArchived(prev => ({
                ...prev,
                notes: prev.notes.filter(n => n.id !== id)
            }))
        }
    }

    const total = archived.meetings.length + archived.notes.length

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto animate-pulse">
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
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-4xl">📦</span>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Archive</h1>
                        <p className="text-gray-400">{total} archived items</p>
                    </div>
                </div>

                {total === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-6xl mb-4">📦</div>
                        <div className="text-xl text-white mb-2">Archive is empty</div>
                        <p className="text-gray-400">Cancelled meetings and archived notes appear here</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Archived Meetings */}
                        {archived.meetings.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">
                                    Cancelled Meetings ({archived.meetings.length})
                                </h2>
                                <div className="space-y-3">
                                    {archived.meetings.map(meeting => (
                                        <div
                                            key={meeting.id}
                                            className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="text-white font-medium">{meeting.title}</div>
                                                <div className="text-gray-400 text-sm">
                                                    {new Date(meeting.start_time).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => restoreMeeting(meeting.id)}
                                                    disabled={restoring === meeting.id}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                                                >
                                                    {restoring === meeting.id ? '...' : 'Restore'}
                                                </button>
                                                <button
                                                    onClick={() => deletePermenantly('meeting', meeting.id)}
                                                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-sm transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Archived Notes */}
                        {archived.notes.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">
                                    Archived Notes ({archived.notes.length})
                                </h2>
                                <div className="space-y-3">
                                    {archived.notes.map(note => (
                                        <div
                                            key={note.id}
                                            className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white line-clamp-1">{note.content}</div>
                                                <div className="text-gray-400 text-sm">
                                                    {new Date(note.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deletePermenantly('note', note.id)}
                                                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-sm transition-colors ml-4"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
